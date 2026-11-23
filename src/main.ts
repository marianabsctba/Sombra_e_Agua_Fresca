import '@fontsource/pixelify-sans/400.css';
import '@fontsource/pixelify-sans/500.css';
import '@fontsource/pixelify-sans/600.css';
import '@fontsource/pixelify-sans/700.css';
import { Jogo, type Armazem } from './jogo/jogo';
import { desenhar } from './jogo/render';
import { Robo } from './jogo/robo';
import type { Estado } from './jogo/tipos';
import { Entrada } from './motor/entrada';
import { alternarSom, destravarSom, pausarSom } from './motor/som';
import { Tela } from './motor/tela';

const CHAVE = 'sombra-e-agua-fresca:partida';
const CHAVE_P = 'sombra-e-agua-fresca:permanente';

function ler<T>(k: string): T | null {
  try {
    const s = localStorage.getItem(k);
    return s ? (JSON.parse(s) as T) : null;
  } catch {
    return null;
  }
}

function gravar(k: string, v: unknown): void {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* sem armazenamento: o jogo segue sem salvar */
  }
}

const armazem: Armazem = {
  ler: () => ler<Estado>(CHAVE),
  gravar: (e) => gravar(CHAVE, e),
  lerPermanente: () => ler<{ cartas: string[]; finais: string[] }>(CHAVE_P) ?? { cartas: [], finais: [] },
  gravarPermanente: (p) => gravar(CHAVE_P, p),
};

const canvas = document.getElementById('tela') as HTMLCanvasElement;
const tela = new Tela(canvas);
const entrada = new Entrada(canvas, (x, y) => tela.doCliente(x, y));
tela.ajustar(); // a entrada descobre se há toque, e isso muda o espaço da tela

const gire = document.getElementById('gire');
gire?.querySelector('button')?.addEventListener('click', () => gire.classList.add('dispensado'));
const jogo = new Jogo(armazem);

declare global {
  interface Window {
    jogo: Jogo;
    robo: Robo;
  }
}
window.jogo = jogo;
window.robo = new Robo(jogo);

// ?semPausa mantém o jogo rodando mesmo com a aba escondida (para testes automáticos)
const agendar: (f: (t: number) => void) => void = new URLSearchParams(location.search).has('semPausa')
  ? (f) => setTimeout(() => f(performance.now()), 16)
  : (f) => requestAnimationFrame(f);

let antes = performance.now();
function quadro(agora: number): void {
  const dt = (agora - antes) / 1000;
  antes = agora;
  entrada.quadro();
  if (entrada.apertou('som')) alternarSom();
  jogo.atualizar(dt, entrada);
  entrada.limpar();
  desenhar(jogo, tela);
  agendar(quadro);
}

for (const ev of ['pointerdown', 'keydown'] as const) addEventListener(ev, destravarSom, { capture: true });
addEventListener('beforeunload', () => jogo.salvar());
document.addEventListener('visibilitychange', () => pausarSom(document.hidden));
document.fonts.load(`700 16px 'Pixelify Sans'`).finally(() => agendar(quadro));
