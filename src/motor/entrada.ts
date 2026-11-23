import { dispositivo } from './dispositivo';

// Teclado, toque e clique viram ações com nome. O núcleo do jogo só conhece
// a interface Comandos, assim o robô de teste consegue apertar botões sem DOM.

export type Acao = 'cima' | 'baixo' | 'esq' | 'dir' | 'ok' | 'voltar' | 'album' | 'som' | '1' | '2' | '3' | '4';

export interface Comandos {
  segurando(a: Acao): boolean;
  apertou(a: Acao): boolean;
  clique: { x: number; y: number } | null;
}

const MAPA: Record<string, Acao> = {
  ArrowUp: 'cima', KeyW: 'cima',
  ArrowDown: 'baixo', KeyS: 'baixo',
  ArrowLeft: 'esq', KeyA: 'esq',
  ArrowRight: 'dir', KeyD: 'dir',
  Enter: 'ok', Space: 'ok', KeyE: 'ok', KeyZ: 'ok',
  Escape: 'voltar', KeyX: 'voltar', Backspace: 'voltar',
  Tab: 'album', KeyI: 'album',
  KeyM: 'som',
  Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4',
  Numpad1: '1', Numpad2: '2', Numpad3: '3', Numpad4: '4',
};

export class Entrada implements Comandos {
  private seg = new Set<Acao>();
  private novas = new Set<Acao>();
  clique: { x: number; y: number } | null = null;
  private cliquePendente: { x: number; y: number } | null = null;
  usouTeclado = false;

  constructor(alvo: HTMLCanvasElement, conv: (x: number, y: number) => { x: number; y: number }) {
    addEventListener('keydown', (ev) => {
      const a = MAPA[ev.code];
      if (!a) return;
      ev.preventDefault();
      this.usouTeclado = true;
      if (!ev.repeat) this.novas.add(a);
      this.seg.add(a);
    });
    addEventListener('keyup', (ev) => {
      const a = MAPA[ev.code];
      if (a) this.seg.delete(a);
    });
    addEventListener('blur', () => this.seg.clear());
    alvo.addEventListener('pointerdown', (ev) => {
      this.cliquePendente = conv(ev.clientX, ev.clientY);
    });

    const toque = document.getElementById('toque');
    const temToque =
      matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0 || new URLSearchParams(location.search).has('toque');
    if (toque && temToque) {
      toque.classList.add('ativo');
      document.body.classList.add('toque');
      dispositivo.toque = true;
    }
    toque?.querySelectorAll<HTMLButtonElement>('button[data-k]').forEach((b) => {
      const a = MAPA[b.dataset.k === 'Enter' ? 'Enter' : b.dataset.k!];
      const solta = () => this.seg.delete(a);
      b.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        this.novas.add(a);
        this.seg.add(a);
      });
      b.addEventListener('pointerup', solta);
      b.addEventListener('pointercancel', solta);
      b.addEventListener('pointerleave', solta);
    });
  }

  segurando(a: Acao): boolean {
    return this.seg.has(a);
  }

  apertou(a: Acao): boolean {
    return this.novas.has(a);
  }

  /** Chamar uma vez por quadro, antes da lógica. */
  quadro(): void {
    this.clique = this.cliquePendente;
    this.cliquePendente = null;
  }

  /** Chamar uma vez por quadro, depois da lógica. */
  limpar(): void {
    this.novas.clear();
    this.clique = null;
  }
}

/** Comandos de mentira para testes e para o robô. */
export class ComandosFalsos implements Comandos {
  seg = new Set<Acao>();
  novas = new Set<Acao>();
  clique: { x: number; y: number } | null = null;
  segurando(a: Acao): boolean {
    return this.seg.has(a);
  }
  apertou(a: Acao): boolean {
    return this.novas.has(a);
  }
}
