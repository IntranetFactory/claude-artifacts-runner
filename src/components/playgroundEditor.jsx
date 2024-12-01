import React, { useState, useEffect, memo } from 'react';
import { Save, Upload, Trash2, TrendingUp, Settings } from 'lucide-react';
import Editor from '@monaco-editor/react';
import DynamicComponent from './dynamicComponent';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/errorBoundary';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';
import systemPromptDefault from '../../systemprompt.txt?raw';
import OpenAI from 'openai';
import { Skeleton } from "@/components/ui/skeleton";
import APIConfigModal from './APIConfigModal.jsx';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

const Preview = ({ text }) => (
  <ErrorBoundary key={text}>
    <DynamicComponent code={text} />
  </ErrorBoundary>
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
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState(null);
  const [systemPromptText, setSystemPromptText] = useState(systemPromptDefault);
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const [isAPIConfigModalOpen, setIsAPIConfigModalOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Notify parent component of changes
  const handleCodeChange = (newText) => {
    setCode(newText);
  };

  const fixCode = (code) => {

    // llm makes common errors, fixing them
    code = code.replace("import { ApiAccess } from '@/components/apiAccess';", "import ApiAccess from '@/components/apiAccess';");

    return code;
  }

  const handleSetArtifact = (content) => {
    // Check for wrapped prompt
    const promptRegex = /\/\* <artifact-specification>\n([\s\S]*?)\n<\/artifact-specification> \*\/\n\n([\s\S]*)/;
    const match = content.match(promptRegex);

    if (match) {
      var [, extractedPrompt, extractedCode] = match;
      extractedPrompt = extractedPrompt.trim();

      setPromptText(extractedPrompt);
      handleCodeChange(extractedCode);
    } else {
      // No prompt found, use entire content as code
      handleCodeChange(content);
    }
  };

  const handleAPIConfigModalOpen = () => {
    console.log('Opening API config modal');
    setIsAPIConfigModalOpen(true);
  };

  const handleAPIConfigModalClose = () => {
    setIsAPIConfigModalOpen(false);
  };

  // Add component lifecycle logging
  useEffect(() => {
    console.log('PlaygroundEditor mounted');
    return () => console.log('PlaygroundEditor unmounting');
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    handleSetArtifact(initialText);
  }, [initialText]);



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

      handleSetArtifact(content);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading file:', err);
      }
    }
  };

  const handleSave = async () => {
    // Create wrapped prompt text
    const wrappedPrompt = promptText ? `/* <artifact-specification>\n\n${promptText}\n\n</artifact-specification> */\n\n` : '';

    // Combine with existing content
    const contentToSave = wrappedPrompt + code;

    try {
      // Create object with content and UTC timestamp
      const saveData = {
        content: contentToSave,
        timestamp: new Date().toISOString()
      };

      // Store as JSON string
      localStorage.setItem('artifact_wip', JSON.stringify(saveData));

      // File system save
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'JSX Files',
          accept: {
            'text/jsx': ['.jsx']
          }
        }]
      });

      // Get the file name chosen by user
      const newFileName = handle.name;

      // Create a writable stream and write the content
      const writable = await handle.createWritable();
      await writable.write(contentToSave);
      await writable.close();

      setFileName(newFileName); // Update state with new filename

      return false;

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error saving file:', err);
        // Still save to localStorage even if file save fails
        localStorage.setItem('artifact_wip', contentToSave);
      }
      return false;
    }
  };

  const handleClear = () => {
    handleCodeChange('');
  };

  function wrapCommentBlock(input, maxLineLength = 70) {
    debugger;
    const words = input.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length + 1 > maxLineLength) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
      currentLine += word + ' ';
    });

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    // Wrap the lines with comment block
    const commentBlock = '/*\n' +
      lines.map(line => `   ${line}`).join('\n') +
      '\n*/';
    return commentBlock;
  }

  const handleGenerate = async () => {
    try {
      setCode('')
      setIsGenerating(true);
      const response = await invokeOpenAI(
        [
          { role: "system", content: systemPromptText },
          { role: "user", content: promptText }
        ]);

      if (!response) return;

      const result = response.choices[0].message.content;
      const artifact = extractAtArtifact(result);

      artifact.code = `${wrapCommentBlock(extractAtThinkingText(result))}\n\n${artifact.code}`;

      console.log(response);

      const newFileName = artifact.identifier ? `${artifact.identifier}.jsx` : 'output.jsx';
      setFileName(newFileName); // Update state with new filename

      handleCodeChange(fixCode(artifact.code));
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while calling OpenAI')
      setIsErrorDialogOpen(true)
    } finally {
      setIsGenerating(false);
    }
  };

  function extractAtThinkingText(input) {
    const match = input.match(/<atThinking>(.*?)<\/atThinking>/);
    return match ? match[1] : "";
  }

  function extractAtArtifact(content) {
    const artifactRegex = /<atArtifact(?:\s+[^>]*)?>[\s\S]*?<\/atArtifact>/;
    const attributeRegex = /(\w+)="([^"]*)"/g;

    const artifactMatch = content.match(artifactRegex);

    if (!artifactMatch) {
      // Return default values if <atArtifact> is not found
      return {
        type: "unknown",
        identifier: "",
        title: "",
        code: "",
      };
    }

    // Extract attributes from the <atArtifact> opening tag
    const openingTag = artifactMatch[0].match(/<atArtifact(?:\s+[^>]*)?>/)?.[0] || "";
    const attributes = {};
    let match;
    while ((match = attributeRegex.exec(openingTag)) !== null) {
      attributes[match[1]] = match[2];
    }

    // Extract the inner content (code)
    const innerContent = artifactMatch[0]
      .replace(/<atArtifact(?:\s+[^>]*)?>/, "") // Remove opening tag
      .replace(/<\/atArtifact>/, "") // Remove closing tag
      .trim();

    return {
      type: attributes.type || "unknown",
      identifier: attributes.identifier || "",
      title: attributes.title || "",
      code: innerContent || "",
    };
  }

  const invokeOpenAI = async (messages) => {
    const apiKey = localStorage.getItem('api-configuration-key');
    const apiUrl = localStorage.getItem('api-configuration-url');
    const modelName = localStorage.getItem('api-configuration-model');

    if (!apiKey || !modelName) {
      handleAPIConfigModalOpen(); // Show settings modal
      return undefined;
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: apiUrl || undefined,
      dangerouslyAllowBrowser: true
    });

    try {
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: messages,
        stream: false
      });
      return completion;
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while calling OpenAI')
      setIsErrorDialogOpen(true)
      throw error;
    }
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
        <Button
          onClick={handleAPIConfigModalOpen}
          variant="ghost"
          className="flex items-center gap-2 h-8 ml-auto"
          size="sm"
        >
          <Settings size={16} />
          Settings
        </Button>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
      >

        {/* Left Panel */}
        <ResizablePanel defaultSize={33.33} minSize={20}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* Prompt Panel */}
            <ResizablePanel defaultSize={67}>
              <div className="flex h-full flex-col px-6">
                <h3 className="font-semibold mb-2">Specification</h3>
                <textarea
                  className="flex-1 mb-4 w-full resize-none rounded-md border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specifiy the component you want to generate..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* System Prompt Panel */}
            <ResizablePanel defaultSize={33}>
              <div className="flex h-full flex-col pt-6 px-6">
                <h3 className="font-semibold mb-2">System Prompt</h3>
                <textarea
                  className="flex-1 w-full resize-none rounded-md border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter system prompt..."
                  value={systemPromptText}
                  onChange={(e) => setSystemPromptText(e.target.value)}
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
              value={code}
              onChange={(value) => handleCodeChange(value)}
              height="100%"
              width="100%"
              language="javascript" // Set language to 'javascript' for JSX support
              theme={isDarkMode ? "vs-dark" : "vs-light"}
              wrapperClassName="w-full h-full p-2 pr-6 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              options={{
                tabSize: 2,
                minimap: { enabled: false },
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  useShadows: true,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                },
                automaticLayout: true,
              }}
            />
          )}

        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={33.34} minSize={20}>
          <div className="px-4">
            <Preview text={code} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <APIConfigModal
        open={isAPIConfigModalOpen}
        onClose={handleAPIConfigModalClose}
      />
      <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription className="text-red-500">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlaygroundEditor;