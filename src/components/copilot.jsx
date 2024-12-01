import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import tailwindConfig from '../../tailwind.config.js';
import DynamicComponent from './dynamicComponent.jsx';
import PlaygroundEditor from './playgroundEditor.jsx';

const Playground = () => {  
  const data = {};
  var config = {};
  config.theme = tailwindConfig.theme;

  useEffect(() => {
    console.log('Playground mounted');
    return () => console.log('Playground unmounting');
  }, []);

  return (
    <>
      <Helmet>
        <title>React Artifacts Copilot</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>{`
    tailwind.config =  ${JSON.stringify(config, null, 2)} 
  `}</script>
      </Helmet>

      <div className="h-screen p-4">
        <PlaygroundEditor
          className="h-full"
          key="stable-key"
        />
      </div>
    </>
  );
};

export default Playground;
