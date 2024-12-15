import { Schema, model } from 'mongoose'
import { Rarity, Color, Game } from '@cardnexus-challenge/types'

import type { Document } from 'mongoose'
import type { ICard } from '@cardnexus-challenge/types'

type CardDocument = ICard & Document

const CardSchema = new Schema<CardDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    game: {
      type: String,
      required: true,
      enum: Object.values(Game),
      index: true,
    },
    name: {
      type: String,
      required: true,
      text: true,
      index: true,
    },
    rarity: {
      type: String,
      required: false,
      enum: Object.values(Rarity),
    },
    color: {
      type: String,
      required: false,
      enum: Object.values(Color),
    },
    ink_cost: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields for future flexibility
  },
)

// Text Search Index for better full-text search performance
CardSchema.index({ name: 'text' })

export const Card = model<CardDocument>('Card', CardSchema)
export type CardModel = typeof Card
