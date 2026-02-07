declare function acquireVsCodeApi(): {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
};

interface VsCodeApi {
  postMessage: (message: unknown) => void;
  getState: <T>() => T | undefined;
  setState: <T>(state: T) => void;
}

let vscodeApi: VsCodeApi | null = null;

function getVsCodeApi(): VsCodeApi {
  if (!vscodeApi) {
    if (typeof acquireVsCodeApi === 'function') {
      const api = acquireVsCodeApi();
      vscodeApi = {
        postMessage: (message) => api.postMessage(message),
        getState: () => api.getState() as any,
        setState: (state) => api.setState(state),
      };
    } else {
      console.warn('[Webview] acquireVsCodeApi not available - running outside VS Code');
      vscodeApi = {
        postMessage: (message) => console.log('[Mock postMessage]', message),
        getState: () => undefined,
        setState: () => {},
      };
    }
  }
  return vscodeApi;
}

export function postMessage(message: unknown): void {
  getVsCodeApi().postMessage(message);
}

export function getState<T>(): T | undefined {
  return getVsCodeApi().getState<T>();
}

export function setState<T>(state: T): void {
  getVsCodeApi().setState(state);
}

export function useVsCodeApi(): VsCodeApi {
  return getVsCodeApi();
}
