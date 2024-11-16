/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }