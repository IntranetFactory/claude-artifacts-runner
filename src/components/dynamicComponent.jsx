import * as React from 'react';
import * as Recharts from 'recharts';
import * as Button from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import * as ApiAccess from '@/components/apiAccess';

import { transform } from 'sucrase';

// Allowed modules provided by the host app
const allowedModules = {
  react: React,
  recharts: Recharts,
  '@/components/ui/button': Button,
  '@/components/ui/card': Card,
  '@/components/apiAccess': ApiAccess,
};

const ErrorDisplay = ({ error }) => (
  <div className="p-4 border-2 border-red-500 rounded-md bg-red-50">
    <h3 className="text-red-700 font-semibold mb-2">Transformation Error</h3>
    <pre className="text-sm text-red-600 whitespace-pre-wrap">
      {error.message || 'Failed to transform JSX code'}
    </pre>
  </div>
);

// Add ErrorBoundary component at top
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border-2 border-red-500 rounded-md bg-red-50">
          <h3 className="text-red-700 font-semibold mb-2">Render Error</h3>
          <pre className="text-sm text-red-600 whitespace-pre-wrap">
            {this.state.error?.message || 'Invalid component rendered'}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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



const DynamicComponent = React.memo(({ code }) => {
  if (!code) return null;

  try {
    console.log(code);
    const func = loadModule(code);
    
    // Type checking
    if (typeof func !== 'function') {
      throw new Error('Component must be a function');
    }

    return (
      <ErrorBoundary>
        {func()}
      </ErrorBoundary>
    );
  } catch (error) {
    return <ErrorDisplay error={error} />;
  }
}, (prevProps, nextProps) => {
  return prevProps.code === nextProps.code;
});

export default DynamicComponent;
