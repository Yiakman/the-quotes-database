import { Request, Response } from 'express'
import { OhsumedData } from '../../models'
import { SearchRequest, SearchResponse } from '../../types'
import * as model from '../models/ohsumed.model'

/**
 * @function getQuotes
 * @description Handles the quotes search
 */

export async function getOhsumeds(
  req: SearchRequest<OhsumedData>,
  res: SearchResponse<OhsumedData>
): Promise<SearchResponse<OhsumedData>> {
  const query  = req.query

  if (!query.text) {
    return res.status(422).json({
      success: false,
      data: "Missing required parameter: text"
    })
  }

  try {
    const result = await model.getOhsumed(req.query)
    return res.json({ success: true, data: result })
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Unknown error.'})
  }
}

/**
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {Promise<Response>}
 */

export async function addOhsumed(req: Request, res: Response): Promise<Response> {

  const body = req.body

  if (!body.text) return res.status(422).json({
    error: true,
    data: "Missing required parameter(s): 'text'"
  })

  try {

    const result = await model.insertNewOhsumed(body.text)
    return res.json({ 
      success: true, 
      data: {
        id:     result.body.document_id,
        title: body.title,
        body: body.body,
      }
    })

  } catch (err) {
    return res.status(500).json({ success: false, error: 'Unknown error.'})
  }

}
