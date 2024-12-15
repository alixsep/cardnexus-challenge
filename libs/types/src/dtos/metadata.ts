export interface NumericMetadata {
  min: number
  max: number
}

export interface EnumItem {
  value: string
  count: number
}

export type MetaDataDTO = {
  totalCards: number
  numericMetadata: Record<string, NumericMetadata>
  enumMetadata: Record<string, EnumItem[]>
  textMetadata: string[]
}
