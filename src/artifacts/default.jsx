import React from 'react';

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4 text-center">
        Welcome to your React Artifacts Runner
      </h1>
      <p className="text-2xl text-red-600 text-center">
        Replace the file src/artifacts/default.jsx to change this default page and set VITE_DISABLE_AGENT=1 in your .env file to disable the AGENT.
      </p>
    </div>
  );
};

export default WelcomeMessage;