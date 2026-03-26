const MAX_STORAGE_SIZE = 4000

export function cleanupLocalStorage() {
  try {
    let totalSize = 0
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += value.length + key.length
          if (value.length > MAX_STORAGE_SIZE) {
            keysToRemove.push(key)
          }
        }
      }
    }

    if (totalSize > MAX_STORAGE_SIZE * 10 || keysToRemove.length > 0) {
      console.warn('LocalStorage size too large, cleaning up...', { totalSize, keysToRemove })

      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })

      if (totalSize > MAX_STORAGE_SIZE * 10) {
        const criticalKeys = ['token', 'user']
        localStorage.clear()
        console.warn('LocalStorage cleared due to excessive size')
      }
    }
  } catch (error) {
    console.error('Error cleaning up localStorage:', error)
    try {
      localStorage.clear()
    } catch {
      console.error('Failed to clear localStorage')
    }
  }
}

cleanupLocalStorage()
