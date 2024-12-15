import { create } from 'zustand'
import { BACKEND_URL } from '@/api/config'
import type { MetaDataDTO } from '@cardnexus-challenge/types'

// TODO: Add loading and error states

interface MetadataState {
  metadata: MetaDataDTO | null
  fetchMetadata: () => Promise<void>
}

export const useMetadataStore = create<MetadataState>(set => ({
  metadata: null,
  fetchMetadata: async () => {
    try {
      console.log('fetching metadata')
      const response = await fetch(`${BACKEND_URL}/api/metadata`)
      const data = await response.json()
      set({ metadata: data })
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  },
}))
