import React from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSearchStore } from '@/stores/search-store'

// Extended Condition Popover Component
export const ConditionPopover: React.FC<{
  field: string
  value: string | number | number[]
  type: 'text' | 'numeric' | 'enum'
}> = ({ field, value, type }) => {
  const { addSearchCondition } = useSearchStore()

  // Define operators for different field types
  const operators: Record<string, string[]> = {
    text: ['equals', 'not equals', 'contains', "doesn't contain"],
    numeric: [
      'equals',
      'not equals',
      'less than',
      'greater than',
      'greater or equal',
      'less or equal',
    ],
    enum: ['equals', 'not equals'],
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Add Condition</Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-64 grid grid-cols-2 gap-1">
        {operators[type].map(operator => (
          <Button
            key={operator}
            variant="ghost"
            className="w-full"
            onClick={() =>
              addSearchCondition({
                field,
                operator,
                value,
              })
            }
          >
            {operator}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

// Text Search Component
export const TextSearchField: React.FC<{
  field: string
  placeholder?: string
}> = ({ field, placeholder }) => {
  const { searchValues, setSearchValue } = useSearchStore()

  return (
    <div className="flex space-x-2 items-center">
      <label className="flex-shrink-0">{field}:</label>
      <Input
        placeholder={placeholder || field}
        value={searchValues[field] || ''}
        onChange={e => setSearchValue(field, e.target.value)}
        className="flex-grow"
      />
      <ConditionPopover
        field={field}
        value={searchValues[field] || ''}
        type="text"
      />
    </div>
  )
}

// Numeric Search Component
export const NumericSearchField: React.FC<{
  field: string
  metadata: { min: number; max: number }
}> = ({ field /*, metadata*/ }) => {
  const { searchValues, setSearchValue } = useSearchStore()

  const currentValue = searchValues[field] // || [metadata.min, metadata.max]

  return (
    <div className="flex gap-2 items-center">
      <label className="flex-shrink-0">{field}:</label>
      {/* <div className="flex-1 space-y-1">
          <div className="flex justify-between text-sm">
            <span>
              {field}: {metadata.min}
            </span>
            <span>{metadata.max}</span>
          </div>
          <Slider
            defaultValue={currentValue}
            value={currentValue}
            min={metadata.min}
            max={metadata.max}
            step={1}
            onValueChange={(val) => setSearchValue(field, val)}
          />
        </div>
        <Input
          placeholder={'min'}
          value={searchValues[field][0]}
          onChange={(e) =>
            setSearchValue(field, [e.target.value, currentValue[1]])
          }
          className="w-24"
        />
        <Input
          placeholder={'max'}
          value={searchValues[field][1] || ''}
          onChange={(e) =>
            setSearchValue(field, [currentValue[0], e.target.value])
          }
          className="w-24"
        /> */}
      <Input
        placeholder={field}
        value={searchValues[field] || ''}
        onChange={e => setSearchValue(field, e.target.value)}
        className="flex-grow"
      />
      <ConditionPopover field={field} value={currentValue} type="numeric" />
    </div>
  )
}

// Enum Search Component
export const EnumSearchField: React.FC<{
  field: string
  options: { value: string | null; count: number }[]
}> = ({ field, options }) => {
  const { searchValues, setSearchValue } = useSearchStore()

  return (
    <div className="flex space-x-2 items-center">
      <label className="flex-shrink-0">{field}:</label>
      <br />
      <Select
        value={searchValues[field] || ''}
        onValueChange={val => setSearchValue(field, val)}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${field}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(item => (
            <SelectItem key={item.value || 'null'} value={item.value || 'null'}>
              {item.value || 'Null'} ({item.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ConditionPopover
        field={field}
        value={searchValues[field] || ''}
        type="enum"
      />
    </div>
  )
}

export const SimpleSort: React.FC = () => {
  const { sortField, sortDirection, setSortField, setSortDirection } =
    useSearchStore()

  return (
    <div className="flex items-center space-x-2">
      <Select value={sortField || ''} onValueChange={val => setSortField(val)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort Field" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="created">Created</SelectItem>
          <SelectItem value="updated">Updated</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={sortDirection || ''}
        onValueChange={val => setSortDirection(val.toString() as '1' | '-1')}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort Direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'1'}>Ascending</SelectItem>
          <SelectItem value={'-1'}>Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
