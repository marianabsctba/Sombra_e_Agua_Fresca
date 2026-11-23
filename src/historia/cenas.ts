import type { Cena } from '../jogo/tipos';

// Mapas em texto. Legenda dos ladrilhos em src/motor/mapa.ts.

const FUNDO = [
  '############################',
  '############################',
  '##WWWWWWWWWWWWWWWWWWWWWWWW##',
  '##WWWWWWWWWWWWWWWWWWWWWWWW##',
  '#..........................#',
  '#.,........,.........,.....#',
  '#..........................#',
  '#....K....K.....K....K.....#',
  '#......,..............,....#',
  '#..........................#',
  '#MMMMMMMMMMMMMMMMMMMMMMMM..#',
  '#.....................,....#',
  '#..........................#',
  '############################',
];

const FOGO = [
  '##############################',
  '#MMMMMMMMMMMMMMMMMMMMMMMMMMM##',
  '#...........................##',
  '#..,.......Q......,....Q....##',
  '#...........................##',
  '#...H.......................##',
  '#.........F.....F...........##',
  '#............................S',
  '#.....,.............,........S',
  '#............................S',
  '#...........................##',
  '#..R........................##',
  '#...........................##',
  '##############################',
];

/** Subida: os quatro andares. O andar 1 tem um labirinto de chão falso (X). */
function subida(): string[] {
  const m = [
    '######################', // 0
    '##########^^##########', // 1
    '#.........LL.........#', // 2
    '#.........LL.........#', // 3
    '#....................#', // 4
    '######P######P########', // 5  porta de Kant (6) e de Sócrates (13)
    '#....................#', // 6
    '#..L..L..L..L..L..L..#', // 7
    '##########P###########', // 8  porta de Pitágoras (10)
    '#....................#', // 9
    '#..R.............R...#', // 10
    '#....................#', // 11
    '#.LLLLLLLLLLLLLLLLLL.#', // 12
    '#....................#', // 13
    '#....................#', // 14
    '#..R.............R...#', // 15
    '#....................#', // 16
    '#########SS###########', // 17
    '#....................#', // 18
    '#BBBBBBBBBBBBBBBBBBBB#', // 19
    '#BBBBBBBBBBBBBBBBBBBB#', // 20
    '#....................#', // 21
    '#..O.................#', // 22
    '#....................#', // 23
    '#..............R.....#', // 24
    '#.............SSS....#', // 25
    '#....................#', // 26
    '#....................#', // 27
    '##########SS##########', // 28
    '#....................#', // 29
  ];
  // andar 1, linhas 30 a 40: tudo é chão falso, menos o caminho verdadeiro
  const lab: string[][] = [];
  for (let y = 30; y <= 40; y++) lab.push(('#' + 'X'.repeat(20) + '#').split(''));
  const caminho: [number, number][] = [];
  const linha = (x0: number, x1: number, y: number) => {
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) caminho.push([x, y]);
  };
  const coluna = (x: number, y0: number, y1: number) => {
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) caminho.push([x, y]);
  };
  coluna(3, 40, 37);
  linha(3, 9, 37);
  coluna(9, 37, 34);
  linha(9, 5, 34);
  coluna(5, 34, 32);
  linha(5, 15, 32);
  coluna(15, 32, 30);
  linha(15, 17, 30);
  // um atalho falso tentador e uma ilha de chão bom para confundir
  linha(12, 18, 38);
  coluna(18, 38, 36);
  for (const [x, y] of caminho) lab[y - 30][x] = '.';
  for (const l of lab) m.push(l.join(''));
  m.push(
    '#....................#', // 41
    '#..~~~...............#', // 42
    '#....................#', // 43
    '#....................#', // 44
    '######################', // 45
  );
  return m;
}

/** Lá fora: gerado por camadas para ficar orgânico. */
function fora(): string[] {
  const W = 40;
  const H = 26;
  const g: string[][] = [];
  for (let y = 0; y < H; y++) g.push(Array.from({ length: W }, () => 'G'));
  const put = (x: number, y: number, c: string) => {
    if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = c;
  };
  // borda de árvores
  for (let x = 0; x < W; x++) {
    put(x, 0, 'T');
    put(x, H - 1, 'T');
  }
  for (let y = 0; y < H; y++) {
    put(0, y, 'T');
    put(W - 1, y, 'T');
  }
  // rochedo da caverna à esquerda
  for (let y = 8; y <= 16; y++) for (let x = 0; x <= 3; x++) put(x, y, '#');
  put(3, 12, '^');
  put(2, 12, '^');
  // lago
  for (let y = 15; y <= 21; y++) for (let x = 10; x <= 17; x++) {
    const borda = (y === 15 || y === 21) && (x === 10 || x === 17);
    if (!borda) put(x, y, '~');
  }
  // jardim de Epicuro
  for (let y = 16; y <= 22; y++) for (let x = 27; x <= 35; x++) if ((x + y) % 3 !== 0) put(x, y, 'g');
  // Liceu de Aristóteles
  for (const x of [19, 21, 25, 27]) put(x, 4, 'C');
  for (let x = 19; x <= 27; x++) put(x, 8, 'h');
  // caminhos
  for (let x = 4; x <= 30; x++) put(x, 12, 'h');
  for (let y = 2; y <= 12; y++) put(30, y, 'h');
  for (let x = 30; x <= 37; x++) put(x, 3, 'h');
  for (let y = 12; y <= 18; y++) put(24, y, 'h');
  // morro do sol
  for (let y = 1; y <= 4; y++) for (let x = 34; x <= 38; x++) if (g[y][x] === 'G') put(x, y, 'h');
  // árvores soltas
  for (const [x, y] of [[8, 4], [5, 3], [12, 3], [14, 6], [6, 19], [4, 22], [19, 22], [22, 20], [36, 12], [33, 9], [37, 20], [26, 2], [16, 11]] as const) put(x, y, 'T');
  // flores aleatórias
  for (const [x, y] of [[7, 8], [9, 10], [20, 14], [21, 16], [6, 15], [34, 14], [12, 9]] as const) put(x, y, 'g');
  // estátuas
  put(23, 2, 'D');
  return g.map((l) => l.join(''));
}

const SECRETA = [
  '####################',
  '##WWWWWWWWWWWWWWWW##',
  '##WWWWWWWWWWWWWWWW##',
  '#..................#',
  '#..................#',
  '#........,.........#',
  '#..................#',
  '#..................#',
  '#....,.............#',
  '#..................#',
  '#..................#',
  '####################',
];

// prisioneiros na fileira da frente, olhando a parede
const PRESOS: [string, number][] = [
  ['doxa', 3], ['sartre', 5], ['critico', 7], ['parmenides', 9], ['zenao', 13],
  ['heraclito', 15], ['pirro', 17], ['trasimaco', 19], ['marx', 21],
];

export const CENAS: Record<string, Cena> = {
  fundo: {
    id: 'fundo',
    titulo: 'Ato 1: O Fundo',
    subtitulo: 'onde a SombraTV nunca sai do ar',
    mapa: FUNDO,
    paleta: 'caverna',
    ambiente: 'caverna',
    inicio: [11, 6],
    efeito: 'sombras',
    conversaEntrada: 'entrada_fundo',
    limite: { se: '!flag:solto', x0: 2, y0: 5, x1: 23, y1: 7, conversa: 'limite_corrente' },
    npcs: [
      ...PRESOS.map(([id, x]) => ({ id, x, y: 6, conversa: `${id}1`, olhar: 'cima' as const })),
      { id: 'socrates', x: 12, y: 8, conversa: 'socrates1', balao: 'Psiu! Glauco!' },
    ],
    gatilhos: [{ x: 24, y: 12, w: 3, h: 1, se: 'flag:solto', fx: ['cena:fogo'] }],
  },

  fogo: {
    id: 'fogo',
    titulo: 'Ato 2: O Fogo',
    subtitulo: 'atrás do muro, alguém segura o coelho',
    mapa: FOGO,
    paleta: 'fogo',
    ambiente: 'fogo',
    inicio: [3, 12],
    efeito: 'nenhum',
    conversaEntrada: 'entrada_fogo',
    npcs: [
      { id: 'gorgias', x: 8, y: 4, conversa: 'gorgias1', balao: 'Vaga aberta!' },
      { id: 'protagoras', x: 4, y: 3, conversa: 'protagoras1' },
      { id: 'maquiavel', x: 13, y: 2, conversa: 'maquiavel1' },
      { id: 'debord', x: 18, y: 4, conversa: 'debord1' },
      { id: 'baudrillard', x: 21, y: 2, conversa: 'baudrillard1', vaivem: 2 },
      { id: 'han', x: 25, y: 4, conversa: 'han1', balao: 'Só mais uma sombra...' },
      { id: 'foucault', x: 26, y: 11, conversa: 'foucault1' },
      { id: 'socrates', x: 6, y: 9, conversa: 'socrates2' },
    ],
    gatilhos: [{ x: 29, y: 7, w: 1, h: 3, se: 'flag:recusou', fx: ['cena:subida'], bloqueio: 'bloqueio_subida' }],
  },

  subida: {
    id: 'subida',
    titulo: 'Ato 3: A Subida',
    subtitulo: 'quatro andares, nenhum elevador',
    mapa: subida(),
    paleta: 'subida',
    ambiente: 'subida',
    inicio: [10, 44],
    efeito: 'nenhum',
    conversaEntrada: 'entrada_subida',
    abertos: [
      { x: 10, y: 8, se: 'flag:pitagoras' },
      { x: 13, y: 5, se: 'flag:aporia' },
    ],
    npcs: [
      { id: 'poca', quem: '', x: 6, y: 42, conversa: 'poca', obj: 'brilho' },
      { id: 'diogenes', x: 16, y: 42, conversa: 'diogenes1', balao: 'Sai do meu sol.' },
      { id: 'hiparquia', x: 18, y: 43, conversa: 'hiparquia1' },
      { id: 'tales', x: 4, y: 23, conversa: 'tales1', balao: 'Olha o poço!' },
      { id: 'camus', x: 18, y: 23, conversa: 'camus1' },
      { id: 'sisifo', x: 15, y: 26, conversa: 'sisifo1', vaivem: 2 },
      { id: 'kierkegaard', x: 12, y: 21, conversa: 'kierkegaard1' },
      { id: 'descartes', x: 6, y: 14, conversa: 'descartes1', vaivem: 3 },
      { id: 'pitagoras', x: 12, y: 9, conversa: 'pitagoras1' },
      { id: 'kant', x: 4, y: 6, conversa: 'kant1', vaivem: 2 },
      { id: 'portakant', quem: '', x: 6, y: 6, conversa: 'portakant', obj: 'nada' },
      { id: 'socrates', x: 15, y: 6, conversa: 'socrates3' },
      { id: 'wittgenstein', x: 12, y: 2, conversa: 'wittgenstein1' },
    ],
    gatilhos: [
      { x: 1, y: 41, w: 20, h: 1, umaVez: 'placa1', conversa: 'placa1' },
      { x: 1, y: 27, w: 20, h: 1, umaVez: 'placa2', conversa: 'placa2' },
      { x: 1, y: 16, w: 20, h: 1, umaVez: 'placa3', conversa: 'placa3' },
      { x: 1, y: 7, w: 20, h: 1, umaVez: 'placa4', conversa: 'placa4' },
      { x: 10, y: 1, w: 2, h: 1, se: 'flag:escada', fx: ['cena:fora'], bloqueio: 'bloqueio_saida' },
    ],
  },

  fora: {
    id: 'fora',
    titulo: 'Ato 4: Lá Fora',
    subtitulo: 'o sol não tem titereiro',
    mapa: fora(),
    paleta: 'fora',
    ambiente: 'fora',
    inicio: [5, 12],
    efeito: 'claridade',
    conversaEntrada: 'entrada_fora',
    npcs: [
      { id: 'sombrachao', quem: '', x: 7, y: 13, conversa: 'sombrachao', obj: 'sombra' },
      { id: 'reflexo', quem: '', x: 13, y: 14, conversa: 'reflexo', obj: 'brilho' },
      { id: 'socrates', x: 6, y: 10, conversa: 'socrates4' },
      { id: 'cadeira', quem: '', x: 22, y: 6, conversa: 'cadeira', obj: 'cadeira', objCor: '#8a5a34', se: 'visao>=1' },
      { id: 'cavalo', quem: '', x: 15, y: 8, conversa: 'cavalo', obj: 'cavalo', objCor: '#7a4a2a', vaivem: 3, se: 'visao>=1' },
      { id: 'arvore', quem: '', x: 9, y: 4, conversa: 'arvore', obj: 'arvore', objCor: '#3f8a3a', se: 'visao>=1' },
      { id: 'balanca', quem: '', x: 26, y: 13, conversa: 'balanca', obj: 'balanca', objCor: '#d8cfbd', se: 'visao>=1' },
      { id: 'sol', quem: '', x: 37, y: 2, conversa: 'sol', obj: 'sol', objCor: '#ffcc33' },
      { id: 'rachadura', quem: '', x: 20, y: 1, conversa: 'rachadura', obj: 'rachadura', se: 'formas>=7' },
      { id: 'aristoteles', x: 23, y: 6, conversa: 'aristoteles1', se: 'visao>=2' },
      { id: 'platao', x: 26, y: 7, conversa: 'platao1', se: 'visao>=2', balao: 'Glauco?!' },
      { id: 'epicuro', x: 31, y: 18, conversa: 'epicuro1', se: 'visao>=2' },
      { id: 'marcoaurelio', x: 28, y: 10, conversa: 'marcoaurelio1', se: 'visao>=2' },
      { id: 'nietzsche', x: 36, y: 8, conversa: 'nietzsche1', se: 'visao>=2', vaivem: 2 },
      { id: 'diotima', x: 20, y: 18, conversa: 'diotima1', se: 'visao>=2' },
      { id: 'hipatia', x: 33, y: 6, conversa: 'hipatia1', se: 'visao>=2' },
      { id: 'spinoza', x: 8, y: 17, conversa: 'spinoza1', se: 'visao>=1' },
      { id: 'laotse', x: 18, y: 16, conversa: 'laotse1', se: 'visao>=2' },
      { id: 'confucio', x: 24, y: 11, conversa: 'confucio1', se: 'visao>=2' },
      { id: 'beauvoir', x: 11, y: 9, conversa: 'beauvoir1', se: 'visao>=2' },
      { id: 'schopenhauer', x: 6, y: 21, conversa: 'schopenhauer1', se: 'visao>=2' },
    ],
    gatilhos: [{ x: 2, y: 12, w: 2, h: 1, se: 'flag:decidiuVoltar', fx: ['cena:volta'], bloqueio: 'bloqueio_volta' }],
  },

  volta: {
    id: 'volta',
    titulo: 'Ato 5: A Volta',
    subtitulo: 'quem desce para contar, vira assunto',
    mapa: FUNDO,
    paleta: 'volta',
    ambiente: 'volta',
    inicio: [25, 11],
    efeito: 'escuro',
    conversaEntrada: 'entrada_volta',
    npcs: [
      ...PRESOS.map(([id, x]) => ({ id, x, y: 6, conversa: `${id}5`, olhar: 'cima' as const })),
      { id: 'socrates', x: 23, y: 9, conversa: 'socrates5' },
      { id: 'arendt', x: 8, y: 9, conversa: 'arendt5', se: 'flag:debates>=4' },
      { id: 'anito', x: 12, y: 9, conversa: 'anito5', se: 'flag:debates>=4', balao: 'Assembleia!' },
    ],
    gatilhos: [],
  },

  secreta: {
    id: 'secreta',
    titulo: 'A Caverna da Caverna',
    subtitulo: 'final secreto',
    mapa: SECRETA,
    paleta: 'subida',
    ambiente: 'final',
    inicio: [10, 9],
    efeito: 'sombras',
    conversaEntrada: 'entrada_secreta',
    npcs: [
      { id: 'descartes', x: 5, y: 6, conversa: 'descartes6' },
      { id: 'bacon', x: 15, y: 6, conversa: 'bacon6' },
      { id: 'socrates', x: 10, y: 5, conversa: 'socrates6' },
    ],
    gatilhos: [],
  },
};
