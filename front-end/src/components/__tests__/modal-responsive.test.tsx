import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponsiveModal } from '@/components/ResponsiveModal';
import { WhatsAppInstanceModal } from '@/pages/WhatsAppInstanceModal';

vi.mock('@/hooks/useSseGateway', () => ({
  useSseGateway: () => undefined,
}));

vi.mock('@/services/apiClient', () => {
  const client = { get: vi.fn(), post: vi.fn(), delete: vi.fn() };
  return { default: client, apiClient: client };
});

vi.mock('@/utils/toastHelper', () => ({
  showToast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

describe('ResponsiveModal — portal e estrutura', () => {
  beforeEach(() => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  });

  it('renderiza role=dialog em portal no document.body', () => {
    render(
      <div id="app-root">
        <ResponsiveModal open title="Detalhes" onClose={vi.fn()}>
          <p>Conteúdo</p>
        </ResponsiveModal>
      </div>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog.parentElement?.classList.contains('modal-overlay')).toBe(true);
    expect(document.body.contains(dialog)).toBe(true);
    expect(document.getElementById('app-root')?.contains(dialog)).toBe(false);
  });

  it('header fica fora do body com overflow e Fechar fecha', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ResponsiveModal open title="Conectar canal" onClose={onClose} size="connection">
        <div style={{ height: 800 }}>longo</div>
      </ResponsiveModal>,
    );

    const header = screen.getByTestId('modal-header');
    const body = screen.getByTestId('modal-body');
    expect(header.contains(body)).toBe(false);
    expect(body.contains(header)).toBe(false);
    expect(window.getComputedStyle(body).overflowY === 'auto' || body.className.includes('modal-body')).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Fechar modal' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('fecha com Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ResponsiveModal open title="Conectar canal" onClose={onClose}>
        <p>OK</p>
      </ResponsiveModal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('WhatsAppInstanceModal — conexão', () => {
  it('exibe título Conectar canal e botão Fechar modal', () => {
    render(
      <WhatsAppInstanceModal
        instanceId={1}
        instanceName="Dispositivo 1"
        initialWaState="connecting"
        onClose={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Conectar canal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fechar modal' })).toBeVisible();

    const header = screen.getByTestId('modal-header');
    expect(within(header).getByRole('heading', { name: 'Conectar canal' })).toBeInTheDocument();
    expect(within(header).getByRole('button', { name: 'Fechar modal' })).toBeInTheDocument();
  });
});
