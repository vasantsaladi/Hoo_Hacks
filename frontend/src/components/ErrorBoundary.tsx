'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Form error:', error)
  }, [error])

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
      <h2 className="text-red-800 font-semibold mb-2">Something went wrong!</h2>
      <p className="text-red-600 text-sm mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm hover:bg-red-200 transition-colors"
      >
        Try again
      </button>
    </div>
  )
} 