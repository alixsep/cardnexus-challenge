/**
 * Saves the provided state object to the local storage under the given key.
 *
 * @param key - The key under which the state will be stored in local storage.
 * @param state - The state object to be saved.
 */
const saveToLocalStorage = <T>(key: string, state: T): void => {
  try {
    // Convert the state object to a string
    const stringifiedState = JSON.stringify(state)
    // Save the stringified state to local storage under the provided key
    localStorage.setItem(key, stringifiedState)
  } catch (e) {
    // If an error occurs during saving, log a warning
    console.warn(e)
  }
}

export default saveToLocalStorage
