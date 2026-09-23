import './preamble';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { pwaUpdateService } from './services/pwaUpdateService';
import { AdminAuthProvider } from './components/AdminAuthWrapper';
import App from './App.tsx';
import './index.css';

// Initialize PWA Update & Service Worker trail engine
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // Service worker update engine auto-initializes via singleton
  pwaUpdateService.checkForUpdates().catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </StrictMode>,
);
