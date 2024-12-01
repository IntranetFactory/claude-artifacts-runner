/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
  readonly VITE_DISABLE_COPILOT: string  
  readonly VITE_LOAD_ALLOWLIST: string  
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}