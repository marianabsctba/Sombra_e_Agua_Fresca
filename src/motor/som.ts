import { Musica } from './musica';

// Som feito na hora com WebAudio: bipes de fala, ruídos de efeito e
// a trilha de cada ato. Nada de arquivo de áudio.

let ac: AudioContext | null = null;
let mestre: GainNode | null = null;
let mudo = false;
let musica: Musica | null = null;
let ambienteAtual = '';

function contexto(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  if (!ac) {
    ac = new AudioContext();
    mestre = ac.createGain();
    mestre.gain.value = mudo ? 0 : 0.5;
    mestre.connect(ac.destination);
  }
  if (ac.state === 'suspended') void ac.resume();
  return ac;
}

export function alternarSom(): boolean {
  mudo = !mudo;
  if (mestre) mestre.gain.value = mudo ? 0 : 0.5;
  return mudo;
}

export function estaMudo(): boolean {
  return mudo;
}

export function bipe(freq: number, dur = 0.05, tipo: OscillatorType = 'square', vol = 0.08): void {
  const c = contexto();
  if (!c || !mestre) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = tipo;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(mestre);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

export function arpejo(notas: number[], passo = 0.08, tipo: OscillatorType = 'triangle'): void {
  notas.forEach((n, i) => setTimeout(() => bipe(n, passo * 1.6, tipo, 0.09), i * passo * 1000));
}

export const efeitos = {
  fala: (voz: number) => bipe(voz * (0.92 + Math.random() * 0.16), 0.03, 'square', 0.035),
  escolha: () => bipe(660, 0.04, 'triangle'),
  confirma: () => arpejo([523, 659, 784], 0.06),
  erro: () => arpejo([330, 247], 0.09, 'sawtooth'),
  carta: () => arpejo([523, 659, 784, 1047], 0.07),
  forma: () => arpejo([392, 523, 659, 784, 1047], 0.09, 'sine'),
  queda: () => arpejo([600, 450, 300, 180], 0.07, 'sawtooth'),
  passo: () => bipe(90 + Math.random() * 30, 0.03, 'triangle', 0.03),
  final: () => arpejo([262, 330, 392, 523, 659, 784], 0.14, 'sine'),
};

/** Trilha do momento: cada ato tem um tema (veja musica.ts). */
export function tocarAmbiente(tipo: string): void {
  if (tipo === ambienteAtual) return;
  ambienteAtual = tipo;
  const c = contexto();
  if (!c || !mestre) return;
  if (!musica) musica = new Musica(c, mestre);
  if (tipo) musica.tocar(tipo);
  else musica.parar();
}

/** Aba escondida ou tela do celular bloqueada: o som para junto com o jogo. */
export function pausarSom(pausa: boolean): void {
  if (!ac) return;
  if (pausa) void ac.suspend();
  else void ac.resume();
}

/** Navegadores só liberam áudio depois de um toque ou tecla. */
export function destravarSom(): void {
  contexto();
}
