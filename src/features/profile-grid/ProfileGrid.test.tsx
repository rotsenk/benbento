import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import type { BentoDocument } from '@/content/profile.types';
import { createTestStore } from '@/test/createTestStore';
import { ProfileProvider } from './model/ProfileProvider';
import { ProfileGrid } from './ProfileGrid';

function renderGrid() {
  return render(
    <Provider store={createTestStore({ locale: 'en' })}>
      <ProfileProvider>
        <ProfileGrid />
      </ProfileProvider>
    </Provider>,
  );
}

describe('ProfileGrid', () => {
  it('renderiza los ocho tiles obligatorios en orden', () => {
    renderGrid();

    const articles = Array.from(
      globalThis.document.querySelectorAll<HTMLElement>('article[data-tile-id]'),
    );

    expect(articles.map((article) => article.dataset.tileId)).toEqual([
      'identity',
      'linkedin',
      'specialty',
      'experience',
      'spotify',
      'pet',
      'series',
      'hobbies',
    ]);
  });

  it('expone un h1 único y el nombre del perfil', () => {
    renderGrid();

    expect(screen.getByRole('heading', { level: 1, name: 'Nestor Rivas' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('convierte los tiles de enlace en anclas dentro de su artículo', () => {
    renderGrid();

    const linkedin = screen.getByRole('link', { name: /LinkedIn/ });
    const article = linkedin.closest('article');

    expect(linkedin).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/nestor-rivas-5a6163196/',
    );
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(article).toHaveAttribute('data-tile-id', 'linkedin');
    expect(article?.querySelector('a')).toBe(linkedin);
  });

  it('muestra el portafolio como enlace externo dentro de Especialidad', () => {
    renderGrid();

    const specialty = globalThis.document.querySelector('[data-tile-id="specialty"]');
    const portfolio = screen.getByRole('link', { name: /View portfolio/ });

    expect(specialty).toContainElement(portfolio);
    expect(portfolio).toHaveAttribute(
      'href',
      'https://nestor-rivas-portfolio.netlify.app/',
    );
    expect(portfolio).toHaveAttribute('target', '_blank');
    expect(portfolio).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('incluye la fachada de Spotify sin cargar el iframe', () => {
    renderGrid();

    expect(screen.queryByTitle('Spotify player')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play here' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open in Spotify/ })).toBeInTheDocument();
  });

  it('muestra imágenes con alt, width y height', () => {
    renderGrid();

    const portrait = screen.getByAltText('Portrait of Nestor Rivas');
    const pet = screen.getByAltText('Pet photo');

    expect(portrait).toHaveAttribute('width', '480');
    expect(portrait).toHaveAttribute('height', '480');
    expect(pet).toHaveAttribute('width', '1282');
    expect(pet).toHaveAttribute('height', '1440');
    expect(portrait).toHaveAttribute('src', '/images/me-nestor.webp');
  });

  it('renderiza el avatar circular fuera del grid y antes de los tiles', () => {
    renderGrid();

    const avatar = globalThis.document.querySelector('[data-profile-avatar]');
    const grid = globalThis.document.querySelector('[data-profile-grid]');
    const portrait = screen.getByAltText('Portrait of Nestor Rivas');

    expect(avatar).toHaveClass('rounded-full');
    expect(avatar).toContainElement(portrait);
    expect(avatar?.closest('article')).toBeNull();
    expect(avatar?.compareDocumentPosition(grid as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(grid?.querySelector('img')).not.toBe(portrait);
  });

  it('asigna el tamaño 1x1 al tile de identidad sin foto', () => {
    renderGrid();

    const identity = globalThis.document.querySelector('[data-tile-id="identity"]');

    expect(identity).toHaveAttribute('data-size', '1x1');
    expect(identity?.querySelector('img')).toBeNull();
  });

  it('renderiza los tiles sugeridos y el contacto sin abrir pestaña nueva', () => {
    const suggestedDocument: BentoDocument = {
      version: 1,
      tiles: [
        {
          id: 'projects',
          type: 'projects',
          size: '2x1',
          enabled: true,
          title: { es: 'Proyectos', en: 'Projects' },
          items: [
            {
              name: 'Bento',
              summary: { es: 'Un proyecto real.', en: 'A real project.' },
              href: 'https://example.com',
            },
          ],
        },
        {
          id: 'github',
          type: 'link',
          size: '1x1',
          enabled: true,
          platform: 'github',
          label: 'GitHub',
          handle: '@nestor',
          href: 'https://github.com/nestor',
        },
        {
          id: 'contact',
          type: 'contact',
          size: '1x1',
          enabled: true,
          title: { es: 'Contacto', en: 'Contact' },
          email: 'hola@example.com',
          href: 'mailto:hola@example.com',
        },
        {
          id: 'now',
          type: 'now',
          size: '1x1',
          enabled: true,
          title: { es: 'Ahora', en: 'Now' },
          body: { es: 'Construyendo interfaces.', en: 'Building interfaces.' },
        },
        {
          id: 'availability',
          type: 'availability',
          size: '1x1',
          enabled: true,
          title: { es: 'Disponibilidad', en: 'Availability' },
          timezone: 'UTC-6',
          modes: [{ es: 'Remoto', en: 'Remote' }],
        },
      ],
    };

    render(
      <Provider store={createTestStore({ locale: 'es' })}>
        <ProfileProvider initialDocument={suggestedDocument}>
          <ProfileGrid />
        </ProfileProvider>
      </Provider>,
    );

    expect(
      Array.from(
        globalThis.document.querySelectorAll<HTMLElement>('article[data-tile-id]'),
      ).map((article) => article.dataset.tileId),
    ).toEqual(['projects', 'github', 'contact', 'now', 'availability']);

    const contact = screen.getByRole('link', { name: /Contacto/ });
    expect(contact).toHaveAttribute('href', 'mailto:hola@example.com');
    expect(contact).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: /Abrir enlace: Bento/ })).toHaveAttribute(
      'target',
      '_blank',
    );
  });

  it('omite tiles deshabilitados o inválidos y avisa en desarrollo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const documentFixture: BentoDocument = {
      version: 1,
      tiles: [
        {
          id: 'hidden',
          type: 'link',
          size: '1x1',
          enabled: false,
          platform: 'linkedin',
          label: 'LinkedIn',
          handle: 'Nestor Rivas',
          href: 'https://www.linkedin.com/in/nestor-rivas/',
        },
        {
          id: 'unsafe',
          type: 'link',
          size: '1x1',
          enabled: true,
          platform: 'other',
          label: 'Ejemplo',
          handle: '@ejemplo',
          href: 'javascript:alert(1)',
        },
      ],
    };

    render(
      <Provider store={createTestStore({ locale: 'en' })}>
        <ProfileProvider initialDocument={documentFixture}>
          <ProfileGrid />
        </ProfileProvider>
      </Provider>,
    );

    expect(globalThis.document.querySelectorAll('article[data-tile-id]')).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('unsafe'));
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('hidden'));
    warn.mockRestore();
  });
});

