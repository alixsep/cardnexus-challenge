import React, { useEffect } from 'react'
import { Search, Code, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  TextSearchField,
  NumericSearchField,
  EnumSearchField,
} from './search-fields'
import { useSearchStore } from '@/stores/search-store'
import { useMetadataStore } from '@/stores/metadata-store'
import Title from './components/title'
import ExpressionBuilder from './components/expression-builder'
import { PaginationControls } from './components/pagination-controls'

const Home: React.FC = () => {
  const { metadata, fetchMetadata } = useMetadataStore()
  const {
    init,
    searchConditions,
    removeSearchCondition,
    searchResults,
    totalSearchResults,
  } = useSearchStore()

  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])

  if (!metadata) return <div>Loading...</div>

  // Renders your numeric/enum search fields from metadata
  const renderSearchFields = () => {
    const fields: React.ReactNode[] = []
    // Text fields
    Object.keys(metadata.textMetadata).forEach((_field, index) => {
      fields.push(
        <TextSearchField
          key={`text-${metadata.textMetadata[index]}`}
          field={metadata.textMetadata[index]}
          placeholder={metadata.textMetadata[index]}
        />,
      )
    })
    // Numeric fields
    Object.entries(metadata.numericMetadata).forEach(([field, numericMeta]) => {
      fields.push(
        <NumericSearchField
          key={`numeric-${field}`}
          field={field}
          metadata={numericMeta}
        />,
      )
    })
    // Enum fields
    Object.entries(metadata.enumMetadata).forEach(([field, enumOptions]) => {
      fields.push(
        <EnumSearchField
          key={`enum-${field}`}
          field={field}
          options={enumOptions}
        />,
      )
    })
    return fields
  }

  return (
    <div className="flex h-full">
      {/* Left pane: Search Fields & Expression Builder */}
      <div className="flex-1 p-4">
        <Title
          icon={<Search size={18} strokeWidth={2.5} />}
          text="Card Search"
        />

        <div className="space-y-2">
          {/* Render numeric/enum search fields */}
          {renderSearchFields()}

          {/* Current Conditions */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Current Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {searchConditions.conditions?.map((condition, index) => {
                const label = String.fromCharCode(65 + index) // 'A','B','C', etc
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center"
                  >
                    {`${label}: ${condition.field || ''} ${condition.operator} ${JSON.stringify(condition.value)}`}
                    <button
                      onClick={() => removeSearchCondition(index)}
                      className="ml-2 text-red-500"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Expression Builder, passing condition labels */}
          <ExpressionBuilder />
        </div>
      </div>

      {/* Right pane: JSON metadata */}
      {!init ? (
        <div className="flex-1 p-4 bg-gray-100 overflow-auto">
          <Title icon={<Code size={18} strokeWidth={2.5} />} text="Metadata" />
          <pre className="text-sm text-wrap">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="flex-1 p-4 bg-gray-100 overflow-auto">
          <Title
            icon={<Code size={18} strokeWidth={2.5} />}
            text={`Search Results (${totalSearchResults})`}
          />
          <PaginationControls />
          <pre className="text-sm text-wrap">
            {JSON.stringify(searchResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default Home
