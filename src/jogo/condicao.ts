import type { Estado } from './tipos';

/**
 * Condições em texto curto, para a história ficar legível:
 *   "flag:solto"      flag ligada        "!flag:solto"   flag desligada
 *   "visao>=3"        "irrit>=4"         "cartas>=10"    "formas>=7"
 *   "conv>=3"         "conv:doxa"        "carta:kant"    "forma:bem"
 * Várias condições separadas por "&" precisam valer todas.
 */
export function avaliar(cond: string | undefined, e: Estado): boolean {
  if (!cond) return true;
  return cond.split('&').every((parte) => avaliarUma(parte.trim(), e));
}

function avaliarUma(c: string, e: Estado): boolean {
  if (c.startsWith('!')) return !avaliarUma(c.slice(1), e);
  const m = /^(visao|irrit|cartas|formas|conv|flag:[\w-]+)(>=|<=|>|<|==)(\d+)$/.exec(c);
  if (m) {
    const v = valor(m[1], e);
    const n = Number(m[3]);
    switch (m[2]) {
      case '>=': return v >= n;
      case '<=': return v <= n;
      case '>': return v > n;
      case '<': return v < n;
      default: return v === n;
    }
  }
  const [tipo, id] = c.split(':');
  switch (tipo) {
    case 'flag': return (e.flags[id] ?? 0) > 0;
    case 'carta': return e.cartas.includes(id);
    case 'forma': return e.formas.includes(id);
    case 'conv': return e.convencidos.includes(id);
    case 'final': return e.finaisVistos.includes(id);
  }
  throw new Error(`condição desconhecida: ${c}`);
}

function valor(chave: string, e: Estado): number {
  switch (chave) {
    case 'visao': return e.visao;
    case 'irrit': return e.irritacao;
    case 'cartas': return e.cartas.length;
    case 'formas': return e.formas.length;
    case 'conv': return e.convencidos.length;
  }
  return e.flags[chave.slice(5)] ?? 0;
}

export function condicaoValida(cond: string): boolean {
  try {
    avaliar(cond, {
      cena: '', x: 0, y: 0, flags: {}, cartas: [], formas: [], convencidos: [],
      irritacao: 0, visao: 0, final: null, finaisVistos: [], tempo: 0,
    });
    return true;
  } catch {
    return false;
  }
}
