import { avaliar } from './condicao';
import type { Conversa, Escolha, Estado, Linha } from './tipos';

/**
 * Anda por uma conversa. Não desenha nada: a tela pergunta a linha atual e as
 * escolhas visíveis; o jogo aplica os efeitos pelo callback.
 */
export class Dialogo {
  private no: string;
  private i = 0;
  acabou = false;

  constructor(
    readonly id: string,
    private conv: Conversa,
    private estado: Estado,
    private aplicar: (fx: string[]) => void,
    inicio = 'inicio',
  ) {
    this.no = inicio;
    this.entrar(inicio);
  }

  private entrar(no: string): void {
    const n = this.conv[no];
    if (!n) throw new Error(`nó "${no}" não existe na conversa ${this.id}`);
    if (n.ramos) {
      const r = n.ramos.find((x) => avaliar(x.se, this.estado));
      if (n.fx) this.aplicar(n.fx);
      if (r) return this.entrar(r.ir);
      this.acabou = true;
      return;
    }
    this.no = no;
    this.i = 0;
    if (n.l.length === 0) this.fimDasLinhas();
  }

  linha(): Linha | null {
    if (this.acabou) return null;
    return this.conv[this.no].l[this.i] ?? null;
  }

  /** Escolhas aparecem junto com a última linha do nó. */
  escolhas(): Escolha[] {
    if (this.acabou) return [];
    const n = this.conv[this.no];
    if (!n.esc || this.i < n.l.length - 1) return [];
    return n.esc.filter((e) => avaliar(e.se, this.estado));
  }

  avancar(): void {
    if (this.acabou) return;
    if (this.escolhas().length) return;
    const n = this.conv[this.no];
    if (this.i < n.l.length - 1) {
      this.i++;
      return;
    }
    this.fimDasLinhas();
  }

  escolher(k: number): void {
    const op = this.escolhas()[k];
    if (!op) return;
    const n = this.conv[this.no];
    if (n.fx) this.aplicar(n.fx);
    if (op.fx) this.aplicar(op.fx);
    if (this.acabou) return;
    if (op.ir) this.entrar(op.ir);
    else this.acabou = true;
  }

  private fimDasLinhas(): void {
    const n = this.conv[this.no];
    if (n.esc && n.esc.some((e) => avaliar(e.se, this.estado))) {
      this.i = Math.max(0, n.l.length - 1);
      return;
    }
    if (n.fx) this.aplicar(n.fx);
    if (this.acabou) return;
    if (n.ir) this.entrar(n.ir);
    else this.acabou = true;
  }

  /** Para quando um efeito (troca de cena, minijogo, final) encerra a conversa. */
  encerrar(): void {
    this.acabou = true;
  }
}
