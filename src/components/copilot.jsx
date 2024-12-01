import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import tailwindConfig from '../../tailwind.config.mjs';
import PlaygroundEditor from './playgroundEditor.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Playground = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const config = {
    theme: tailwindConfig.theme
  };

  const isUrlAllowed = (url) => {
    const allowlist = import.meta.env.VITE_LOAD_ALLOWLIST?.split(',') || [];
    return allowlist.some(allowed => url.startsWith(allowed.trim()));
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setIsErrorOpen(true);
  };

  useEffect(() => {
    console.log('Playground mounted');
    const params = new URLSearchParams(window.location.search);
    const artifactUrl = params.get('load');
    
    if (artifactUrl) {
      if (isUrlAllowed(artifactUrl)) {
        fetch(artifactUrl)
          .then(response => response.text())
          .then(data => {
            setCode(data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching code:', error);
            setLoading(false);
          });
      } else {
        handleError(`URL not in allowlist: ${artifactUrl}`);
        setCode('');
        setLoading(false);
      }
    } else {
      setCode('');
      setLoading(false);
    }

    return () => console.log('Playground unmounting');
  }, []);

  return (
    <>
      <Helmet>
        <title>React Artifacts Copilot</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>{`
          setTimeout(() => {
            tailwind.config = ${JSON.stringify(config, null, 2)};
          }, 1);     
        `}</script>
      </Helmet>

      <div className="h-screen p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl">Loading...</p>
          </div>
        ) : (
          <PlaygroundEditor 
            className="h-full"
            key="stable-key"
            initialText={code}
          />
        )}
      </div>

      <AlertDialog open={isErrorOpen} onOpenChange={setIsErrorOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsErrorOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Playground;
