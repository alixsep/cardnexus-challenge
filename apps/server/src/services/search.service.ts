import { buildMongooseQuery } from '@/helpers/build-query'
import AppError from '@/utils/app-error'
import { Card } from '@/db/models/card'

import type { Request } from 'express'

export const searchCards = async (req: Request) => {
  const { conditions, sort, page, pageSize } = req.body

  if (!conditions || !Array.isArray(conditions)) {
    throw new AppError(
      "Invalid or missing 'conditions' in the request body.",
      400,
    )
  }

  try {
    // Build the Mongoose query object
    const query = buildMongooseQuery(conditions)

    // Handle pagination
    const currentPage = page && page > 0 ? page : 1 // Default to page 1
    const sizePerPage = pageSize && pageSize > 0 ? pageSize : 10 // Default to 10 results per page
    const skip = (currentPage - 1) * sizePerPage

    // Handle sorting
    const sortOptions: any = {}
    if (sort && sort.field) {
      sortOptions[sort.field] = sort.order === -1 ? -1 : 1 // Default to ascending order
    }

    // Execute query
    const [data, total] = await Promise.all([
      Card.find(query).sort(sortOptions).skip(skip).limit(sizePerPage),
      Card.countDocuments(query), // Get total matching records
    ])

    return {
      data,
      total,
      page: currentPage,
      pageSize: sizePerPage,
    }
  } catch (error) {
    console.error('Search Service Error:', error)
    throw new AppError('Failed to perform search query', 500)
  }
}
