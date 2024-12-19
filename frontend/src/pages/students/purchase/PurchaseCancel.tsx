import { IoCloseCircle } from "react-icons/io5";

const PurchaseCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <div className="text-red-500 text-6xl mb-4 flex items-center justify-center">
          <IoCloseCircle />  
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Purchase Cancelled</h1>
        <p className="text-gray-600 mt-2">
          Your purchase has been successfully canceled. If you have any questions, please contact our support team.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Go back to home
        </button>
      </div>
    </div>
  )
}

export default PurchaseCancel