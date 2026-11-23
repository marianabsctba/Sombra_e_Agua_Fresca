// Trilha épica gerada na hora: um sequenciador de 16 passos por compasso com
// tímpano, caixa, baixo, arpejo, acordes de fundo e melodia. Cada ato tem tema
// próprio (tom, andamento, progressão e "humor" da percussão).

type Acorde = number[]; // semitons a partir da tônica do tema

interface Tema {
  bpm: number;
  tonica: number; // nota MIDI
  escala: number[];
  progressao: Acorde[];
  /** 0 = só tímpano solto, 1 = marcha, 2 = galope */
  bateria: 0 | 1 | 2;
  arpejo: boolean;
  melodia: number; // densidade 0..1
  semente: number;
  brilho: number; // abertura do filtro dos metais
}

const MENOR = [0, 2, 3, 5, 7, 8, 10];
const MAIOR = [0, 2, 4, 5, 7, 9, 11];
const FRIGIO = [0, 1, 3, 5, 7, 8, 10];

// acordes como graus em semitons (tríades)
const i = [0, 3, 7], iv = [5, 8, 12], v = [7, 11, 14], VI = [8, 12, 15], III = [3, 7, 10], VII = [10, 14, 17], II = [1, 5, 8];
const I = [0, 4, 7], IV = [5, 9, 12], V = [7, 11, 14], vi = [9, 12, 16];

export const TEMAS: Record<string, Tema> = {
  titulo: { bpm: 92, tonica: 50, escala: MENOR, progressao: [i, VI, III, VII], bateria: 1, arpejo: true, melodia: 0.7, semente: 7, brilho: 1800 },
  caverna: { bpm: 72, tonica: 45, escala: MENOR, progressao: [i, iv, i, v], bateria: 0, arpejo: false, melodia: 0.35, semente: 3, brilho: 900 },
  fogo: { bpm: 118, tonica: 52, escala: FRIGIO, progressao: [i, II, i, VII], bateria: 2, arpejo: true, melodia: 0.55, semente: 11, brilho: 2200 },
  subida: { bpm: 104, tonica: 50, escala: MENOR, progressao: [i, VI, VII, i, VI, VII, v, v], bateria: 1, arpejo: true, melodia: 0.6, semente: 19, brilho: 1600 },
  fora: { bpm: 100, tonica: 48, escala: MAIOR, progressao: [I, V, vi, IV], bateria: 1, arpejo: true, melodia: 0.75, semente: 23, brilho: 3200 },
  volta: { bpm: 80, tonica: 45, escala: MENOR, progressao: [i, VI, iv, v], bateria: 0, arpejo: true, melodia: 0.4, semente: 31, brilho: 1100 },
  final: { bpm: 76, tonica: 53, escala: MAIOR, progressao: [I, vi, IV, V], bateria: 0, arpejo: true, melodia: 0.6, semente: 41, brilho: 2400 },
};

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

function aleatorio(semente: number): () => number {
  let s = semente * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Melodia: uma frase de 4 compassos que se repete, com notas do acorde nos tempos fortes. */
function comporFrase(t: Tema): (number | null)[][] {
  const r = aleatorio(t.semente);
  const frase: (number | null)[][] = [];
  let grau = 4; // posição na escala, em torno da quinta
  for (let c = 0; c < 4; c++) {
    const acorde = t.progressao[c % t.progressao.length];
    const passos: (number | null)[] = new Array(16).fill(null);
    for (let p = 0; p < 16; p += 2) {
      const forte = p % 8 === 0;
      if (!forte && r() > t.melodia) continue;
      if (forte) {
        // tempo forte: nota do acorde, perto de onde a melodia está
        const alvo = acorde[Math.floor(r() * 3)];
        passos[p] = alvo + (alvo < 6 ? 12 : 0);
      } else {
        grau = Math.max(0, Math.min(9, grau + Math.floor(r() * 5) - 2));
        const oit = Math.floor(grau / 7);
        passos[p] = t.escala[grau % 7] + 12 * oit;
      }
    }
    // fim de frase: nota longa
    if (c === 3) {
      passos.fill(null, 8);
      passos[8] = t.progressao[3 % t.progressao.length][0] + 12;
    }
    frase.push(passos);
  }
  return frase;
}

export class Musica {
  private ac: AudioContext;
  private saida: GainNode;
  private ruido: AudioBuffer;
  private tema: Tema | null = null;
  private frase: (number | null)[][] = [];
  private passo = 0;
  private proximo = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private geracao = 0;

  constructor(ac: AudioContext, destino: AudioNode) {
    this.ac = ac;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    this.saida = ac.createGain();
    this.saida.gain.value = 0;
    this.saida.connect(comp).connect(destino);
    this.ruido = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = this.ruido.getChannelData(0);
    for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
  }

  tocar(nome: string): void {
    const t = TEMAS[nome];
    if (!t || t === this.tema) return;
    const agora = this.ac.currentTime;
    // troca suave: abaixa, muda o tema, sobe
    this.saida.gain.cancelScheduledValues(agora);
    this.saida.gain.setValueAtTime(this.saida.gain.value, agora);
    this.saida.gain.linearRampToValueAtTime(0, agora + 0.4);
    const g = ++this.geracao;
    setTimeout(() => {
      if (g !== this.geracao) return;
      this.tema = t;
      this.frase = comporFrase(t);
      this.passo = 0;
      this.proximo = this.ac.currentTime + 0.05;
      const a = this.ac.currentTime;
      this.saida.gain.setValueAtTime(0, a);
      this.saida.gain.linearRampToValueAtTime(0.55, a + 1.5);
      if (!this.timer) this.timer = setInterval(() => this.agendar(), 25);
    }, 420);
  }

  parar(): void {
    this.geracao++;
    this.tema = null;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.saida.gain.setTargetAtTime(0, this.ac.currentTime, 0.2);
  }

  private agendar(): void {
    const t = this.tema;
    if (!t) return;
    const dur = 60 / t.bpm / 4; // semicolcheia
    while (this.proximo < this.ac.currentTime + 0.15) {
      this.tocarPasso(t, this.passo, this.proximo, dur);
      this.passo++;
      this.proximo += dur;
    }
  }

  private tocarPasso(t: Tema, n: number, quando: number, dur: number): void {
    const p = n % 16;
    const compasso = Math.floor(n / 16);
    const acorde = t.progressao[compasso % t.progressao.length];
    const raiz = t.tonica + acorde[0];
    const fimDeFrase = compasso % 4 === 3;

    // acordes de fundo (cordas), um por compasso
    if (p === 0) {
      for (const s of acorde) this.nota(hz(t.tonica + s), quando, dur * 16, 'sawtooth', 0.035, 700, 0.5, 0.6);
    }

    // baixo pulsante em colcheias
    if (p % 2 === 0) {
      const oit = p === 6 || p === 14 ? 12 : 0;
      this.nota(hz(raiz - 12 + oit), quando, dur * 1.8, 'square', 0.07, 420, 0.005, 0.1);
    }

    // arpejo em semicolcheias
    if (t.arpejo) {
      const ordem = [0, 1, 2, 1];
      const s = acorde[ordem[p % 4]] + 12 + (p >= 8 ? 12 : 0);
      this.nota(hz(t.tonica + s), quando, dur * 0.9, 'square', 0.022, 2600, 0.002, 0.05);
    }

    // melodia de metais
    const m = this.frase[compasso % 4]?.[p];
    if (m !== null && m !== undefined && compasso >= 2) {
      const longa = fimDeFrase && p === 8 ? 8 : 2;
      this.nota(hz(t.tonica + 12 + m), quando, dur * longa, 'sawtooth', 0.06, t.brilho, 0.02, 0.25, true);
    }

    // percussão
    if (t.bateria === 0) {
      if (p === 0) this.tambor(quando, 0.9);
      if (fimDeFrase && (p === 12 || p === 14)) this.tambor(quando, 0.6);
    } else if (t.bateria === 1) {
      if (p === 0 || p === 8) this.tambor(quando, 1);
      if (p === 4 || p === 12) this.caixa(quando, 0.5);
      if (fimDeFrase && p >= 12) this.caixa(quando, 0.3 + (p - 12) * 0.1);
    } else {
      if (p % 4 === 0 || p === 3 || p === 11) this.tambor(quando, p % 8 === 0 ? 1 : 0.6);
      if (p === 4 || p === 12) this.caixa(quando, 0.55);
      if (p % 2 === 1) this.chimbal(quando);
    }
    if (p === 0 && compasso % 4 === 0) this.prato(quando);
  }

  private nota(
    f: number, quando: number, dur: number, tipo: OscillatorType, vol: number,
    corte: number, ataque: number, solta: number, vibrato = false,
  ): void {
    const ac = this.ac;
    const o = ac.createOscillator();
    o.type = tipo;
    o.frequency.value = f;
    if (vibrato) {
      const lfo = ac.createOscillator();
      const lg = ac.createGain();
      lfo.frequency.value = 5.5;
      lg.gain.value = f * 0.006;
      lfo.connect(lg).connect(o.frequency);
      lfo.start(quando);
      lfo.stop(quando + dur + solta + 0.05);
      // um segundo oscilador levemente desafinado engrossa o metal
      const o2 = ac.createOscillator();
      o2.type = tipo;
      o2.frequency.value = f * 1.004;
      o2.connect(this.cadeia(quando, dur, vol * 0.6, corte, ataque, solta));
      o2.start(quando);
      o2.stop(quando + dur + solta + 0.05);
    }
    o.connect(this.cadeia(quando, dur, vol, corte, ataque, solta));
    o.start(quando);
    o.stop(quando + dur + solta + 0.05);
  }

  private cadeia(quando: number, dur: number, vol: number, corte: number, ataque: number, solta: number): AudioNode {
    const ac = this.ac;
    const fil = ac.createBiquadFilter();
    fil.type = 'lowpass';
    fil.frequency.value = corte;
    fil.Q.value = 1;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, quando);
    g.gain.linearRampToValueAtTime(vol, quando + ataque);
    g.gain.setValueAtTime(vol, quando + Math.max(ataque, dur - 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, quando + dur + solta);
    fil.connect(g).connect(this.saida);
    return fil;
  }

  /** Tímpano: seno grave com queda de altura. */
  private tambor(quando: number, forca: number): void {
    const ac = this.ac;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, quando);
    o.frequency.exponentialRampToValueAtTime(42, quando + 0.25);
    g.gain.setValueAtTime(0.32 * forca, quando);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + 0.45);
    o.connect(g).connect(this.saida);
    o.start(quando);
    o.stop(quando + 0.5);
  }

  private barulho(quando: number, dur: number, vol: number, tipo: BiquadFilterType, freq: number): void {
    const ac = this.ac;
    const s = ac.createBufferSource();
    s.buffer = this.ruido;
    const f = ac.createBiquadFilter();
    f.type = tipo;
    f.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, quando);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
    s.connect(f).connect(g).connect(this.saida);
    s.start(quando, Math.random() * 0.5);
    s.stop(quando + dur + 0.02);
  }

  private caixa(quando: number, forca: number): void {
    this.barulho(quando, 0.16, 0.16 * forca, 'bandpass', 1800);
  }

  private chimbal(quando: number): void {
    this.barulho(quando, 0.04, 0.04, 'highpass', 7000);
  }

  private prato(quando: number): void {
    this.barulho(quando, 1.4, 0.06, 'highpass', 5000);
  }
}
