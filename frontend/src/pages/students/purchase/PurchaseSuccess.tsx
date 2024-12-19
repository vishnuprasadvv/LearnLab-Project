import React from 'react'
import { useLocation } from 'react-router-dom'

const PurchaseSuccess:React.FC = () => {
    const location = useLocation();
    // Extract query parameters
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md">
      <div className="text-green-500 text-6xl mb-4">✔️</div>
      <h1 className="text-2xl font-bold mb-2">Thank you for your purchase!</h1>
      <p className="text-gray-600 mb-4">
        Your order has been successfully placed.
      </p>
      <div className="text-sm text-gray-500 mb-6">
        <strong>Order ID:</strong> {orderId}
      </div>
      <div className="flex justify-center gap-4">
        <a
          href="/profile/courses"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition"
        >
          Go to My courses
        </a>
        <a
          href="/"
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-full transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  </div>
  )
}

export default PurchaseSuccess