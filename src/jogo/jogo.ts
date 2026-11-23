import { ALBUM, ORDEM_ALBUM } from '../historia/album';
import { CENAS } from '../historia/cenas';
import { FINAIS } from '../historia/finais';
import { CONVERSAS, FORMAS } from '../historia/index';
import { PERSONAGENS } from '../historia/personagens';
import { criarMinijogo, type Minijogo } from '../minijogos/minijogos';
import type { Comandos } from '../motor/entrada';
import { SOLIDOS, T } from '../motor/mapa';
import { efeitos, tocarAmbiente } from '../motor/som';
import type { Olhar } from '../motor/sprites';
import { avaliar } from './condicao';
import { Dialogo } from './dialogo';
import { estadoNovo, type Cena, type Estado, type Npc } from './tipos';

export interface Armazem {
  ler(): Estado | null;
  gravar(e: Estado | null): void;
  lerPermanente(): { cartas: string[]; finais: string[] };
  gravarPermanente(p: { cartas: string[]; finais: string[] }): void;
}

export const armazemDeMentira = (): Armazem => {
  let e: Estado | null = null;
  let p = { cartas: [] as string[], finais: [] as string[] };
  return {
    ler: () => (e ? structuredClone(e) : null),
    gravar: (x) => (e = x ? structuredClone(x) : null),
    lerPermanente: () => structuredClone(p),
    gravarPermanente: (x) => (p = structuredClone(x)),
  };
};

export interface Aviso {
  txt: string;
  cor: string;
  t: number;
}

export type Modo = 'titulo' | 'mundo' | 'final';

type Ret = { x: number; y: number; w: number; h: number };

const VELOCIDADE = 66;

export class Jogo {
  e: Estado = estadoNovo();
  modo: Modo = 'titulo';
  cena: Cena = CENAS.fundo;
  px = 0;
  py = 0;
  olhar: Olhar = 'cima';
  andando = false;
  dialogo: Dialogo | null = null;
  falandoCom: string | null = null;
  mini: Minijogo | null = null;
  albumAberto = false;
  albumSel = 0;
  avisos: Aviso[] = [];
  tituloCena = 0;
  tempo = 0;
  tempoMundo = 0;
  tempoCena = 0;
  pendentes: string[] = [];
  sel = 0;
  revelado = 0;
  menuSel = 0;
  /** retângulos clicáveis das escolhas, preenchidos por quem desenha */
  rectsEscolha: Ret[] = [];
  rectsMenu: Ret[] = [];
  private dentro = new Set<number>();
  private seguro = { x: 0, y: 0 };
  private esperaLimite = 0;
  private passoT = 0;
  permanente: { cartas: string[]; finais: string[] };

  constructor(private armazem: Armazem) {
    this.permanente = armazem.lerPermanente();
  }

  temSalvo(): boolean {
    return this.armazem.ler() !== null;
  }

  // ------------------------------------------------------------ partida

  novoJogo(): void {
    this.e = estadoNovo();
    this.e.cartas = [...this.permanente.cartas];
    this.e.finaisVistos = [...this.permanente.finais];
    this.modo = 'mundo';
    this.dialogo = null;
    this.mini = null;
    this.pendentes = [];
    this.irPara('fundo');
  }

  continuar(): void {
    const s = this.armazem.ler();
    if (!s) return this.novoJogo();
    this.e = s;
    this.modo = 'mundo';
    this.irPara(s.cena, s.x >= 0 ? { px: s.x, py: s.y } : undefined);
  }

  irPara(id: string, pos?: { tx?: number; ty?: number; px?: number; py?: number }): void {
    const c = CENAS[id];
    if (!c) throw new Error(`cena desconhecida: ${id}`);
    this.cena = c;
    this.e.cena = id;
    if (pos?.px !== undefined && pos.py !== undefined) {
      this.px = pos.px;
      this.py = pos.py;
    } else {
      const [tx, ty] = pos?.tx !== undefined && pos.ty !== undefined ? [pos.tx, pos.ty] : c.inicio;
      this.px = tx * T + 8;
      this.py = ty * T + 14;
    }
    this.seguro = { x: this.px, y: this.py };
    this.dentro = new Set(this.gatilhosEmQueEsta());
    this.olhar = id === 'fundo' && !this.e.flags.solto ? 'cima' : 'baixo';
    this.tituloCena = 3.2;
    this.tempoCena = 0;
    const chave = `viu_${id}`;
    if (c.conversaEntrada && !this.e.flags[chave]) {
      this.e.flags[chave] = 1;
      this.pendentes.push(c.conversaEntrada);
    }
    tocarAmbiente(c.ambiente);
    this.salvar();
  }

  salvar(): void {
    if (this.modo !== 'mundo') return;
    this.e.x = this.px;
    this.e.y = this.py;
    this.armazem.gravar(this.e);
  }

  // ------------------------------------------------------------ efeitos

  aplicar(fx: string[]): void {
    for (const f of fx) this.aplicarUm(f);
  }

  private aplicarUm(f: string): void {
    let m: RegExpExecArray | null;
    if ((m = /^-flag:([\w-]+)$/.exec(f))) {
      delete this.e.flags[m[1]];
    } else if ((m = /^flag:([\w-]+)([=+])(-?\d+)$/.exec(f))) {
      const n = Number(m[3]);
      this.e.flags[m[1]] = m[2] === '=' ? n : (this.e.flags[m[1]] ?? 0) + n;
    } else if ((m = /^flag:([\w-]+)$/.exec(f))) {
      this.e.flags[m[1]] = 1;
    } else if ((m = /^carta:(\w+)$/.exec(f))) {
      this.ganharCarta(m[1]);
    } else if ((m = /^forma:(\w+)$/.exec(f))) {
      if (!this.e.formas.includes(m[1])) {
        this.e.formas.push(m[1]);
        this.avisar(`Forma encontrada: ${FORMAS[m[1]]?.nome ?? m[1]} (${this.e.formas.length}/7)`, '#ffe08a');
        efeitos.forma();
      }
    } else if ((m = /^conv:(\w+)$/.exec(f))) {
      if (!this.e.convencidos.includes(m[1])) this.e.convencidos.push(m[1]);
    } else if ((m = /^irrit([+-])(\d+)$/.exec(f))) {
      this.e.irritacao = Math.max(0, this.e.irritacao + (m[1] === '+' ? 1 : -1) * Number(m[2]));
    } else if ((m = /^visao:(\d+)$/.exec(f))) {
      this.e.visao = Math.max(this.e.visao, Number(m[1]));
    } else if ((m = /^cena:(\w+)$/.exec(f))) {
      this.fecharDialogo();
      this.irPara(m[1]);
    } else if ((m = /^mini:(\w+)$/.exec(f))) {
      this.fecharDialogo();
      this.mini = criarMinijogo(m[1]);
    } else if ((m = /^final:(\w+)$/.exec(f))) {
      this.fecharDialogo();
      this.terminar(m[1]);
    } else if ((m = /^teleporte:(\d+),(\d+)$/.exec(f))) {
      this.px = Number(m[1]) * T + 8;
      this.py = Number(m[2]) * T + 14;
      this.seguro = { x: this.px, y: this.py };
      this.dentro = new Set(this.gatilhosEmQueEsta());
      efeitos.queda();
    } else if ((m = /^conversa:(\w+)$/.exec(f))) {
      this.pendentes.push(m[1]);
    } else {
      throw new Error(`efeito desconhecido: ${f}`);
    }
  }

  ganharCarta(id: string): void {
    if (!ALBUM[id] || this.e.cartas.includes(id)) return;
    this.e.cartas.push(id);
    if (!this.permanente.cartas.includes(id)) {
      this.permanente.cartas.push(id);
      this.armazem.gravarPermanente(this.permanente);
    }
    this.avisar(`Novo no Álbum: ${PERSONAGENS[id]?.nome ?? id} (${this.e.cartas.length}/${ORDEM_ALBUM.length})`, '#9fd6ff');
    efeitos.carta();
  }

  avisar(txt: string, cor = '#ffe8c2'): void {
    this.avisos.push({ txt, cor, t: 3.5 });
  }

  private terminar(id: string): void {
    this.e.final = id;
    if (!this.permanente.finais.includes(id)) this.permanente.finais.push(id);
    this.armazem.gravarPermanente(this.permanente);
    this.armazem.gravar(null);
    this.modo = 'final';
    this.mini = null;
    this.pendentes = [];
    tocarAmbiente('final');
    efeitos.final();
  }

  // ------------------------------------------------------------ conversa

  abrirConversa(id: string, npc?: Npc): void {
    const c = CONVERSAS[id];
    if (!c) throw new Error(`conversa desconhecida: ${id}`);
    this.falandoCom = npc?.id ?? null;
    if (npc) this.ganharCarta(npc.quem ?? npc.id);
    this.sel = 0;
    this.revelado = 0;
    this.dialogo = new Dialogo(id, c, this.e, (fx) => this.aplicar(fx));
    if (this.dialogo.acabou) this.fecharDialogo();
  }

  fecharDialogo(): void {
    this.dialogo?.encerrar();
    this.dialogo = null;
    this.falandoCom = null;
  }

  // ------------------------------------------------------------ mundo

  npcsVisiveis(): Npc[] {
    return this.cena.npcs.filter((n) => avaliar(n.se, this.e));
  }

  posNpc(n: Npc): { x: number; y: number } {
    let off = 0;
    if (n.vaivem) off = ((1 - Math.cos(this.tempoMundo * 0.55 + n.x)) / 2) * n.vaivem * T;
    return { x: n.x * T + 8 + off, y: n.y * T + 14 };
  }

  ladrilho(tx: number, ty: number): string {
    const l = this.cena.mapa[ty];
    if (!l || tx < 0 || tx >= l.length) return ' ';
    return l[tx];
  }

  aberto(tx: number, ty: number): boolean {
    return !!this.cena.abertos?.some((a) => a.x === tx && a.y === ty && avaliar(a.se, this.e));
  }

  solido(tx: number, ty: number): boolean {
    const ch = this.ladrilho(tx, ty);
    if (ch === 'P' && this.aberto(tx, ty)) return false;
    return SOLIDOS.has(ch);
  }

  private colide(x: number, y: number): boolean {
    const pts: [number, number][] = [[x - 5, y - 4], [x + 5, y - 4], [x - 5, y], [x + 5, y]];
    for (const [ax, ay] of pts) if (this.solido(Math.floor(ax / T), Math.floor(ay / T))) return true;
    for (const n of this.npcsVisiveis()) {
      if (n.vaivem || n.obj === 'nada' || n.obj === 'rachadura') continue;
      const p = this.posNpc(n);
      if (Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 7) return true;
    }
    return false;
  }

  private tileDoJogador(): [number, number] {
    return [Math.floor(this.px / T), Math.floor((this.py - 2) / T)];
  }

  private gatilhosEmQueEsta(): number[] {
    const [tx, ty] = this.tileDoJogador();
    const r: number[] = [];
    this.cena.gatilhos.forEach((g, i) => {
      if (tx >= g.x && tx < g.x + g.w && ty >= g.y && ty < g.y + g.h) r.push(i);
    });
    return r;
  }

  npcProximo(): Npc | null {
    let melhor: Npc | null = null;
    let dist = 24;
    for (const n of this.npcsVisiveis()) {
      const p = this.posNpc(n);
      const d = Math.hypot(p.x - this.px, p.y - 4 - (this.py - 4));
      if (d < dist) {
        dist = d;
        melhor = n;
      }
    }
    return melhor;
  }

  // ------------------------------------------------------------ quadro

  atualizar(dt: number, cmd: Comandos): void {
    dt = Math.min(dt, 0.1);
    this.tempo += dt;
    // só os três primeiros avisos aparecem e contam tempo; os outros esperam na fila
    this.avisos.slice(0, 3).forEach((a) => (a.t -= dt));
    this.avisos = this.avisos.filter((a) => a.t > 0);
    if (this.modo === 'titulo') return this.atualizarTitulo(cmd);
    if (this.modo === 'final') {
      if (cmd.apertou('ok') || cmd.clique) {
        this.modo = 'titulo';
        this.menuSel = 0;
      }
      return;
    }
    this.e.tempo += dt;
    if (this.tituloCena > 0) this.tituloCena -= dt;

    if (this.mini) {
      this.mini.atualizar(dt, cmd);
      if (this.mini.acabou) {
        const fx = this.mini.fx;
        this.mini = null;
        this.aplicar(fx);
        this.salvar();
      }
      return;
    }

    if (this.albumAberto) return this.atualizarAlbum(cmd);

    if (this.dialogo) return this.atualizarDialogo(dt, cmd);

    if (this.pendentes.length) {
      // deixa o cartão do ato aparecer antes da primeira fala
      if (this.tituloCena > 1) return;
      this.abrirConversa(this.pendentes.shift()!);
      return;
    }

    if (cmd.apertou('album')) {
      this.albumAberto = true;
      return;
    }

    this.tempoMundo += dt;
    this.tempoCena += dt;
    this.mover(dt, cmd);
    if (this.dialogo || this.modo !== 'mundo') return;

    if (cmd.apertou('ok') || cmd.clique) {
      const n = this.npcProximo();
      if (n) {
        this.abrirConversa(n.conversa, n);
      }
    }
  }

  private mover(dt: number, cmd: Comandos): void {
    let dx = 0;
    let dy = 0;
    if (cmd.segurando('esq')) dx -= 1;
    if (cmd.segurando('dir')) dx += 1;
    if (cmd.segurando('cima')) dy -= 1;
    if (cmd.segurando('baixo')) dy += 1;
    this.andando = dx !== 0 || dy !== 0;
    if (!this.andando) return;
    if (dx && dy) {
      dx *= Math.SQRT1_2;
      dy *= Math.SQRT1_2;
    }
    if (dy < 0) this.olhar = 'cima';
    if (dy > 0) this.olhar = 'baixo';
    if (dx < 0) this.olhar = 'esq';
    if (dx > 0) this.olhar = 'dir';
    const v = VELOCIDADE * dt;
    const nx = this.px + dx * v;
    if (!this.colide(nx, this.py)) this.px = nx;
    const ny = this.py + dy * v;
    if (!this.colide(this.px, ny)) this.py = ny;

    this.passoT -= dt;
    if (this.passoT <= 0) {
      efeitos.passo();
      this.passoT = 0.32;
    }

    // corrente
    const lim = this.cena.limite;
    this.esperaLimite -= dt;
    if (lim && avaliar(lim.se, this.e)) {
      const x0 = lim.x0 * T + 5, x1 = lim.x1 * T + 11, y0 = lim.y0 * T + 6, y1 = lim.y1 * T + 15;
      const cx = Math.min(x1, Math.max(x0, this.px));
      const cy = Math.min(y1, Math.max(y0, this.py));
      if ((cx !== this.px || cy !== this.py) && this.esperaLimite <= 0) {
        this.esperaLimite = 8;
        this.pendentes.push(lim.conversa);
      }
      this.px = cx;
      this.py = cy;
    }

    // chão de imaginação
    const [tx, ty] = this.tileDoJogador();
    if (this.ladrilho(tx, ty) === 'X') {
      this.abrirConversa('queda');
      return;
    }

    // gatilhos
    const agora = this.gatilhosEmQueEsta();
    let empurra = false;
    for (const i of agora) {
      if (this.dentro.has(i)) continue;
      const g = this.cena.gatilhos[i];
      if (avaliar(g.se, this.e)) {
        if (g.umaVez) {
          if (this.e.flags[g.umaVez]) continue;
          this.e.flags[g.umaVez] = 1;
        }
        if (g.conversa) this.pendentes.push(g.conversa);
        if (g.fx) {
          this.aplicar(g.fx);
          return;
        }
      } else if (g.bloqueio) {
        empurra = true;
        this.pendentes.push(g.bloqueio);
      }
    }
    if (empurra) {
      this.px = this.seguro.x;
      this.py = this.seguro.y;
      this.dentro = new Set(this.gatilhosEmQueEsta());
      return;
    }
    this.dentro = new Set(agora);
    if (!agora.some((i) => this.cena.gatilhos[i].bloqueio)) this.seguro = { x: this.px, y: this.py };
  }

  private atualizarDialogo(dt: number, cmd: Comandos): void {
    const d = this.dialogo!;
    const l = d.linha();
    const total = l ? l[1].length : 0;
    if (this.revelado < total) {
      const antes = Math.floor(this.revelado);
      this.revelado += dt * 60;
      if (Math.floor(this.revelado) !== antes && antes % 2 === 0 && l) {
        const voz = l[0] ? PERSONAGENS[l[0]]?.voz ?? 200 : 120;
        efeitos.fala(voz);
      }
      if (cmd.apertou('ok') || cmd.clique) this.revelado = total;
      return;
    }
    const esc = d.escolhas();
    if (esc.length) {
      if (cmd.apertou('cima')) { this.sel = (this.sel + esc.length - 1) % esc.length; efeitos.escolha(); }
      if (cmd.apertou('baixo')) { this.sel = (this.sel + 1) % esc.length; efeitos.escolha(); }
      this.sel = Math.min(this.sel, esc.length - 1);
      let k = -1;
      for (let i = 0; i < Math.min(4, esc.length); i++) if (cmd.apertou(String(i + 1) as '1')) k = i;
      if (k < 0 && cmd.clique) {
        const { x, y } = cmd.clique;
        k = this.rectsEscolha.findIndex((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
      }
      if (k < 0 && cmd.apertou('ok')) k = this.sel;
      if (k >= 0) this.escolher(k);
      return;
    }
    if (cmd.apertou('ok') || cmd.clique) this.avancar();
  }

  /** Avança a fala atual (também usado pelo robô). */
  avancar(): void {
    const d = this.dialogo;
    if (!d) return;
    const antes = d.linha();
    d.avancar();
    this.depoisDoPasso(d, antes);
  }

  escolher(k: number): void {
    const d = this.dialogo;
    if (!d) return;
    efeitos.escolha();
    const antes = d.linha();
    d.escolher(k);
    this.sel = 0;
    this.depoisDoPasso(d, antes);
  }

  private depoisDoPasso(d: Dialogo, antes: unknown): void {
    if (d.acabou) {
      if (this.dialogo === d) this.fecharDialogo();
      this.salvar();
      return;
    }
    if (d.linha() !== antes) this.revelado = 0;
  }

  private atualizarAlbum(cmd: Comandos): void {
    const n = ORDEM_ALBUM.length;
    const col = 8;
    if (cmd.apertou('album') || cmd.apertou('voltar')) {
      this.albumAberto = false;
      return;
    }
    if (cmd.apertou('dir')) this.albumSel = (this.albumSel + 1) % n;
    if (cmd.apertou('esq')) this.albumSel = (this.albumSel + n - 1) % n;
    if (cmd.apertou('baixo')) this.albumSel = Math.min(n - 1, this.albumSel + col);
    if (cmd.apertou('cima')) this.albumSel = Math.max(0, this.albumSel - col);
    if (cmd.clique) {
      const { x, y } = cmd.clique;
      const k = this.rectsMenu.findIndex((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
      if (k >= 0) this.albumSel = k;
      else if (y < 14 && x > 280) this.albumAberto = false;
    }
  }

  opcoesTitulo(): string[] {
    const o: string[] = [];
    if (this.temSalvo()) o.push('Continuar');
    o.push('Novo jogo');
    o.push('Álbum de Filósofos');
    return o;
  }

  private atualizarTitulo(cmd: Comandos): void {
    if (this.albumAberto) return this.atualizarAlbum(cmd);
    const o = this.opcoesTitulo();
    if (cmd.apertou('cima')) this.menuSel = (this.menuSel + o.length - 1) % o.length;
    if (cmd.apertou('baixo')) this.menuSel = (this.menuSel + 1) % o.length;
    this.menuSel = Math.min(this.menuSel, o.length - 1);
    let k = -1;
    if (cmd.apertou('ok')) k = this.menuSel;
    if (cmd.clique) {
      const { x, y } = cmd.clique;
      k = this.rectsMenu.findIndex((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
    }
    if (k < 0) return;
    efeitos.confirma();
    const op = o[k];
    if (op === 'Continuar') this.continuar();
    else if (op === 'Novo jogo') this.novoJogo();
    else {
      this.e.cartas = [...this.permanente.cartas];
      this.albumAberto = true;
    }
  }

  finalAtual() {
    return this.e.final ? FINAIS[this.e.final] : null;
  }
}
