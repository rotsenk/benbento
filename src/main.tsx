import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { getPersistedTheme } from '@/features/ui/uiSlice';
import App from './App';
import './index.css';

const preferredTheme = getPersistedTheme();
const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.dataset.theme =
  preferredTheme === 'system' ? (systemIsDark ? 'dark' : 'light') : preferredTheme;
document.documentElement.lang = store.getState().ui.locale;

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontró el contenedor #root.');
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
