// Som feito na hora com WebAudio: bipes de fala, ruídos de efeito e um zumbido
// ambiente por cena. Nada de arquivo de áudio.

let ac: AudioContext | null = null;
let mestre: GainNode | null = null;
let mudo = false;
let ambiente: { para(): void } | null = null;
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

/** Zumbido ambiente: dois osciladores graves com leve batimento. */
export function tocarAmbiente(tipo: string): void {
  if (tipo === ambienteAtual) return;
  ambiente?.para();
  ambiente = null;
  ambienteAtual = tipo;
  const c = contexto();
  if (!c || !mestre || !tipo) return;
  const base: Record<string, [number, number, OscillatorType, number]> = {
    caverna: [55, 55.7, 'sine', 0.05],
    fogo: [73, 74.2, 'triangle', 0.035],
    subida: [98, 98.9, 'sine', 0.035],
    fora: [196, 294, 'sine', 0.018],
    volta: [49, 49.4, 'sine', 0.06],
    final: [131, 196, 'sine', 0.025],
  };
  const d = base[tipo];
  if (!d) return;
  const g = c.createGain();
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(d[3], c.currentTime + 2);
  g.connect(mestre);
  const os = [d[0], d[1]].map((f) => {
    const o = c.createOscillator();
    o.type = d[2];
    o.frequency.value = f;
    o.connect(g);
    o.start();
    return o;
  });
  ambiente = {
    para() {
      const t = c.currentTime;
      g.gain.linearRampToValueAtTime(0, t + 0.6);
      os.forEach((o) => o.stop(t + 0.7));
    },
  };
}
