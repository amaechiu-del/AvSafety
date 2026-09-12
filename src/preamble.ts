// Synchronous React Fast Refresh preamble initialization
// Guarantees that $RefreshReg$ and $RefreshSig$ are defined before any JSX component modules evaluate

if (typeof window !== 'undefined') {
  const w = window as any;
  if (!w.$RefreshReg$) {
    w.$RefreshReg$ = () => {};
  }
  if (!w.$RefreshSig$) {
    w.$RefreshSig$ = () => (type: any) => type;
  }
  w.__vite_plugin_react_preamble_installed__ = true;
}

export {};
