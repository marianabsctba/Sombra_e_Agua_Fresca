import { CENAS } from '../historia/cenas';
import type { Jogo } from './jogo';

/**
 * Robô que joga pelo núcleo, sem teclado: conversa com alguém pelo id,
 * escolhe opções pelo começo do texto e resolve minijogos.
 * Usado nos testes e no navegador (window.robo).
 */
export class Robo {
  log: string[] = [];
  constructor(readonly j: Jogo) {}

  /** Termina conversas pendentes, avançando falas sem escolha. */
  esvaziar(): void {
    for (let i = 0; i < 500; i++) {
      if (this.j.mini || this.j.modo !== 'mundo') return;
      if (!this.j.dialogo && this.j.pendentes.length) {
        this.j.abrirConversa(this.j.pendentes.shift()!);
        continue;
      }
      const d = this.j.dialogo;
      if (!d) return;
      if (d.escolhas().length) return;
      const l = d.linha();
      if (l) this.log.push(`${l[0] || '*'}: ${l[1]}`);
      this.j.avancar();
    }
    throw new Error('conversa sem fim');
  }

  falar(id: string): this {
    this.esvaziar();
    const n = this.j.npcsVisiveis().find((x) => x.id === id);
    if (!n) throw new Error(`"${id}" não está visível na cena ${this.j.cena.id}`);
    const p = this.j.posNpc(n);
    this.j.px = p.x;
    this.j.py = p.y + 12;
    this.j.abrirConversa(n.conversa, n);
    this.esvaziar();
    return this;
  }

  escolher(comeco: string): this {
    this.esvaziar();
    const d = this.j.dialogo;
    if (!d) throw new Error(`sem conversa aberta para escolher "${comeco}"`);
    const esc = d.escolhas();
    const k = esc.findIndex((e) => e.t.startsWith(comeco));
    if (k < 0) throw new Error(`escolha "${comeco}" não existe. Há: ${esc.map((e) => e.t).join(' | ')}`);
    this.log.push(`> ${esc[k].t}`);
    this.j.escolher(k);
    this.esvaziar();
    return this;
  }

  mini(): this {
    this.esvaziar();
    if (!this.j.mini) throw new Error('nenhum minijogo aberto');
    this.j.mini.resolver();
    this.j.aplicar(this.j.mini.fx);
    this.j.mini = null;
    this.esvaziar();
    return this;
  }

  /** Pisa num gatilho da cena (pelo índice), como se tivesse andado até ele. */
  gatilho(i: number): this {
    this.esvaziar();
    const g = this.j.cena.gatilhos[i];
    if (!g) throw new Error(`gatilho ${i} não existe em ${this.j.cena.id}`);
    if (g.fx) this.j.aplicar(g.fx);
    this.esvaziar();
    return this;
  }

  cena(): string {
    return this.j.cena.id;
  }

  // ---------- caminhos completos até cada final

  ato1(): this {
    return this.falar('socrates').escolher('Um coelho')
      .falar('trasimaco').escolher('Quero disputar').mini()
      .falar('socrates').escolher('...nada');
  }

  ato2(aceitar = false): this {
    this.gatilho(0);
    this.falar('gorgias').escolher('Bora').mini().falar('gorgias');
    if (aceitar) return this.escolher('Aceito');
    return this.escolher('Não. Quero ver');
  }

  ato3(): this {
    this.gatilho(0);
    this.falar('kierkegaard').escolher('Pular');
    this.falar('pitagoras').escolher('180').escolher('5.').escolher('Não!');
    this.falar('socrates').escolher('Dar a cada um').escolher('Eu... não sei');
    this.falar('wittgenstein').escolher('...');
    const sair = CENAS.subida.gatilhos.findIndex((g) => g.fx?.includes('cena:fora'));
    return this.gatilho(sair);
  }

  ato4(todasAsFormas = false): this {
    this.falar('sombrachao').falar('reflexo');
    this.falar('cadeira').falar('cavalo').falar('arvore');
    if (todasAsFormas) this.falar('balanca').falar('diotima');
    this.falar('hipatia').falar('sol');
    return this;
  }

  ato5(bom: boolean): this {
    const tom: Record<string, [string, string]> = {
      doxa: ['A senhora já viu', 'A senhora nunca'],
      trasimaco: ['Se o mais forte', 'Seu título'],
      critico: ['Se tudo na parede', 'Você só sabe'],
      parmenides: ['Se o ser é uno', 'Então por que'],
      pirro: ['Se nada é certo', 'Com o senhor'],
      zenao: ['E mesmo assim', 'Sua tartaruga'],
    };
    for (const [id, [boa, ruim]] of Object.entries(tom)) this.falar(id).escolher(bom ? boa : ruim);
    this.falar('marx').falar('heraclito');
    return this;
  }
}
