import { beforeEach, describe, expect, it, vi } from 'vitest'

import loadFromLocalStorage from './load-from-local-storage'

describe('loadFromLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const key = 'testKey'

  it('should load state from localStorage if exists', () => {
    const state = { counter: 42 }
    localStorage.setItem(key, JSON.stringify(state))
    const loadedState = loadFromLocalStorage(key, {})
    expect(loadedState).toEqual(state)
  })

  it('should save initial state to localStorage if no state found', () => {
    const initialState = { counter: 0 }
    const loadedState = loadFromLocalStorage(key, initialState)
    expect(loadedState).toEqual(initialState)
    const storedState = JSON.parse(
      localStorage.getItem(key)!,
    ) as typeof initialState
    expect(storedState).toEqual(initialState)
  })

  it('should return initial state if localStorage error occurs', () => {
    const initialState = { counter: 0 }
    localStorage.setItem(key, 'invalidJSON')

    // Suppress console warnings for this test
    const originalWarn = console.warn
    console.warn = vi.fn()

    const loadedState = loadFromLocalStorage(key, initialState)
    expect(loadedState).toEqual(initialState)

    // Restore console.warn
    console.warn = originalWarn
  })
})
