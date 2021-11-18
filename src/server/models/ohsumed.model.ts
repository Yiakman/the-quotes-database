import { esclient, index, type } from '../../ohsumed'
import { OhsumedData } from '../../models'
import { convertRawText } from '../../ohsumed'
import { SearchQuery, SearchResults, ElasticHits } from '../../types'

import W2VHandler from '../../word_processor/W2VHandler'

export async function getOhsumed(req: SearchQuery): Promise<SearchResults<OhsumedData>> {
  const wsv = await W2VHandler.getInstance()
  const query: any = {
    query: {
      bool: {
        filter: [
          {
            "terms": {
                "_id": ["Gdf7Mn0B3DPNdq_964Pz"]
            }
          },
          {
            "sltr": {
              "_name": "logged_featureset",
              "featureset": "ohsumed_features_1",
              "params": {
                text: req.text,
                "query_vector": Array.from(await wsv.centroid_in(req.text).data())
              }
            }
          }  
        ],
      }
    },
    _source: {
      exclude: ['word2vec_centroid']
    },
    ext: {
      ltr_log: {
        log_specs: {
          name: "log_entry1",
          named_query: "logged_featureset"
        }
      }
    }
  }

  const { body: { hits } } = await esclient.search({
    from:  req.page  || 0,
    size:  req.limit || 100,
    index: index,
    type:  type,
    body:  query
  })

  const results = hits.total.value
  const values = hits.hits.map((hit: ElasticHits<OhsumedData>) => ({
      id:     hit._source.document_id,
      title:  hit._source.title,
      body:  hit._source.body,
      score:  hit._score,
      _ltr: hit.fields?._ltrlog?.[0]?.log_entry1
    })
  )
  
  return { results, values }
}

export async function insertNewOhsumed(rawText: string) {
  const ohsumedDoc = await convertRawText(rawText)
  return esclient.index({
    index,
    type,
    body: {
      title: ohsumedDoc.title,
      body: ohsumedDoc.body,
      word2vec_centroid: ohsumedDoc.word2vec_centroid,
      document_id: ohsumedDoc.document_id
    }
  })
}
