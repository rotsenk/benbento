import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { createTestStore } from '@/test/createTestStore';
import App from './App';

function renderApp() {
  return render(
    <Provider store={createTestStore({ locale: 'en', theme: 'light' })}>
      <App />
    </Provider>,
  );
}

describe('App', () => {
  it('tiene skip link y un main enfocable', () => {
    renderApp();

    const skipLink = screen.getByRole('link', { name: 'Skip to content' });
    const main = screen.getByRole('main', { name: 'Profile tiles' });

    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveAttribute('tabindex', '-1');
  });

  it('cambia de idioma, actualiza el documento y persiste la elección', async () => {
    const user = userEvent.setup();
    renderApp();

    const spanish = screen.getByRole('button', { name: /Spanish/ });
    const english = screen.getByRole('button', { name: /English/ });
    expect(spanish).toHaveAttribute('lang', 'es');
    expect(english).toHaveAttribute('lang', 'en');

    await user.click(spanish);

    expect(globalThis.document.documentElement.lang).toBe('es');
    expect(screen.getByRole('main', { name: 'Tiles del perfil' })).toBeInTheDocument();
    expect(screen.getByText('Idioma cambiado a español.')).toBeInTheDocument();
    expect(localStorage.getItem('bento.locale')).toBe('es');
    expect(window.location.search).toBe('?lang=es');
  });

  it('alterna el tema, actualiza data-theme y lo persiste', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(globalThis.document.documentElement.dataset.theme).toBe('light');

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(globalThis.document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('bento.theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('actualiza título y descripción al montar', () => {
    renderApp();

    expect(globalThis.document.title).toBe('Nestor Rivas | Frontend Developer');
    expect(
      globalThis.document.querySelector('meta[name="description"]'),
    ).toHaveAttribute('content', expect.stringContaining('personal bento'));
  });
});

