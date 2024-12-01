/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
  readonly VITE_DISABLE_COPILOT: string  
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}