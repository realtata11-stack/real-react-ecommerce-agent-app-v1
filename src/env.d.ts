interface ImportMetaEnv {
  /** Base URL of the products API. Set in `.env`. */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
