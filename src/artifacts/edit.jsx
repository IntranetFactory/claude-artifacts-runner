import React, { useState } from 'react';
import { Save, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FileEditor = () => {
  const [text, setText] = useState('');

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
      setText(content);
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
    setText('');
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={handleLoad}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Load
        </Button>
        <Button 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save
        </Button>
        <Button 
          onClick={handleClear}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <Trash2 size={16} />
          Clear
        </Button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter or load text here..."
      />
    </div>
  );
};

export default FileEditor;