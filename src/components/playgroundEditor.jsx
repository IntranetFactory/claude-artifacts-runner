import React, { useState, useEffect } from 'react';
import { Save, Upload, Trash2, TrendingUp } from 'lucide-react';
import Editor from '@monaco-editor/react';
import DynamicComponent from './dynamicComponent';
import { Button } from '@/components/ui/button';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';
import systemPromptDefault from '../../systemprompt.txt?raw';
import OpenAI from 'openai';
import { Skeleton } from "@/components/ui/skeleton";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable client-side usage
});

const Preview = ({ text }) => (
  <DynamicComponent code={text} />
);

const EditorSkeleton = () => (
  <div className="space-y-2 p-4">
    <Skeleton className="h-[20px] w-[40%]" />
    <Skeleton className="h-[20px] w-[60%]" />
    <Skeleton className="h-[20px] w-[35%]" />
    <Skeleton className="h-[20px] w-[45%]" />
    <Skeleton className="h-[20px] w-[55%]" />
    <Skeleton className="h-[20px] w-[30%]" />
    <Skeleton className="h-[20px] w-[50%]" />
    <Skeleton className="h-[20px] w-[40%]" />
    <Skeleton className="h-[20px] w-[65%]" />
    <Skeleton className="h-[20px] w-[45%]" />
    <Skeleton className="h-[20px] w-[35%]" />
    <Skeleton className="h-[20px] w-[55%]" />
    <Skeleton className="h-[20px] w-[40%]" />
    <Skeleton className="h-[20px] w-[60%]" />
    <Skeleton className="h-[20px] w-[50%]" />
    <Skeleton className="h-[20px] w-[45%]" />
    <Skeleton className="h-[20px] w-[35%]" />
    <Skeleton className="h-[20px] w-[55%]" />
    <Skeleton className="h-[20px] w-[40%]" />
    <Skeleton className="h-[20px] w-[30%]" />
  </div>
);

const PlaygroundEditor = ({
  initialText = '',
  onChange = () => { },
  className = ''
}) => {
  const [text, setText] = useState(initialText);
  const [fileName, setFileName] = useState(null);
  const [systemPromptText, setSystemPromptText] = useState(systemPromptDefault);
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
            description: 'JSX Files',
            accept: {
              'text/jsx': ['.jsx']
            }
          }
        ]
      });

      const file = await fileHandle.getFile();
      setFileName(file.name);
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
        suggestedName: fileName,
        types: [
          {
            description: 'JSX Files',
            accept: {
              'text/jsx': ['.jsx']
            }
          }
        ]
      });

      // Get the file name chosen by user
      const newFileName = handle.name;
      setFileName(newFileName); // Update state with new filename

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

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPromptText },
          { role: "user", content: promptText }
        ],
        temperature: 0 
      });
      const result = response.choices[0].message.content;
      const artifact = extractAntArtifact(result);
      console.log(result);

      const newFileName = artifact.identifier ? `${artifact.identifier}.jsx` : 'output.jsx';
      setFileName(newFileName); // Update state with new filename

      handleTextChange(artifact.code);
    } catch (error) {
      console.error('OpenAI API error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  function extractAntArtifact(content) {
    const artifactRegex = /<antArtifact(?:\s+[^>]*)?>[\s\S]*?<\/antArtifact>/;
    const attributeRegex = /(\w+)="([^"]*)"/g;
  
    const artifactMatch = content.match(artifactRegex);
  
    if (!artifactMatch) {
      // Return default values if <antArtifact> is not found
      return {
        type: "unknown",
        identifier: "",
        title: "",
        code: "",
      };
    }
  
    // Extract attributes from the <antArtifact> opening tag
    const openingTag = artifactMatch[0].match(/<antArtifact(?:\s+[^>]*)?>/)?.[0] || "";
    const attributes = {};
    let match;
    while ((match = attributeRegex.exec(openingTag)) !== null) {
      attributes[match[1]] = match[2];
    }
  
    // Extract the inner content (code)
    const innerContent = artifactMatch[0]
      .replace(/<antArtifact(?:\s+[^>]*)?>/, "") // Remove opening tag
      .replace(/<\/antArtifact>/, "") // Remove closing tag
      .trim();
  
    return {
      type: attributes.type || "unknown",
      identifier: attributes.identifier || "",
      title: attributes.title || "",
      code: innerContent || "",
    };
  }

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
        <div className="w-px h-4 bg-gray-300" />
        <Button
          onClick={handleGenerate}  // Replace alert with handleGenerate function
          variant="ghost" 
          className="flex items-center gap-2 h-8"
          size="sm"
          disabled={!promptText.trim()}
        >
          <TrendingUp size={16} />
          Generate
        </Button>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
      >

        {/* Left Panel */}
        <ResizablePanel defaultSize={33.33} minSize={20}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* System Prompt Panel */}
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full flex-col pb-6 px-6">
                <h3 className="font-semibold mb-2">System Prompt</h3>
                <textarea 
                  className="flex-1 w-full resize-none rounded-md border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter system prompt..."
                  value={systemPromptText}
                  onChange={(e) => setSystemPromptText(e.target.value)}
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle />
            
            {/* Prompt Panel */}
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full flex-col pt-6 px-6">
                <h3 className="font-semibold mb-2">Prompt</h3>
                <textarea 
                  className="flex-1 w-full resize-none rounded-md border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter prompt..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      
        <ResizableHandle />

        <ResizablePanel defaultSize={33.33} minSize={20}>
          {isGenerating ? (
            <EditorSkeleton />
          ) : (
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
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={33.33} minSize={20}>
          <Preview text={text} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default PlaygroundEditor;