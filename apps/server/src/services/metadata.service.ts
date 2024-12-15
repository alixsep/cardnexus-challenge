import { Card } from '@/db/models/card'
import AppError from '@/utils/app-error'
import { log } from '@/utils/logger'

import type { CardModel } from '@/db/models/card'
import type { MetaDataDTO } from '@cardnexus-challenge/types'

export const getTextFields = (model: CardModel): string[] => {
  const textFields: string[] = []
  for (const [fieldName, fieldPath] of Object.entries(model.schema.paths)) {
    if (fieldPath.instance === 'String' && !fieldPath.options?.enum) {
      // Exclude special fields like __v and _id if necessary
      if (fieldName !== '__v' && fieldName !== '_id') {
        textFields.push(fieldName)
      }
    }
  }
  return textFields
}

export const getNumericFields = (model: CardModel): string[] => {
  const numericFields: string[] = []
  for (const [fieldName, fieldPath] of Object.entries(model.schema.paths)) {
    if (fieldPath.instance === 'Number') {
      // Exclude __v and _id fields
      if (fieldName !== '__v' && fieldName !== '_id')
        numericFields.push(fieldName)
    }
  }
  return numericFields
}

export const getEnumFields = (model: CardModel): string[] => {
  const enumFields: string[] = []
  for (const [fieldName, fieldPath] of Object.entries(model.schema.paths)) {
    if (fieldPath.instance === 'String' && fieldPath.options?.enum) {
      enumFields.push(fieldName)
    }
  }
  return enumFields
}

const buildFacetPipeline = (model: CardModel) => {
  const numericFields = getNumericFields(model) // e.g. [ "ink_cost" ]
  const enumFields = getEnumFields(model) // e.g. [ "game", "color", "rarity" ]

  type Facet = Record<
    string,
    (
      | {
          $group:
            | { _id: string; count: { $sum: number } }
            | {
                _id: null
                minValue: {
                  $min: string
                }
                maxValue: {
                  $max: string
                }
              }
        }
      | { $count: string }
    )[]
  >

  const facet: Facet = {}

  // Numeric field stats
  for (const fieldName of numericFields) {
    facet[`${fieldName}_stats`] = [
      {
        $group: {
          _id: null,
          minValue: { $min: `$${fieldName}` },
          maxValue: { $max: `$${fieldName}` },
        },
      },
    ]
  }

  // Enum distributions
  for (const fieldName of enumFields) {
    facet[`${fieldName}_distribution`] = [
      {
        $group: {
          _id: `$${fieldName}`,
          count: { $sum: 1 },
        },
      },
    ]
  }

  // Total count
  facet.totalCount = [{ $count: 'count' }]

  return [{ $facet: facet }]
}

export const getCardsMetadata = async () => {
  try {
    // Build a dynamic pipeline from the schema
    const pipeline = buildFacetPipeline(Card)
    // pipeline looks like: [ { $facet: { "ink_cost_stats": [...], "game_distribution": [...], ... } } ]

    const [result] = await Card.aggregate(pipeline)

    /**
     * The result object might look like:
     * {
     *   ink_cost_stats: [ { _id: null, minValue: 1, maxValue: 10 } ],
     *   game_distribution: [ { _id: 'POKEMON', count: 100 }, { _id: 'MAGIC', count: 50 } ],
     *   color_distribution: [ { _id: 'RED', count: 25 }, { _id: 'BLUE', count: 30 }, ... ],
     *   rarity_distribution: [ { _id: 'COMMON', count: 40 }, { _id: 'RARE', count: 15 }, ... ],
     *   totalCount: [ { count: 150 } ]
     * }
     */

    const metadata: MetaDataDTO = {
      totalCards: 0,
      numericMetadata: {},
      enumMetadata: {},
      textMetadata: [],
    }

    // Total count
    metadata.totalCards = result?.totalCount?.[0]?.count ?? 0

    // For text fields, just list them
    const textFields = getTextFields(Card)
    metadata.textMetadata = textFields

    // For numeric fields, parse out min/max
    const numericFields = getNumericFields(Card)
    for (const fieldName of numericFields) {
      const statsArray = result[`${fieldName}_stats`]
      const minValue = statsArray?.[0]?.minValue ?? null
      const maxValue = statsArray?.[0]?.maxValue ?? null
      metadata.numericMetadata[fieldName] = { min: minValue, max: maxValue }
    }

    // For enum fields, parse out distributions
    const enumFields = getEnumFields(Card)
    for (const fieldName of enumFields) {
      const distributionArray = result[`${fieldName}_distribution`]
      metadata.enumMetadata[fieldName] =
        distributionArray?.map((d: { _id: string; count: number }) => ({
          value: d._id,
          count: d.count,
        })) ?? []
    }

    return metadata
  } catch (error: unknown) {
    log.error(error)
    throw new AppError('Failed to fetch metadata', 500)
  }
}
