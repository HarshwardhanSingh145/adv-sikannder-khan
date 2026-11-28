import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Unregister any old Service Workers and clear stale caches so all devices stay on the latest build
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister().catch(() => {}));
  }).catch(() => {});
}
if ('caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key.startsWith('adv-sikandar-workspace')) {
        caches.delete(key).catch(() => {});
      }
    });
  }).catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
