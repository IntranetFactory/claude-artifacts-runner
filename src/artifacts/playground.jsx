import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import tailwindConfig from '../../tailwind.config.js';
import DynamicComponent from '../components/dynamicComponent';
import PlaygroundEditor from '../components/playgroundEditor.jsx';


// The Playground component
const Playground = () => {

  const [editorContent, setEditorContent] = useState(`
import React from 'react';
const HelloWorld = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold text-blue-600">Hello, World!</h1>
    </div>
  );
};

export default HelloWorld;
    `);

  const data = {};
  var config = {};
  config.theme = tailwindConfig.theme;

  return (
    <>
      <Helmet>
        <title>XXX</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>{`
    tailwind.config =  ${JSON.stringify(config, null, 2)} 
  `}</script>
      </Helmet>

      <div className="h-screen p-4">
      <PlaygroundEditor
        initialText={editorContent}
        onChange={setEditorContent}
        className="h-full"
      />
    </div>

      <DynamicComponent code={editorContent} />
    </>
  );
};

export default Playground;

