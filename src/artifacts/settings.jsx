import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SETTINGS_STORAGE_KEY = 'api-settings';

const ApiKeySettingsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    setApiKey(storedSettings.apiKey || '');
    setBaseUrl(storedSettings.baseUrl || '');
  }, []);

  const handleSave = () => {
    const settings = { apiKey, baseUrl };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setIsOpen(false);
  };

  const handleDelete = () => {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setApiKey('');
    setBaseUrl('');
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Edit API Settings
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Settings</DialogTitle>
            <DialogDescription>
              Configure your API settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key">API Key*</Label>
              <Input 
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="base-url">Base URL</Label>
              <Input 
                id="base-url"
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="Optional base URL"
                className="mt-2"
              />
            </div>
            
            <div className="flex justify-between space-x-4">
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={!apiKey}
              >
                Delete
              </Button>
              <Button 
                variant="default" 
                onClick={handleSave}
                disabled={!apiKey.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeySettingsModal;