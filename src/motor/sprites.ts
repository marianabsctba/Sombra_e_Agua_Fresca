// Gente e silhuetas desenhadas pixel a pixel por código.

export type EstiloCabelo = 'careca' | 'calvo' | 'curto' | 'longo' | 'coque' | 'cacheado' | 'rabo' | 'topete' | 'louro';
export type Barba = 'nada' | 'curta' | 'longa' | 'bigode' | 'enorme';
export type Roupa = 'toga' | 'tunica' | 'terno' | 'vestido' | 'manto' | 'trapo';
export type Acessorio =
  | 'lanterna' | 'barril' | 'oculos' | 'chapeu' | 'livro' | 'pergaminho' | 'coroa' | 'louros'
  | 'cachimbo' | 'tartaruga' | 'pedra' | 'lente' | 'cigarro' | 'cracha' | 'fita' | 'lira'
  | 'peruca' | 'relogio' | 'estrela' | 'corrente' | 'boina' | 'cajado' | 'nenhum';

export interface Aparencia {
  pele: string;
  cabelo: string;
  estilo: EstiloCabelo;
  barba: Barba;
  roupa: Roupa;
  cor: string;
  cor2?: string;
  acessorio?: Acessorio;
  acorrentado?: boolean;
  sentado?: boolean;
}

export type Olhar = 'baixo' | 'cima' | 'esq' | 'dir';

type Pinta = (x: number, y: number, w: number, h: number, c: string) => void;

export function desenharPessoa(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ap: Aparencia,
  t: number,
  olhar: Olhar = 'baixo',
  andando = false,
): void {
  const espelho = olhar === 'esq';
  const p: Pinta = (x, y, w, h, c) => {
    ctx.fillStyle = c;
    const rx = espelho ? 16 - x - w : x;
    ctx.fillRect(Math.round(ox + rx), Math.round(oy + y), w, h);
  };
  const passo = andando ? Math.floor(t * 8) % 2 : 0;
  const resp = !andando && Math.floor(t * 1.5) % 2 === 1 ? 1 : 0;
  const sent = ap.sentado ? 2 : 0;
  const dy = sent;
  const escuro = 'rgba(0,0,0,0.28)';

  // sombra no chão
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(Math.round(ox + 4), Math.round(oy + 15), 8, 1);

  if (ap.acessorio === 'barril') {
    // só a cabeça para fora do barril
    p(3, 8, 10, 8, '#8a5a2e');
    p(3, 9, 10, 1, '#5a3a1c');
    p(3, 13, 10, 1, '#5a3a1c');
    p(4, 8, 1, 8, '#a8723c');
    cabeca(p, ap, olhar, 3 + resp);
    p(1, 6 + resp, 2, 1, ap.pele);
    p(1, 3 + resp, 1, 3, '#d8d0b0');
    p(0, 1 + resp, 3, 2, '#ffd36b');
    return;
  }

  // pernas
  const perna = ap.roupa === 'terno' ? '#2a2633' : ap.pele;
  if (!ap.sentado) {
    p(5, 13, 2, 2 - (passo ? 1 : 0), perna);
    p(9, 13, 2, 2 - (passo ? 0 : 1), perna);
    p(5, 15 - (passo ? 1 : 0), 2, 1, '#3b2a20');
    p(9, 15 - (passo ? 0 : 1), 2, 1, '#3b2a20');
  } else {
    p(4, 13, 8, 2, perna);
  }

  // corpo
  const yb = 8 + dy;
  const altCorpo = ap.roupa === 'vestido' || ap.roupa === 'manto' ? 7 - dy : 6 - dy;
  p(4, yb, 8, altCorpo, ap.cor);
  if (ap.roupa === 'toga') {
    p(4, yb, 2, 1, ap.cor2 ?? '#c9b78e');
    p(6, yb + 1, 2, 1, ap.cor2 ?? '#c9b78e');
    p(8, yb + 2, 2, 1, ap.cor2 ?? '#c9b78e');
    p(10, yb + 3, 2, 1, ap.cor2 ?? '#c9b78e');
  } else if (ap.roupa === 'terno') {
    p(7, yb, 2, altCorpo, '#e8e2d6');
    p(7, yb + 1, 2, 3, ap.cor2 ?? '#a02c3c');
  } else if (ap.roupa === 'tunica') {
    p(4, yb + 3, 8, 1, ap.cor2 ?? '#3b2a20');
  } else if (ap.roupa === 'manto') {
    p(4, yb, 1, altCorpo, ap.cor2 ?? '#000');
    p(11, yb, 1, altCorpo, ap.cor2 ?? '#000');
  } else if (ap.roupa === 'trapo') {
    p(5, yb + altCorpo - 1, 1, 1, escuro);
    p(9, yb + altCorpo - 1, 2, 1, escuro);
    p(6, yb + 2, 1, 1, escuro);
  }
  p(4, yb + altCorpo - 1, 8, 1, escuro);

  // braços
  const braco = ap.roupa === 'terno' ? ap.cor : ap.pele;
  const ab = andando ? (passo ? 1 : 0) : 0;
  p(3, yb + 1 + ab, 1, 4, braco);
  p(12, yb + 1 + (1 - ab) * (andando ? 1 : 0), 1, 4, braco);
  p(3, yb + 5 + ab, 1, 1, ap.pele);
  p(12, yb + 5, 1, 1, ap.pele);

  cabeca(p, ap, olhar, dy + resp * 0);

  if (ap.acorrentado) {
    p(2, yb + 5, 12, 1, '#8b8794');
    p(3, yb + 5, 1, 1, '#c8c4d0');
    p(7, yb + 5, 1, 1, '#c8c4d0');
    p(11, yb + 5, 1, 1, '#c8c4d0');
    p(1, 15, 3, 1, '#8b8794');
  }

  acessorio(p, ap, t, dy);
}

function cabeca(p: Pinta, ap: Aparencia, olhar: Olhar, dy: number): void {
  const y = 2 + dy;
  p(5, y, 6, 6, ap.pele);
  p(5, y + 5, 6, 1, 'rgba(0,0,0,0.12)');
  const c = ap.cabelo;
  switch (ap.estilo) {
    case 'careca':
      p(6, y, 3, 1, 'rgba(255,255,255,0.25)');
      break;
    case 'calvo':
      p(4, y + 1, 1, 3, c);
      p(11, y + 1, 1, 3, c);
      p(6, y, 2, 1, 'rgba(255,255,255,0.25)');
      break;
    case 'curto':
      p(5, y - 1, 6, 2, c);
      p(4, y, 1, 3, c);
      p(11, y, 1, 3, c);
      break;
    case 'topete':
      p(5, y - 1, 6, 2, c);
      p(7, y - 2, 4, 1, c);
      p(4, y, 1, 2, c);
      p(11, y, 1, 2, c);
      break;
    case 'louro':
    case 'longo':
      p(5, y - 1, 6, 2, c);
      p(4, y, 1, 7, c);
      p(11, y, 1, 7, c);
      break;
    case 'coque':
      p(5, y - 1, 6, 2, c);
      p(6, y - 3, 4, 2, c);
      p(4, y, 1, 3, c);
      p(11, y, 1, 3, c);
      break;
    case 'cacheado':
      p(4, y - 2, 8, 3, c);
      p(3, y, 2, 4, c);
      p(11, y, 2, 4, c);
      p(5, y - 2, 1, 1, 'rgba(255,255,255,0.15)');
      p(9, y - 1, 1, 1, 'rgba(255,255,255,0.15)');
      break;
    case 'rabo':
      p(5, y - 1, 6, 2, c);
      p(4, y, 1, 3, c);
      p(11, y, 1, 3, c);
      p(12, y + 2, 1, 3, c);
      break;
  }
  if (olhar === 'cima') {
    if (ap.estilo !== 'careca' && ap.estilo !== 'calvo') p(5, y, 6, 4, c);
    return;
  }
  const lado = olhar === 'dir' || olhar === 'esq' ? 1 : 0;
  p(6 + lado, y + 3, 1, 1, '#1a1220');
  p(9 + lado, y + 3, 1, 1, '#1a1220');
  switch (ap.barba) {
    case 'curta':
      p(5, y + 4, 6, 2, c);
      p(7, y + 4, 2, 1, ap.pele);
      break;
    case 'longa':
      p(5, y + 4, 6, 2, c);
      p(6, y + 6, 4, 3, c);
      p(7, y + 4, 2, 1, ap.pele);
      break;
    case 'enorme':
      p(4, y + 3, 8, 3, c);
      p(5, y + 6, 6, 4, c);
      p(7, y + 4, 2, 1, ap.pele);
      break;
    case 'bigode':
      p(6, y + 4, 4, 1, c);
      break;
  }
}

function acessorio(p: Pinta, ap: Aparencia, t: number, dy: number): void {
  const y = 2 + dy;
  switch (ap.acessorio) {
    case 'oculos':
      p(5, y + 3, 2, 1, '#22222e');
      p(9, y + 3, 2, 1, '#22222e');
      p(7, y + 3, 2, 1, '#22222e');
      p(6, y + 3, 1, 1, '#9fd6ff');
      p(9, y + 3, 1, 1, '#9fd6ff');
      break;
    case 'chapeu':
      p(3, y - 1, 10, 1, '#2a2230');
      p(5, y - 4, 6, 3, '#2a2230');
      break;
    case 'boina':
      p(4, y - 2, 8, 2, '#2a2230');
      p(10, y - 3, 2, 1, '#2a2230');
      break;
    case 'peruca':
      p(3, y - 1, 10, 3, '#efe9e2');
      p(3, y + 2, 2, 5, '#efe9e2');
      p(11, y + 2, 2, 5, '#efe9e2');
      break;
    case 'louros':
      p(4, y, 1, 1, '#5fa04a');
      p(5, y - 1, 2, 1, '#5fa04a');
      p(9, y - 1, 2, 1, '#5fa04a');
      p(11, y, 1, 1, '#5fa04a');
      break;
    case 'coroa':
      p(5, y - 2, 6, 1, '#ffcc33');
      p(5, y - 3, 1, 1, '#ffcc33');
      p(7, y - 3, 2, 1, '#ffcc33');
      p(10, y - 3, 1, 1, '#ffcc33');
      break;
    case 'lanterna': {
      const brilho = 0.6 + Math.sin(t * 6) * 0.2;
      p(13, 9 + dy, 1, 2, '#6b5a3a');
      p(12, 11 + dy, 3, 3, '#ffd36b');
      p(13, 12 + dy, 1, 1, '#fff6c8');
      p(11, 10 + dy, 5, 5, `rgba(255,220,120,${(brilho * 0.25).toFixed(2)})`);
      break;
    }
    case 'livro':
      p(11, 11 + dy, 4, 4, '#7a2a3a');
      p(11, 11 + dy, 1, 4, '#d8c9a0');
      break;
    case 'pergaminho':
      p(11, 10 + dy, 3, 5, '#efe3c0');
      p(11, 10 + dy, 3, 1, '#b89a5a');
      p(11, 14 + dy, 3, 1, '#b89a5a');
      break;
    case 'lira':
      p(12, 9 + dy, 1, 5, '#d8a84a');
      p(14, 9 + dy, 1, 5, '#d8a84a');
      p(12, 13 + dy, 3, 1, '#d8a84a');
      p(13, 10 + dy, 1, 3, '#fff2c8');
      break;
    case 'cachimbo':
      p(10, y + 5, 3, 1, '#3b2a20');
      p(12, y + 4, 2, 1, '#3b2a20');
      if (Math.floor(t * 2) % 2) p(13, y + 2, 1, 1, '#ccc');
      break;
    case 'cigarro':
      p(10, y + 5, 3, 1, '#eee');
      p(13, y + 5, 1, 1, '#ff6a3a');
      if (Math.floor(t * 2) % 2) p(14, y + 3, 1, 1, '#aaa');
      break;
    case 'tartaruga':
      p(13, 13, 3, 2, '#4f8a3a');
      p(16, 14, 1, 1, '#8fbf6a');
      p(14, 13, 1, 1, '#2f5a22');
      break;
    case 'pedra':
      p(11, 7 + dy, 6, 6, '#7d7684');
      p(12, 7 + dy, 3, 1, '#a39cab');
      break;
    case 'lente':
      p(12, 10 + dy, 3, 3, '#cfeaff');
      p(12, 10 + dy, 3, 1, '#7b8ca0');
      p(13, 11 + dy, 1, 1, '#ffffff');
      break;
    case 'cracha':
      p(6, 10 + dy, 3, 3, '#ffffff');
      p(6, 10 + dy, 3, 1, '#ff7a3d');
      break;
    case 'fita':
      p(3, 12 + dy, 10, 1, '#ffcc33');
      break;
    case 'relogio':
      p(12, 12 + dy, 2, 2, '#ffcc33');
      p(12, 12 + dy, 1, 1, '#fff');
      break;
    case 'estrela':
      p(13, 1, 1, 3, '#fff6a8');
      p(12, 2, 3, 1, '#fff6a8');
      break;
    case 'cajado':
      p(13, 3 + dy, 1, 12, '#8a6a3a');
      p(12, 3 + dy, 3, 1, '#8a6a3a');
      break;
  }
}

// ---------- silhuetas: a matéria-prima das sombras na parede

export const SILHUETAS: Record<string, string[]> = {
  coelho: [
    '...XX..XX...',
    '...XX..XX...',
    '...XX..XX...',
    '...XXXXXX...',
    '..XXXXXXXX..',
    '..XX.XX.XX..',
    '..XXXXXXXX..',
    '...XXXXXX...',
    '..XXXXXXXX.X',
    '.XXXXXXXXXXX',
    '.XXXXXXXXXX.',
    '..XX....XX..',
  ],
  cavalo: [
    '.........XX.',
    '........XXXX',
    '.......XXXXX',
    '......XXXX..',
    '.XXXXXXXXX..',
    'XXXXXXXXXX..',
    'XXXXXXXXXX..',
    'X.XXXXXXXX..',
    '..X.X..X.X..',
    '..X.X..X.X..',
    '..X.X..X.X..',
    '..X.X..X.X..',
  ],
  passaro: [
    '............',
    'XX..........',
    'XXX......XX.',
    '.XXX....XXXX',
    '..XXX..XXXX.',
    '...XXXXXXX..',
    '....XXXXXXXX',
    '.....XXXXX..',
    '......XXX...',
    '.......X....',
    '............',
    '............',
  ],
  homem: [
    '....XXXX....',
    '....XXXX....',
    '....XXXX....',
    '.....XX.....',
    '..XXXXXXXX..',
    '.X.XXXXXX.X.',
    '.X.XXXXXX.X.',
    '...XXXXXX...',
    '...XX..XX...',
    '...XX..XX...',
    '...XX..XX...',
    '..XXX..XXX..',
  ],
  vaso: [
    '...XXXXXX...',
    '....XXXX....',
    '....XXXX....',
    '...XXXXXX...',
    '..XXXXXXXX..',
    '.XXXXXXXXXX.',
    '.XXXXXXXXXX.',
    '.XXXXXXXXXX.',
    '..XXXXXXXX..',
    '...XXXXXX...',
    '....XXXX....',
    '...XXXXXX...',
  ],
  arvore: [
    '....XXXX....',
    '..XXXXXXXX..',
    '.XXXXXXXXXX.',
    'XXXXXXXXXXXX',
    'XXXXXXXXXXXX',
    '.XXXXXXXXXX.',
    '..XXXXXXXX..',
    '.....XX.....',
    '.....XX.....',
    '.....XX.....',
    '....XXXX....',
    '...XXXXXX...',
  ],
  cadeira: [
    '..XX........',
    '..XX........',
    '..XX........',
    '..XX........',
    '..XX........',
    '..XXXXXXXX..',
    '..XXXXXXXX..',
    '..XX....XX..',
    '..XX....XX..',
    '..XX....XX..',
    '..XX....XX..',
    '..XX....XX..',
  ],
  triangulo: [
    '.....XX.....',
    '.....XX.....',
    '....XXXX....',
    '....X..X....',
    '...XX..XX...',
    '...X....X...',
    '..XX....XX..',
    '..X......X..',
    '.XX......XX.',
    '.X........X.',
    'XXXXXXXXXXXX',
    'XXXXXXXXXXXX',
  ],
  balanca: [
    '.....XX.....',
    'XXXXXXXXXXXX',
    'X....XX....X',
    'X....XX....X',
    'XX...XX...XX',
    'XXX..XX..XXX',
    '.....XX.....',
    '.....XX.....',
    '.....XX.....',
    '.....XX.....',
    '...XXXXXX...',
    '..XXXXXXXX..',
  ],
  coracao: [
    '............',
    '.XXX....XXX.',
    'XXXXX..XXXXX',
    'XXXXXXXXXXXX',
    'XXXXXXXXXXXX',
    'XXXXXXXXXXXX',
    '.XXXXXXXXXX.',
    '..XXXXXXXX..',
    '...XXXXXX...',
    '....XXXX....',
    '.....XX.....',
    '............',
  ],
  sol: [
    '.X...XX...X.',
    '..X..XX..X..',
    '....XXXX....',
    '...XXXXXX...',
    'XXXXXXXXXXXX',
    'XXXXXXXXXXXX',
    '...XXXXXX...',
    '....XXXX....',
    '..X..XX..X..',
    '.X...XX...X.',
    '............',
    '............',
  ],
};

export function desenharSilhueta(
  ctx: CanvasRenderingContext2D,
  nome: string,
  x: number,
  y: number,
  cor: string,
  escala = 1,
): void {
  const s = SILHUETAS[nome];
  if (!s) return;
  ctx.fillStyle = cor;
  for (let j = 0; j < s.length; j++) {
    const l = s[j];
    for (let i = 0; i < l.length; i++) {
      if (l[i] === 'X') ctx.fillRect(Math.round(x + i * escala), Math.round(y + j * escala), escala, escala);
    }
  }
}
