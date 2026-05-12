import '../css/app.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/AppRoot';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
