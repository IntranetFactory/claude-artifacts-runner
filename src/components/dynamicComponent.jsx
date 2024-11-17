import * as React from 'react';
import * as Recharts from 'recharts';
import * as Button from '@/components/ui/button';
import * as Card from '@/components/ui/card';

import { transform } from 'sucrase';

// Allowed modules provided by the host app
const allowedModules = {
  react: React,
  recharts: Recharts,
  '@/components/ui/button': Button,
  '@/components/ui/card': Card,
};

const ErrorDisplay = ({ error }) => (
  <div className="p-4 border-2 border-red-500 rounded-md bg-red-50">
    <h3 className="text-red-700 font-semibold mb-2">Transformation Error</h3>
    <pre className="text-sm text-red-600 whitespace-pre-wrap">
      {error.message || 'Failed to transform JSX code'}
    </pre>
  </div>
);


// Custom `require` function
const require = (specifier) => {
  if (allowedModules[specifier]) {
    return allowedModules[specifier];
  }
  throw new Error(`Module "${specifier}" is not allowed or cannot be resolved.`);
};

// Function to dynamically load and execute a module
const loadModule = (sourceCode) => {
  // Transform the code with Sucrase
  const transformedCode = transform(sourceCode, {
    transforms: ['imports', 'jsx'], // Ensure it handles ESM and JSX
  }).code;

  // Create a function to execute the transformed code
  const moduleFunction = new Function('require', 'exports', 'module', transformedCode);

  const exports = {};
  const module = { exports };

  // Execute the transformed module
  moduleFunction(require, exports, module);

  // Return the default export if it exists, otherwise return all exports
  return module.exports.default || module.exports;
};


// Example usage:
const code1 = `
import React from 'react';

const HelloWorld = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold text-blue-600">Hello, World!</h1>
    </div>
  );
};

export default HelloWorld;
`;



const DynamicComponent = ({ code, data }) => {
  // Function to compile and execute the JSX code
  if(!code) {
    return (
      <>
      </>
    )
  }
  try {
    var func = loadModule(code);
    // Render the compiled JSX dynamically
    return <>{func(data)}</>;
  } catch (error) {
    return <ErrorDisplay error={error} />;
  }
};

export default DynamicComponent;
