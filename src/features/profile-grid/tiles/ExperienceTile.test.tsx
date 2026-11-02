import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { createTestStore } from '@/test/createTestStore';
import { ExperienceTile, type MilestoneView } from './ExperienceTile';

const timeline: MilestoneView[] = [
  {
    period: '3',
    role: 'Software development',
    place: 'ACME',
    detail: 'Detail in English',
  },
];

function renderTile() {
  return render(
    <Provider store={createTestStore({ locale: 'en' })}>
      <ExperienceTile id="experience" size="2x1" summary={timeline} timeline={timeline} />
    </Provider>,
  );
}

describe('ExperienceTile', () => {
  it('abre un diálogo accesible y devuelve el foco al cerrar con Escape', async () => {
    const user = userEvent.setup();
    renderTile();

    const trigger = screen.getByRole('button', { name: /View full experience/ });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Experience' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
    expect(screen.getByText('Detail in English')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('mantiene el foco dentro del diálogo al tabular', async () => {
    const user = userEvent.setup();
    renderTile();

    await user.click(screen.getByRole('button', { name: /View full experience/ }));
    const close = screen.getByRole('button', { name: 'Close dialog' });

    await user.tab();
    expect(close).toHaveFocus();

    await user.tab({ shift: true });
    expect(close).toHaveFocus();
  });
});
