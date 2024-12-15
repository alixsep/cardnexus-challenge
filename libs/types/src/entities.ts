export enum Rarity {
  COMMON = 'common',
  MYTHIC = 'mythic',
  RARE = 'rare',
  SPECIAL = 'special',
  UNCOMMON = 'uncommon',
  ENCHANTED = 'enchanted',
  LEGENDARY = 'legendary',
  PROMO = 'promo',
  SUPER_RARE = 'super rare',
}

export enum Color {
  U = 'U', // Blue
  B = 'B', // Black
  G = 'G', // Green
  R = 'R', // Red
  W = 'W', // White
}

export enum Game {
  MTG = 'MTG',
  LORCANA = 'Lorcana',
}

export interface ICard {
  id: string
  game: Game
  name: string
  rarity?: Rarity
  color?: Color
  ink_cost?: number
}
