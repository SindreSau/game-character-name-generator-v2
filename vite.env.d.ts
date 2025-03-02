/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CLOUDFLARE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
