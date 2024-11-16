import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import tailwindConfig from '../../tailwind.config.js';
import DynamicComponent from '../components/dynamicComponent';

var code = `
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-center xxx">Counter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="text-4xl font-bold">{count}</div>
        <Button 
          onClick={() => setCount(count + 1)}
          className="w-full"
        >
          Increment
        </Button>
      </CardContent>
    </Card>
  );
};

export default Counter;
`
const addTailwindCDNWithConfig = () => {
  // Check if the Tailwind CDN script is already added
  if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
    // Add the Tailwind CSS script to the head
    const tailwindScript = document.createElement('script');
    tailwindScript.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tailwindScript);


    // Wait for the script to load
    tailwindScript.onload = () => {

      // Inject the Tailwind configuration dynamically
      const configScript = document.createElement('script');
      configScript.innerHTML = `
          tailwind.config = ${JSON.stringify(config)};
        
        `;
      document.head.appendChild(configScript);
    };
  }
};

// The Playground component
const Playground = () => {

  const data = {};
  var config = {};
  config.theme = tailwindConfig.theme;


  var shade = 500;

  code = code.replace('xxx', `text-teal-${shade}`);

  return (
    <>
      <Helmet>
        <title>XXX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>{`
    tailwind.config =  ${JSON.stringify(config, null, 2)} 
  `}</script>
      </Helmet>
      <DynamicComponent code={code} data={data} />
    </>
  );
};

export default Playground;

