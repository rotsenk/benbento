import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { createTestStore } from '@/test/createTestStore';
import { SpotifyTile } from './SpotifyTile';

const props = {
  id: 'spotify',
  size: '2x1' as const,
  title: 'Música',
  playlistId: 'abc123',
  href: 'https://open.spotify.com/playlist/abc123',
};

describe('SpotifyTile', () => {
  it('no carga el iframe hasta que se pide reproducir', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={createTestStore({ locale: 'en' })}>
        <SpotifyTile {...props} />
      </Provider>,
    );

    expect(screen.queryByTitle('Spotify player')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Play here' }));

    const iframe = screen.getByTitle('Spotify player');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('/embed/playlist/abc123'));
    expect(screen.getByRole('link', { name: /Open in Spotify/ })).toBeInTheDocument();
  });
});
