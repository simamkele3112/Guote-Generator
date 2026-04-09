import { useState, useEffect, useCallback } from "react"

interface Reflections {
  [quoteId: number]: string
}

export function useReflections() {
  const [reflections, setReflections] = useState<Reflections>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load reflections from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quoteAppReflections")
      if (saved) {
        try {
          setReflections(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to parse reflections:", e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save reflection to localStorage
  const saveReflection = useCallback((quoteId: number, text: string) => {
    setReflections((prev) => {
      const updated = { ...prev }
      if (text.trim()) {
        updated[quoteId] = text
      } else {
        delete updated[quoteId]
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("quoteAppReflections", JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  // Get reflection for a specific quote
  const getReflection = useCallback(
    (quoteId: number): string => {
      return reflections[quoteId] || ""
    },
    [reflections]
  )

  // Clear reflection
  const clearReflection = useCallback((quoteId: number) => {
    setReflections((prev) => {
      const updated = { ...prev }
      delete updated[quoteId]
      if (typeof window !== "undefined") {
        localStorage.setItem("quoteAppReflections", JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  return {
    reflections,
    saveReflection,
    getReflection,
    clearReflection,
    isLoaded,
  }
}
