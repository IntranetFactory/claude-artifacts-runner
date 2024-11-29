import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const API_KEY_STORAGE_KEY = 'api-configuration-key';
const API_URL_STORAGE_KEY = 'api-configuration-url';
const MODEL_NAME_STORAGE_KEY = 'api-configuration-model';

const APIConfigModal = ({ open, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [modelName, setModelName] = useState('abc');

  useEffect(() => {
    if (open) {
      const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
      const savedApiUrl = localStorage.getItem(API_URL_STORAGE_KEY) || '';
      const savedModelName = localStorage.getItem(MODEL_NAME_STORAGE_KEY) || 'gpt-4o-mini';
      
      setApiKey(savedApiKey);
      setApiUrl(savedApiUrl);
      setModelName(savedModelName);
    }
  }, [open]);

  // Add validation function
  const isFormValid = () => {
    return apiKey.trim() !== '' && modelName.trim() !== '';
  };

  // Add touched state tracking
  const [touchedFields, setTouchedFields] = useState({
    apiKey: false,
    modelName: false
  });

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const isFieldInvalid = (fieldName, value) => {
    return touchedFields[fieldName] && value.trim() === '';
  };

  const handleSave = () => {
    if (!isFormValid()) return;
    
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    localStorage.setItem(API_URL_STORAGE_KEY, apiUrl);
    localStorage.setItem(MODEL_NAME_STORAGE_KEY, modelName);
    onClose(false);
  };

  const handleCancel = () => {   
      onClose(false);   
  };
  

  return (
    <Dialog 
      open={open} 
      onOpenChange={onClose} 
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>            
            <span className="mt-2 text-sm text-muted-foreground">
              Your API key and settings are stored securely in your browser's local storage. The API key is only used to authenticate requests to your chosen API server and is never transmitted to any other servers.
            </span>
            <br /><br/>Required fields are marked with *
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key" className="font-medium">
              API Key *
            </Label>
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onBlur={() => handleBlur('apiKey')}
              className={isFieldInvalid('apiKey', apiKey) ? 'border-red-500' : ''}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="modelName" className="font-medium">
              Model Name *
            </Label>
            <Input
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              onBlur={() => handleBlur('modelName')}
              className={isFieldInvalid('modelName', modelName) ? 'border-red-500' : ''}
              placeholder="Enter model name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="api-url" className="font-medium">
              API URL
            </Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="Enter any OpenAI-compatible API endpoint"
            />
            <span className="text-sm text-muted-foreground">
              Any API server that implements the OpenAI API specification will work here
            </span>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default APIConfigModal;
