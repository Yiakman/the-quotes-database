import { LTRResults } from "../types"

export type QuoteData = {
    quote: string
    author: string
}

export type OhsumedData = {
    title: string
    body: string
    word2vec_centroid?: number[]
    document_id?: string
    fasttext_centroid?: number[]
    _ltr?: LTRResults
}
