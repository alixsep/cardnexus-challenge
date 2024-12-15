import fs from 'node:fs/promises'
import path from 'node:path'
import { Card } from '@/db/models/card'

import type { ICard } from '@cardnexus-challenge/types'

// Helper function to import and process JSON files
export const importJson = async () => {
  try {
    // Define paths to JSON files
    const mtgCardsPath = path.join(__dirname, '../json/mtg-cards.json')
    const lorcanaCardsPath = path.join(__dirname, '../json/lorcana-cards.json')

    // Read JSON files
    const [mtgCards, lorcanaCards] = await Promise.all([
      fs.readFile(mtgCardsPath, 'utf-8').then(data => JSON.parse(data)),
      fs.readFile(lorcanaCardsPath, 'utf-8').then(data => JSON.parse(data)),
    ])

    // TODO: Add Zod schema validation for the JSON data

    // Process data
    const processedMtgCards = mtgCards.map((card: Partial<ICard>) => ({
      ...card,
      game: 'MTG',
    }))

    const processedLorcanaCards = lorcanaCards.map((card: Partial<ICard>) => ({
      ...card,
      game: 'Lorcana',
      rarity: card.rarity?.toLowerCase(),
    }))

    const allCards = [...processedMtgCards, ...processedLorcanaCards]

    // Insert data into the database
    await Card.insertMany(allCards, { ordered: true })
    console.log('Data inserted successfully')
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    ) {
      console.warn('Duplicate entries detected and skipped')
    } else {
      console.error('Error inserting data:', error)
    }
  }
}
