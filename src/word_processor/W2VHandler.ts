import path from 'path'
import * as tf from '@tensorflow/tfjs'
import * as tfn from '@tensorflow/tfjs-node'

import { GraphModel, Tensor2D, Rank, Tensor } from '@tensorflow/tfjs'
import { stopWords } from '../data/stopwords'
import vocabulary from '../data/vocabulary.json'

const pathToModel = process.env.KERAS_MODEL_PATH ?? path.normalize('D:/Code/the-quotes-database/keras_model/model.json')

const numerical_regex = /\b[0-9]+((hour|day|week)s?)?\b/g
const punctuation_regex = /[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g

let vocab: Record<string, number> = Object.fromEntries(vocabulary.vocab.map((e: string, i: number)=>([e,i])))

export default class W2VHandler {
  private static _instance: W2VHandler
  in_embeddings: Tensor2D
  out_embeddings: Tensor2D
  // Implemented as a Singleton
  private constructor(model: GraphModel) {
    this.in_embeddings = model.weights['w2v_embedding_in'][0] as Tensor<Rank.R2>
    this.out_embeddings = model.weights['w2v_embedding_out'][0] as Tensor<Rank.R2>
  }
  private static async _load(): Promise<void> {
    const handler = tfn.io.fileSystem(pathToModel)
    const model = await tf.loadGraphModel(handler)
    W2VHandler._instance = new W2VHandler(model)
    console.log('Loaded W2VHandler 🎸🎸🎸')
  }
  static async getInstance(): Promise<W2VHandler> {
    if (!W2VHandler._instance) await W2VHandler._load()
    return W2VHandler._instance
  }

  get_w2v_in(word: string): Tensor<Rank.R2> {
    const index = vocab[word] ?? 0
    return this.in_embeddings.slice(index, 1)
  }
  get_w2v_out(word: string): Tensor<Rank.R2> {
    const index = vocab[word] ?? 0
    return this.out_embeddings.slice(index, 1)
  }
  
  private _centroid(text: string, w2vMethod: (word: string) => Tensor): Tensor<Rank.R1> {
    const cleanText = text.toLowerCase()
      .replace(punctuation_regex,'')
      .replace(numerical_regex, '')
      .split(/\s+/).filter(w => w && !stopWords.has(w))
    const shape = w2vMethod('[UNK]').shape as [number, number]
    let result: Tensor<Rank.R2> = tf.zeros(shape)
    for (const word of cleanText) {
      result = result.add(w2vMethod(word))
    }
    return result
      .div(tf.scalar(cleanText.length)) // divide the sum to get centroid
      .reshape([shape[1]])  // to Tensor1D
  }
  centroid_in(text: string): Tensor<Rank.R1> {
    return this._centroid(text, this.get_w2v_in.bind(this))
  }
  centroid_out(text: string): Tensor<Rank.R1> {
    return this._centroid(text, this.get_w2v_out.bind(this))
  }

}
