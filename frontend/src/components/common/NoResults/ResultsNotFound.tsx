import { AlertCircle } from 'lucide-react'

const ResultsNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        No results Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the data you're looking for.
      </p>
    </div>
  )
}

export default ResultsNotFound