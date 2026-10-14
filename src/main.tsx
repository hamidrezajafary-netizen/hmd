import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource/archivo-black';
import App from './App';

const BusinessCardPage = lazy(() => import('./card/BusinessCardPage'));
const isCardRoute = window.location.pathname.replace(/\/+$/, '') === '/business-card';
import './index.css';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      {isCardRoute ? (
        <Suspense fallback={null}>
          <BusinessCardPage />
        </Suspense>
      ) : (
        <App />
      )}
    </StrictMode>,
  );
}
