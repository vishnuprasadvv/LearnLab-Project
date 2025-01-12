import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-950 border-t-blue-500 dark:border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        {/* Loading Text */}
        <p className="text-lg font-bold mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
