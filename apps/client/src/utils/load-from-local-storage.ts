import saveToLocalStorage from './save-to-local-storage'

/**
 * Loads the state object from local storage under the given key.
 * If no state is found, the initial state is saved to local storage and returned.
 *
 * @param key - The key under which the state is stored in local storage.
 * @param initialState - The initial state object to be used if no state is found in local storage.
 *
 * @returns The loaded state object from local storage or the initial state if not found.
 */
export const loadFromLocalStorage = <T>(key: string, initialState: T): T => {
  try {
    // Attempt to retrieve the state object from local storage
    const stringifiedState = localStorage.getItem(key)
    // If no state is found, save the initial state to local storage and return it
    if (stringifiedState === null) {
      saveToLocalStorage(key, initialState)
      return initialState
    }
    // Parse and return the loaded state object from local storage
    return JSON.parse(stringifiedState) as T
  } catch (e) {
    // If an error occurs during loading, log a warning, save the initial state, and return it
    console.warn('Error loading from localStorage:', e)
    saveToLocalStorage(key, initialState)
    return initialState
  }
}

export default loadFromLocalStorage
