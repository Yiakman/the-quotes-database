import path from 'path'
import { readdir, readFile } from 'fs/promises'
import { Client } from '@elastic/elasticsearch'
import { OhsumedData } from './models'
import W2VHandler from './word_processor/W2VHandler'

require('dotenv').config()

export const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200'
export const esclient   = new Client({ node: elasticUrl })
export const index      = 'ohsumed'
export const type       = 'ohsumed'

/**
* @function setOhsumedMapping,
* @returns {Promise<void>}
* @description Sets the ohsumed mapping to the database.
*/

export async function setOhsumedMapping (): Promise<void> {
  try {
    const schema = {
      title: {
        type: "text"
      },
      body: {
        type: "text"
      },
      document_id: {
        type: "text"
      },
      word2vec_centroid: {
        type: 'dense_vector',
        dims: 256
      },
/*       fasttext_centroid: {
        type: 'dense_vector',
        dims: 300
      } */
    };

    await esclient.indices.putMapping({
      index,
      type,
      include_type_name: true,
      body: {
        properties: schema
      }
    })
    console.log('💯 Ohsumed mapping created successfully')

  } catch (err) {
    console.error('An error occurred while setting the ohsumed mapping:')
    console.error(err);
  }
}


export async function convertRawText(rawText: string, doc_id?: string): Promise<OhsumedData> {
  const [title, body] = rawText.trim().split(/\n((.|\n)+)/)
  // const fasttext_centroid = Array(300).fill(0)
  const word2vec_centroid_data = await ((await (W2VHandler.getInstance())).centroid_out(rawText)).data()
  const word2vec_centroid = Array.from(word2vec_centroid_data)
  return { title, body, word2vec_centroid, document_id: doc_id ?? '00000' }
}


const esAction = {
  index: {
    _index: 'ohsumed',
    _type: 'ohsumed'
  }
}
/**
* @function populateDatabase,
* @returns {Promise<void>}
* @description Receives a path to the folder where the text files
*              are located. For each file, it converts it to a ohsumed-data
               object and sends it to elasticsearch
*/
export async function populateDatabase(dirpath: string, limit?: number, skip?: number): Promise<void> {
  const docs = []
  const files = await readdir(dirpath)
  for (const fileName of files.slice(skip ?? 0,(limit ?? 100)+(skip ?? 0))) {
    const rawText = await readFile(dirpath +'/'+path.normalize(fileName), 'utf-8')
    const ohsumedData = await convertRawText(rawText, fileName)
    docs.push(esAction, ohsumedData)
  }
  
  const result = await esclient.bulk({ body: docs });
  console.log(result.body.items);
}
