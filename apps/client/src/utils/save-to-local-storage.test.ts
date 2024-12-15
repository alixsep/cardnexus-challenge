import { describe, expect, it } from 'vitest'

import saveToLocalStorage from './save-to-local-storage'

describe('saveToLocalStorage', () => {
  const key = 'testKey'

  it('save state to localStorage', () => {
    const state = { counter: 42 }
    saveToLocalStorage(key, state)
    const savedState = JSON.parse(
      localStorage.getItem(key) as string,
    ) as typeof state
    expect(savedState).toEqual(state)
  })
})
