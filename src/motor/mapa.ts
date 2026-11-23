// Ladrilhos de 16x16 desenhados por código. Cada cena escolhe uma paleta.

export const T = 16;

export interface Paleta {
  fundo: string;
  rocha: string;
  rocha2: string;
  rocha3: string;
  chao: string;
  chao2: string;
  parede: string;
  muro: string;
  muro2: string;
  grama: string;
  grama2: string;
  agua: string;
  agua2: string;
  folha: string;
  tronco: string;
  pedra: string;
  pedra2: string;
}

/** Caracteres que bloqueiam a passagem (a cena pode abrir exceções). */
export const SOLIDOS = new Set(['#', 'W', 'M', 'F', '~', 'T', 'R', 'B', 'P', ' ', 'C', 'O', 'H', 'Q', 'D']);

function ruido(x: number, y: number, s = 0): number {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

export function desenharLadrilho(
  c: CanvasRenderingContext2D,
  ch: string,
  tx: number,
  ty: number,
  px: number,
  py: number,
  p: Paleta,
  t: number,
  vizinho: (dx: number, dy: number) => string,
  rachado = false,
): void {
  const r = (x: number, y: number, w: number, h: number, cor: string) => {
    c.fillStyle = cor;
    c.fillRect(px + x, py + y, w, h);
  };
  const salpica = (cor: string, n: number, sem: number) => {
    for (let i = 0; i < n; i++) {
      const a = ruido(tx, ty, sem + i);
      const b = ruido(ty, tx, sem + i * 3);
      r(Math.floor(a * 15), Math.floor(b * 15), 1, 1, cor);
    }
  };
  switch (ch) {
    case ' ':
      r(0, 0, T, T, p.fundo);
      break;
    case '#': {
      r(0, 0, T, T, p.rocha);
      salpica(p.rocha2, 6, 1);
      salpica(p.rocha3, 3, 7);
      if (vizinho(0, 1) !== '#' && vizinho(0, 1) !== ' ') r(0, 13, T, 3, p.rocha3);
      if (vizinho(0, -1) !== '#' && vizinho(0, -1) !== ' ') r(0, 0, T, 2, p.rocha2);
      break;
    }
    case '.':
    case ',':
    case 'X':
    case 'K':
    case '^': {
      r(0, 0, T, T, p.chao);
      salpica(p.chao2, ch === ',' ? 9 : 4, 11);
      if (ch === 'K') {
        for (let i = 0; i < 6; i++) r(2 + i * 2, 8 + (i % 2), 2, 1, '#8b8794');
      }
      if (ch === 'X' && rachado) {
        r(3, 4, 1, 1, '#00000088');
        r(4, 5, 2, 1, '#00000088');
        r(6, 6, 1, 2, '#00000088');
        r(7, 8, 3, 1, '#00000088');
        r(10, 9, 1, 2, '#00000088');
        r(9, 3, 1, 3, '#00000066');
      }
      if (ch === '^') {
        const a = 0.35 + Math.sin(t * 2 + tx) * 0.1;
        c.fillStyle = `rgba(255,248,220,${a.toFixed(2)})`;
        c.fillRect(px, py, T, T);
      }
      break;
    }
    case 'L': {
      r(0, 0, T, T, p.pedra);
      r(0, 0, T, 1, p.pedra2);
      r(0, 0, 1, T, p.pedra2);
      r(8, 8, 8, 1, p.pedra2);
      r(8, 8, 1, 8, p.pedra2);
      break;
    }
    case 'W': {
      // a parede onde passam as sombras: rocha lisa iluminada pelo fogo
      const tremor = Math.sin(t * 9 + tx * 0.7) * 0.04 + Math.sin(t * 23) * 0.02;
      r(0, 0, T, T, p.parede);
      c.fillStyle = `rgba(255,190,110,${(0.1 + tremor).toFixed(3)})`;
      c.fillRect(px, py, T, T);
      salpica('rgba(0,0,0,0.06)', 3, 5);
      break;
    }
    case 'M': {
      r(0, 0, T, T, p.muro);
      r(0, 0, T, 2, p.muro2);
      r(0, 7, T, 1, p.muro2);
      r(ty % 2 ? 4 : 10, 2, 1, 5, p.muro2);
      r(ty % 2 ? 12 : 2, 8, 1, 8, p.muro2);
      break;
    }
    case 'F': {
      r(0, 0, T, T, p.chao);
      r(2, 12, 12, 3, '#4a2a1a');
      r(3, 11, 2, 2, '#6b3a22');
      r(10, 11, 3, 2, '#6b3a22');
      const f = Math.floor(t * 10);
      const ch1 = ['#ff5a1f', '#ff7a2a', '#ff9a3a'];
      for (let i = 0; i < 5; i++) {
        const alt = 6 + Math.floor(ruido(i, f, 3) * 6);
        r(3 + i * 2, 12 - alt, 2, alt, ch1[(i + f) % 3]);
        r(4 + i * 2, 13 - alt + 2, 1, Math.max(1, alt - 4), '#ffd36b');
      }
      break;
    }
    case '~': {
      r(0, 0, T, T, p.agua);
      const o = Math.floor(t * 3 + tx) % 4;
      r((o * 4) % 16, 4, 4, 1, p.agua2);
      r(((o + 2) * 4) % 16, 11, 5, 1, p.agua2);
      break;
    }
    case 'G':
    case 'g':
    case 'h': {
      r(0, 0, T, T, ch === 'h' ? '#d9c28a' : p.grama);
      salpica(ch === 'h' ? '#c7ab70' : p.grama2, 7, 21);
      if (ch === 'g') {
        const cores = ['#ff8ab0', '#ffd36b', '#ffffff', '#b99cff'];
        for (let i = 0; i < 3; i++) {
          r(Math.floor(ruido(tx, ty, 40 + i) * 13) + 1, Math.floor(ruido(ty, tx, 40 + i) * 13) + 1, 2, 2, cores[(tx + ty + i) % 4]);
        }
      }
      break;
    }
    case 'T': {
      r(0, 0, T, T, p.grama);
      r(6, 10, 4, 6, p.tronco);
      r(1, 1, 14, 10, p.folha);
      r(3, 0, 10, 1, p.folha);
      r(2, 2, 3, 2, '#ffffff22');
      r(1, 9, 14, 2, '#00000022');
      break;
    }
    case 'R': {
      r(0, 0, T, T, p.chao);
      r(2, 5, 12, 10, p.pedra);
      r(3, 4, 9, 2, p.pedra2);
      r(2, 13, 12, 2, '#00000033');
      break;
    }
    case 'B': {
      r(0, 0, T, T, '#05030a');
      if (vizinho(0, -1) !== 'B') r(0, 0, T, 2, p.rocha3);
      break;
    }
    case 'P': {
      r(0, 0, T, T, p.muro);
      r(2, 0, 12, T, '#5a3a24');
      r(3, 1, 10, 14, '#7a5030');
      r(7, 1, 2, 14, '#5a3a24');
      r(10, 8, 2, 2, '#ffcc33');
      break;
    }
    case 'p': {
      r(0, 0, T, T, p.chao);
      r(0, 0, 2, T, p.muro);
      r(14, 0, 2, T, p.muro);
      r(2, 0, 12, 1, '#5a3a24');
      break;
    }
    case 'C': {
      r(0, 0, T, T, p.grama);
      r(4, 0, 8, T, '#e8e2d2');
      r(3, 0, 10, 2, '#fffaf0');
      r(3, 14, 10, 2, '#cfc6b0');
      r(6, 2, 1, 12, '#cfc6b0');
      r(9, 2, 1, 12, '#cfc6b0');
      break;
    }
    case 'S': {
      r(0, 0, T, T, p.pedra);
      for (let i = 0; i < 4; i++) r(0, i * 4, T, 1, p.pedra2);
      r(0, 3, T, 1, '#00000033');
      r(0, 11, T, 1, '#00000033');
      break;
    }
    case 'O': {
      r(0, 0, T, T, p.chao);
      r(1, 2, 14, 12, p.pedra);
      r(3, 4, 10, 8, '#05030a');
      r(1, 2, 14, 2, p.pedra2);
      break;
    }
    case 'H': {
      // mesa ou bancada
      r(0, 0, T, T, p.chao);
      r(0, 4, T, 6, '#7a5030');
      r(0, 4, T, 1, '#a0703e');
      r(1, 10, 2, 6, '#5a3a24');
      r(13, 10, 2, 6, '#5a3a24');
      break;
    }
    case 'Q': {
      // estante de bonecos dos titereiros
      r(0, 0, T, T, p.chao);
      r(0, 2, T, 13, '#4a2e1c');
      r(1, 5, 14, 1, '#7a5030');
      r(1, 10, 14, 1, '#7a5030');
      r(2, 2, 2, 3, '#1b1020');
      r(6, 3, 3, 2, '#1b1020');
      r(11, 2, 2, 3, '#1b1020');
      r(3, 7, 3, 3, '#1b1020');
      r(9, 6, 4, 4, '#1b1020');
      break;
    }
    case 'D': {
      // estátua / dado de pedra lá fora
      r(0, 0, T, T, p.grama);
      r(3, 3, 10, 12, '#e8e2d2');
      r(3, 3, 10, 2, '#fffaf0');
      r(3, 13, 10, 2, '#cfc6b0');
      break;
    }
    default:
      r(0, 0, T, T, p.chao);
  }
}

export const PALETAS: Record<string, Paleta> = {
  caverna: {
    fundo: '#0d0710', rocha: '#3a2230', rocha2: '#4d2e3d', rocha3: '#24141e',
    chao: '#5a3428', chao2: '#4a2a20', parede: '#c98a5e', muro: '#6b4030', muro2: '#4d2c22',
    grama: '#3a5a2a', grama2: '#2f4a22', agua: '#1d3a5a', agua2: '#3a6a9a', folha: '#3f6a2f',
    tronco: '#5a3a24', pedra: '#6b5a62', pedra2: '#85727c',
  },
  fogo: {
    fundo: '#0d0710', rocha: '#4a2626', rocha2: '#5e3030', rocha3: '#2a1416',
    chao: '#6e3a24', chao2: '#5a2e1c', parede: '#c98a5e', muro: '#8a4a2e', muro2: '#6b3622',
    grama: '#3a5a2a', grama2: '#2f4a22', agua: '#1d3a5a', agua2: '#3a6a9a', folha: '#3f6a2f',
    tronco: '#5a3a24', pedra: '#7a5a4a', pedra2: '#946e5a',
  },
  subida: {
    fundo: '#0b0a14', rocha: '#2e2a40', rocha2: '#3b3654', rocha3: '#1c1a2a',
    chao: '#4a4462', chao2: '#3e3854', parede: '#c98a5e', muro: '#565072', muro2: '#403a5a',
    grama: '#3a5a2a', grama2: '#2f4a22', agua: '#2a4a7a', agua2: '#6a9ad0', folha: '#3f6a2f',
    tronco: '#5a3a24', pedra: '#6a6488', pedra2: '#8a84a8',
  },
  fora: {
    fundo: '#bfe6ff', rocha: '#9a8e9e', rocha2: '#b0a4b4', rocha3: '#7a6e80',
    chao: '#d9c28a', chao2: '#c7ab70', parede: '#c98a5e', muro: '#cfc6b0', muro2: '#b0a690',
    grama: '#8fd17a', grama2: '#74b862', agua: '#6fc3e8', agua2: '#c8f0ff', folha: '#4fa85a',
    tronco: '#8a5a34', pedra: '#c8c0d0', pedra2: '#e0dae8',
  },
  volta: {
    fundo: '#050307', rocha: '#2a1824', rocha2: '#382030', rocha3: '#180c14',
    chao: '#43271f', chao2: '#381f18', parede: '#a8724e', muro: '#55332a', muro2: '#3d241d',
    grama: '#3a5a2a', grama2: '#2f4a22', agua: '#1d3a5a', agua2: '#3a6a9a', folha: '#3f6a2f',
    tronco: '#5a3a24', pedra: '#5a4a52', pedra2: '#70606a',
  },
};
