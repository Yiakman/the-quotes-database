import express from 'express'
import * as controller from '../controllers'
import * as ohsumedController from '../controllers/ohsumed.controller'

export const quotes = express.Router()
  quotes.route('/')
    .get(controller.getQuotes)
    .post(controller.addQuote)


export const ohsumed = express.Router()
  ohsumed.route('/')
  .get(ohsumedController.getOhsumeds)
  .post(ohsumedController.addOhsumed)