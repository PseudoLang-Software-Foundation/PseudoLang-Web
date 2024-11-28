import init, { run_pseudolang, get_version } from '../assets/wasm/fplc.js';

let wasmInitialized = false;

export async function initWasm() {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
}

export async function executePseudoLang(code: string, debug: boolean = false): Promise<string> {
  if (!wasmInitialized) {
    await initWasm();
  }

  try {
    return run_pseudolang(code, debug);
  } catch (error) {
    console.error('WASM execution error:', error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "An unknown error occurred while executing the code";
  }
}

export async function getPseudoLangVersion(): Promise<string> {
  if (!wasmInitialized) {
    await initWasm();
  }
  return get_version();
}