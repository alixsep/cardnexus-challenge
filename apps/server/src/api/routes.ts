import express from 'express'
import * as metadataService from '@/services/metadata.service'
import * as cardSearchService from '@/services/search.service'
import { importJson } from '@/helpers/import-json'

import type { Router, Request, Response, NextFunction } from 'express'

const router: Router = express.Router()

// API Status Route
router.get('/', (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'API is running' })
  } catch (error) {
    // Pass errors to error handling middleware
    next(error)
  }
})

// Search Route
router.post('/search', async (req, res, next) => {
  try {
    const searchResults = await cardSearchService.searchCards(req)
    res.json(searchResults)
  } catch (error) {
    next(error)
  }
})

// Metadata Route
router.get('/metadata', async (_req, res, next) => {
  try {
    const metadata = await metadataService.getCardsMetadata()
    res.json(metadata)
  } catch (error) {
    next(error)
  }
})

router.get('/import-json', async (_req, res, next) => {
  try {
    await importJson()
    res.json({ message: 'Data imported successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
