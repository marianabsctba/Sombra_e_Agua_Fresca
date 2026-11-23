import type { Aparencia } from '../motor/sprites';

/** Uma fala: quem diz (id do personagem, ou "" para narração) e o texto. */
export type Linha = [quem: string, texto: string];

export interface Escolha {
  t: string;
  ir?: string;
  fx?: string[];
  se?: string;
}

export interface No {
  l: Linha[];
  /** desvio automático: o primeiro ramo cuja condição vale é seguido */
  ramos?: { se?: string; ir: string }[];
  esc?: Escolha[];
  ir?: string;
  fx?: string[];
}

/** Conversa: nós com nome; a entrada é sempre "inicio". */
export type Conversa = Record<string, No>;

export interface Npc {
  id: string;
  /** personagem (aparência, nome, voz); se ausente usa o id */
  quem?: string;
  x: number;
  y: number;
  conversa: string;
  se?: string;
  olhar?: 'baixo' | 'cima' | 'esq' | 'dir';
  /** objeto desenhado como silhueta em vez de pessoa */
  obj?: string;
  objCor?: string;
  /** passeia de um lado para o outro (em ladrilhos) */
  vaivem?: number;
  /** frase curta que aparece em balão quando a jogadora chega perto */
  balao?: string;
}

export interface Gatilho {
  x: number;
  y: number;
  w: number;
  h: number;
  se?: string;
  fx?: string[];
  conversa?: string;
  umaVez?: string;
  /** conversa mostrada quando a condição falha (e a jogadora é empurrada de volta) */
  bloqueio?: string;
}

export type EfeitoCena = 'sombras' | 'claridade' | 'escuro' | 'estrelas' | 'nenhum';

export interface Cena {
  id: string;
  titulo: string;
  subtitulo: string;
  mapa: string[];
  paleta: string;
  ambiente: string;
  inicio: [number, number];
  npcs: Npc[];
  gatilhos: Gatilho[];
  efeito: EfeitoCena;
  conversaEntrada?: string;
  /** retângulo (em ladrilhos) onde a jogadora pode andar enquanto a condição valer */
  limite?: { se: string; x0: number; y0: number; x1: number; y1: number; conversa: string };
  /** ladrilhos abertos por condição, ex.: porta "P" vira passagem com flag */
  abertos?: { x: number; y: number; se: string }[];
}

export interface Estado {
  cena: string;
  x: number;
  y: number;
  flags: Record<string, number>;
  cartas: string[];
  formas: string[];
  convencidos: string[];
  irritacao: number;
  visao: number;
  final: string | null;
  finaisVistos: string[];
  tempo: number;
}

export function estadoNovo(): Estado {
  return {
    cena: 'fundo',
    x: -1,
    y: -1,
    flags: {},
    cartas: [],
    formas: [],
    convencidos: [],
    irritacao: 0,
    visao: 0,
    final: null,
    finaisVistos: [],
    tempo: 0,
  };
}

export interface Personagem {
  nome: string;
  cor: string;
  voz: number;
  ap: Aparencia;
}
