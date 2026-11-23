import type { Conversa } from '../jogo/tipos';
import { FALAS1 } from './falas1';
import { FALAS2 } from './falas2';
import { FALAS3 } from './falas3';
import { FALAS4 } from './falas4';
import { FALAS5 } from './falas5';

export const CONVERSAS: Record<string, Conversa> = {
  ...FALAS1,
  ...FALAS2,
  ...FALAS3,
  ...FALAS4,
  ...FALAS5,
};

export const FORMAS: Record<string, { nome: string; silhueta: string }> = {
  cadeira: { nome: 'A Cadeira em Si', silhueta: 'cadeira' },
  cavalo: { nome: 'O Cavalo em Si', silhueta: 'cavalo' },
  arvore: { nome: 'A Árvore em Si', silhueta: 'arvore' },
  justica: { nome: 'A Justiça em Si', silhueta: 'balanca' },
  beleza: { nome: 'A Beleza em Si', silhueta: 'coracao' },
  triangulo: { nome: 'O Triângulo em Si', silhueta: 'triangulo' },
  bem: { nome: 'A Ideia do Bem', silhueta: 'sol' },
};
