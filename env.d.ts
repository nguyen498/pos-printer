interface ImportMetaEnv {
  readonly MAIN_VITE_ELECTRON_RENDERER_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
