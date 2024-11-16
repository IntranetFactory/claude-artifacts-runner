import React, { useState, useEffect } from 'react';
import { Save, Upload, Trash2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import DynamicComponent from './dynamicComponent';
import { Button } from '@/components/ui/button';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';

const Preview = ({ text }) => (
  <DynamicComponent code={text} />
);

const PlaygroundEditor = ({
  initialText = '',
  onChange = () => { },
  className = ''
}) => {
  const [text, setText] = useState(initialText);

  // Update internal state when initialText prop changes
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  // Notify parent component of changes
  const handleTextChange = (newText) => {
    setText(newText);
    onChange(newText);
  };

  const handleLoad = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Text Files',
            accept: {
              'text/plain': ['.txt']
            }
          }
        ]
      });

      const file = await fileHandle.getFile();
      const content = await file.text();
      handleTextChange(content);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading file:', err);
      }
    }
  };

  const handleSave = async () => {
    try {
      const handle = await window.showSaveFilePicker({
        types: [
          {
            description: 'Text Files',
            accept: {
              'text/plain': ['.txt']
            }
          }
        ]
      });

      const writable = await handle.createWritable();
      await writable.write(text);
      await writable.close();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error saving file:', err);
      }
    }
  };

  const handleClear = () => {
    handleTextChange('');
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-1 p-1 mb-4 bg-gray-100 rounded">
        <Button
          onClick={handleLoad}
          variant="ghost"
          className="flex items-center gap-2 h-8"
          size="sm"
        >
          <Upload size={16} />
          Load
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          onClick={handleSave}
          variant="ghost"
          className="flex items-center gap-2 h-8"
          size="sm"
        >
          <Save size={16} />
          Save
        </Button>
        <div className="w-px h-4 bg-gray-300" />
        <Button
          onClick={handleClear}
          variant="ghost"
          className="flex items-center gap-2 h-8 text-red-500 hover:text-red-600"
          size="sm"
        >
          <Trash2 size={16} />
          Clear
        </Button>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <Editor
            value={text}
            onChange={(value) => handleTextChange(value)}
            height="100%"
            width="100%"
            language="javascript" // Set language to 'javascript' for JSX support
            theme="vs-dark" // Optional: Choose a theme ('vs-dark' or 'light')
            wrapperClassName="w-full h-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            options={{
              tabSize: 2,
              minimap: { enabled: false }
            }}
          />

        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <Preview text={text} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default PlaygroundEditor;