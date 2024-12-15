import { create } from 'zustand'

import type { ICard } from '@cardnexus-challenge/types'
import { BACKEND_URL } from '@/api/config'

type SearchCondition = {
  type: 'simple' | 'complex'
  field?: string
  operator: string
  value?: string | number | number[] | string[]
  conditions?: SearchCondition[]
}

type SearchState = {
  init: boolean
  searchConditions: SearchCondition
  searchValues: Record<string, any>
  searchResults: ICard[]
  totalSearchResults: number
  sortField?: string
  sortDirection?: '1' | '-1'
  setSortField: (field: string) => void
  setSortDirection: (direction: '1' | '-1' | undefined) => void
  extendedExpression: any[]
  setExtendedExpression: (expression: any[]) => void

  page: number
  setPage: (page: number) => void
  prevPage: () => void
  nextPage: () => void
  pageSize: number
  setPageSize: (pageSize: number) => void

  // Actions
  setSearchValue: (field: string, value: any) => void
  addSearchCondition: (condition: Omit<SearchCondition, 'type'>) => void
  removeSearchCondition: (index: number) => void
  performSearch: (extendedExpression?: any) => void
  // resetSearch: () => void
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  init: false,
  searchResults: [],
  totalSearchResults: 0,
  searchConditions: {
    type: 'complex',
    operator: 'AND',
    conditions: [],
  },
  extendedExpression: [],
  setExtendedExpression: expression => {
    set({ extendedExpression: expression })
  },
  searchValues: {},
  sortField: undefined,
  sortDirection: undefined,

  page: 1,
  pageSize: 10,

  setPage: page => {
    set({ page })
  },

  prevPage: () => {
    set(state => ({ page: Math.max(1, state.page - 1) }))
  },

  nextPage: () => {
    set(state => ({
      page: Math.min(
        Math.ceil(state.totalSearchResults / state.pageSize),
        state.page + 1,
      ),
    }))
  },
  setPageSize: pageSize => {
    set({ pageSize })
  },

  setSortField: field => {
    set({ sortField: field })
  },

  setSortDirection: direction => {
    set({ sortDirection: direction })
  },

  setSearchValue: (field, value) => {
    set(state => ({
      searchValues: {
        ...state.searchValues,
        [field]: value,
      },
    }))
  },

  addSearchCondition: condition => {
    set(state => {
      const newCondition = {
        type: 'simple' as unknown as 'simple',
        ...condition,
      }

      const updatedConditions = state.searchConditions.conditions
        ? [...state.searchConditions.conditions, newCondition]
        : [newCondition]

      return {
        searchConditions: {
          ...state.searchConditions,
          conditions: updatedConditions,
        },
      }
    })
  },

  removeSearchCondition: index => {
    set(state => {
      const updatedConditions = state.searchConditions.conditions
        ? [...state.searchConditions.conditions].filter((_, i) => i !== index)
        : []

      return {
        searchConditions: {
          ...state.searchConditions,
          conditions: updatedConditions,
        },
      }
    })
  },

  performSearch: (extendedExpression?) => {
    let conditions
    if (extendedExpression) {
      conditions = extendedExpression
      console.log('Expression', JSON.stringify(extendedExpression, null, 2))
    } else {
      conditions = get().extendedExpression
    }

    set({ searchResults: [] })
    fetch(`${BACKEND_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conditions,
        sort: {
          [get().sortField || 'name']: parseInt(get().sortDirection || '1', 10),
        },
        page: get().page,
        pageSize: get().pageSize,
      }),
    })
      .then(response => response.json())
      .then(data => {
        set({
          searchResults: data.data,
          totalSearchResults: data.total,
          init: true,
        })
      })
      .catch(error => {
        console.error('Error searching:', error)
      })
  },

  // resetSearch: () => {
  //   set({
  //     searchConditions: {
  //       type: 'complex',
  //       operator: 'AND',
  //       conditions: [],
  //     },
  //     searchValues: {},
  //     sortField: undefined,
  //     sortDirection: undefined,
  //   })
  // },
}))
