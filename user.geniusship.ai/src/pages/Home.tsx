import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-center text-gray-800">
          Welcome to Your Home Page
        </h1>
        <p className="mb-6 text-lg text-center text-gray-600">
          This is a demo content for your home page. Feel free to customize it.
        </p>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 text-center bg-blue-100 rounded-lg shadow-md">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">Feature 1</h2>
            <p className="text-gray-600">
              Description for feature 1. This is where you can provide details about this feature.
            </p>
          </div>

          <div className="p-6 text-center bg-green-100 rounded-lg shadow-md">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">Feature 2</h2>
            <p className="text-gray-600">
              Description for feature 2. Explain the benefits or functionality here.
            </p>
          </div>

          <div className="p-6 text-center bg-yellow-100 rounded-lg shadow-md">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">Feature 3</h2>
            <p className="text-gray-600">
              Description for feature 3. Share the unique aspects of this feature.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="px-6 py-3 font-semibold text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
