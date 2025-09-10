'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AccentColorContextType {
  currentAccent: string
  setCurrentAccent: (color: string) => void
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined)

export function useAccentColor() {
  const context = useContext(AccentColorContext)
  if (context === undefined) {
    throw new Error('useAccentColor must be used within an AccentColorProvider')
  }
  return context
}

interface AccentColorProviderProps {
  children: ReactNode
}

export function AccentColorProvider({ children }: AccentColorProviderProps) {
  const [currentAccent, setCurrentAccent] = useState('#ff5057') // Default to red from accents array
  
  // Update CSS custom property when accent color changes
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', currentAccent)
  }, [currentAccent])

  return (
    <AccentColorContext.Provider value={{ currentAccent, setCurrentAccent }}>
      {children}
    </AccentColorContext.Provider>
  )
}
