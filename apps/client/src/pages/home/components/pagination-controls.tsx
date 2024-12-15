import React from 'react'
import { useSearchStore } from '@/stores/search-store'
import { Button } from '@/components/ui/button'

export const PaginationControls: React.FC = () => {
  const {
    page,
    totalSearchResults,
    pageSize,
    performSearch,
    prevPage,
    nextPage,
  } = useSearchStore()

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalSearchResults / pageSize)

  const goNext = () => {
    if (page < totalPages) {
      nextPage()
      performSearch() // Re-run the search for the new page
    }
  }

  const goBack = () => {
    if (page > 1) {
      prevPage()
      performSearch() // Re-run the search for the new page
    }
  }

  return (
    <div className="flex items-center justify-between space-x-4 mb-2">
      {/* Go Back Button */}
      <Button
        onClick={goBack}
        disabled={page === 1}
        className={`${page === 1 ? 'bg-gray-300' : 'bg-gray-500'}`}
      >
        Go Back
      </Button>

      {/* Current Page Info */}
      <span className="text-sm">
        Page {page} of {totalPages || 1}
      </span>

      {/* Go Next Button */}
      <Button
        onClick={goNext}
        disabled={page >= totalPages}
        className={`${page >= totalPages ? 'bg-gray-300' : 'bg-gray-500'}`}
      >
        Go Next
      </Button>
    </div>
  )
}
