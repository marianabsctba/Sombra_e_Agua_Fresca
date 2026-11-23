import type { Comandos } from '../motor/entrada';
import { efeitos } from '../motor/som';
import { desenharPessoa, desenharSilhueta } from '../motor/sprites';
import { ALT, LARG, Tela } from '../motor/tela';
import { PERSONAGENS } from '../historia/personagens';

export interface Minijogo {
  id: string;
  acabou: boolean;
  /** efeitos aplicados quando termina */
  fx: string[];
  atualizar(dt: number, cmd: Comandos): void;
  desenhar(t: Tela, tempo: number): void;
  /** o robô de teste usa isto para terminar o minijogo sem jogar */
  resolver(): void;
}

function escolhaApertada(cmd: Comandos, rects: { x: number; y: number; w: number; h: number }[]): number {
  for (let i = 0; i < 4; i++) if (cmd.apertou(String(i + 1) as '1')) return i;
  if (cmd.clique) {
    const { x, y } = cmd.clique;
    const k = rects.findIndex((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
    if (k >= 0) return k;
  }
  return -1;
}

// ---------------------------------------------------------------- Ato 1

interface Rodada {
  seq: string[];
  opcoes: string[];
  certa: number;
  fala: string;
}

export const RODADAS: Rodada[] = [
  { seq: ['coelho', 'passaro', 'coelho', 'passaro', 'coelho'], opcoes: ['cavalo', 'passaro', 'vaso'], certa: 1, fala: 'Rodada de aquecimento. Até a Dona Doxa acerta essa.' },
  { seq: ['cavalo', 'cavalo', 'vaso', 'cavalo', 'cavalo'], opcoes: ['vaso', 'cavalo', 'homem'], certa: 0, fala: 'Agora complica. Eu acertei essa com dois anos de idade.' },
  { seq: ['homem', 'arvore', 'coelho', 'homem', 'arvore'], opcoes: ['arvore', 'homem', 'coelho'], certa: 2, fala: 'Três sombras na sequência. Os fracos choram aqui.' },
  { seq: ['vaso', 'homem', 'homem', 'vaso', 'homem', 'homem'], opcoes: ['homem', 'vaso', 'passaro'], certa: 1, fala: 'FINAL. Ninguém nunca me venceu nesta. Ninguém.' },
];

export class Sombras implements Minijogo {
  id = 'sombras';
  acabou = false;
  fx = ['flag:campeao', 'conversa:campeonato_fim'];
  rodada = 0;
  fase: 'mostrando' | 'pergunta' | 'acertou' | 'errou' = 'mostrando';
  t = 0;
  sel = 0;
  erros = 0;

  private rects(): { x: number; y: number; w: number; h: number }[] {
    const n = RODADAS[this.rodada].opcoes.length;
    const w = 56;
    const x0 = (LARG - n * w - (n - 1) * 10) / 2;
    return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (w + 10), y: 118, w, h: 44 }));
  }

  atualizar(dt: number, cmd: Comandos): void {
    this.t += dt;
    const r = RODADAS[this.rodada];
    if (this.fase === 'mostrando') {
      if (this.t > r.seq.length * 0.55 + 0.4 || cmd.apertou('ok')) {
        this.fase = 'pergunta';
        this.t = 0;
      }
      return;
    }
    if (this.fase === 'pergunta') {
      if (cmd.apertou('esq')) { this.sel = (this.sel + r.opcoes.length - 1) % r.opcoes.length; efeitos.escolha(); }
      if (cmd.apertou('dir')) { this.sel = (this.sel + 1) % r.opcoes.length; efeitos.escolha(); }
      let k = escolhaApertada(cmd, this.rects());
      if (k < 0 && cmd.apertou('ok') && this.t > 0.2) k = this.sel;
      if (k >= 0) this.responder(k);
      return;
    }
    if (this.t > 1.4 || (this.t > 0.4 && cmd.apertou('ok'))) {
      if (this.fase === 'acertou') {
        this.rodada++;
        if (this.rodada >= RODADAS.length) {
          this.acabou = true;
          return;
        }
      }
      this.fase = 'mostrando';
      this.t = 0;
      this.sel = 0;
    }
  }

  responder(k: number): void {
    const r = RODADAS[this.rodada];
    this.sel = k;
    this.t = 0;
    if (k === r.certa) {
      this.fase = 'acertou';
      efeitos.confirma();
    } else {
      this.fase = 'errou';
      this.erros++;
      efeitos.erro();
    }
  }

  resolver(): void {
    this.rodada = RODADAS.length;
    this.acabou = true;
  }

  desenhar(tl: Tela, tempo: number): void {
    const b = tl.b;
    const r = RODADAS[Math.min(this.rodada, RODADAS.length - 1)];
    tl.comecar('#1b0f18');
    // parede iluminada
    const tremor = Math.sin(tempo * 9) * 6 + Math.sin(tempo * 23) * 3;
    const grad = b.createRadialGradient(160, 140 + tremor, 20, 160, 80, 220);
    grad.addColorStop(0, '#e8a76e');
    grad.addColorStop(1, '#5a2e2a');
    b.fillStyle = grad;
    b.fillRect(8, 14, LARG - 16, 92);
    // sombras passando
    const n = r.seq.length;
    const passo = 40;
    const x0 = (LARG - (n + 1) * passo) / 2 + 8;
    const visiveis = this.fase === 'mostrando' ? Math.min(n, Math.floor(this.t / 0.55) + 1) : n;
    for (let i = 0; i < visiveis; i++) {
      const bal = Math.sin(tempo * 3 + i) * 1.5;
      desenharSilhueta(b, r.seq[i], x0 + i * passo, 44 + bal, '#2a1424cc', 2);
    }
    // a interrogação
    if (this.fase !== 'mostrando') {
      b.fillStyle = '#2a142466';
      b.fillRect(x0 + n * passo, 44, 24, 24);
      if (this.fase === 'acertou') desenharSilhueta(b, r.opcoes[r.certa], x0 + n * passo, 44, '#2a1424', 2);
    }
    // cabeças da plateia
    for (let i = 0; i < 12; i++) {
      b.fillStyle = '#120a10';
      b.fillRect(10 + i * 26, 104, 14, 12);
      b.fillRect(8 + i * 26, 112, 18, 10);
    }
    // opções
    const rs = this.rects();
    if (this.fase !== 'mostrando') {
      rs.forEach((q, i) => {
        const marcado = i === this.sel;
        b.fillStyle = marcado ? '#ff9a52' : '#3a2230';
        b.fillRect(q.x, q.y, q.w, q.h);
        b.fillStyle = '#1b0f18';
        b.fillRect(q.x + 2, q.y + 2, q.w - 4, q.h - 4);
        desenharSilhueta(b, r.opcoes[i], q.x + 16, q.y + 10, marcado ? '#ffd9a8' : '#c98a5e', 2);
      });
    }
    desenharPessoa(b, 286, 150, PERSONAGENS.trasimaco.ap, tempo);
    tl.ampliar();

    tl.texto('CAMPEONATO DE PREVISÃO DE SOMBRAS', LARG / 2, 2, { alinhar: 'center', tam: 8, cor: '#ffd36b', peso: 700 });
    tl.texto(`Rodada ${Math.min(this.rodada + 1, RODADAS.length)} de ${RODADAS.length}`, 12, 16, { tam: 6, cor: '#ffe8c2' });
    if (this.fase !== 'mostrando') {
      rs.forEach((q, i) => tl.texto(String(i + 1), q.x + 3, q.y + 2, { tam: 6, cor: '#ffe8c2' }));
    }
    let fala = r.fala;
    if (this.fase === 'mostrando') fala = 'Preste atenção na sequência...';
    if (this.fase === 'pergunta') fala = 'Qual é a próxima sombra? (1, 2, 3, setas ou clique)';
    if (this.fase === 'acertou') fala = this.rodada === RODADAS.length - 1 ? 'NÃÃÃÃO! Como?!' : 'Hunf. Sorte de principiante.';
    if (this.fase === 'errou') fala = 'HAHAHAHA! Errou! De novo, que eu quero rir mais.';
    tl.texto('Trasímaco:', 12, 164, { tam: 6, cor: PERSONAGENS.trasimaco.cor });
    tl.texto(fala, 12, 172, { tam: 6, cor: '#ffe8c2' });
    void ALT;
  }
}

// ---------------------------------------------------------------- Ato 2

const BONECOS = ['coelho', 'cavalo', 'passaro', 'homem'];
const NOMES: Record<string, string> = { coelho: 'COELHO', cavalo: 'CAVALO', passaro: 'PASSARINHO', homem: 'HOMEM' };

export const PAUTA: string[] = ['coelho', 'cavalo', 'homem', 'JUSTIÇA', 'passaro', 'coelho', 'A VERDADE', 'cavalo', 'AMOR', 'homem'];

export class Titereiro implements Minijogo {
  id = 'titereiro';
  acabou = false;
  fx: string[] = [];
  i = 0;
  t = 0;
  limite = 3.4;
  pontos = 0;
  levantado = -1;
  feedback = '';
  fbT = 0;
  comecou = false;

  private rects(): { x: number; y: number; w: number; h: number }[] {
    return BONECOS.map((_, k) => ({ x: 40 + k * 64, y: 96, w: 48, h: 40 }));
  }

  atualizar(dt: number, cmd: Comandos): void {
    if (!this.comecou) {
      if (cmd.apertou('ok') || cmd.clique) this.comecou = true;
      return;
    }
    this.t += dt;
    this.fbT -= dt;
    if (this.fbT > 0) return;
    const k = escolhaApertada(cmd, this.rects());
    if (k >= 0) {
      this.levantado = k;
      const pedido = PAUTA[this.i];
      const abstrato = !BONECOS.includes(pedido);
      if (abstrato || BONECOS[k] === pedido) {
        this.pontos++;
        this.feedback = abstrato ? 'A plateia aplaude. Ninguém percebeu nada.' : 'Perfeito! A plateia suspira.';
        efeitos.confirma();
      } else {
        this.feedback = `Era ${NOMES[pedido]}! Mas a plateia achou ótimo mesmo assim.`;
        efeitos.erro();
      }
      this.proximo();
    } else if (this.t > this.limite) {
      this.levantado = -1;
      this.feedback = 'Tela vazia! A plateia ficou olhando para a parede. Como sempre, aliás.';
      efeitos.erro();
      this.proximo();
    }
  }

  private proximo(): void {
    this.i++;
    this.t = 0;
    this.fbT = 0.9;
    this.limite = Math.max(2.2, this.limite - 0.12);
    if (this.i >= PAUTA.length) this.terminar();
  }

  private terminar(): void {
    this.acabou = true;
    this.fx = ['flag:turno', `flag:audiencia=${this.pontos}`, 'conversa:titereiro_fim'];
  }

  resolver(): void {
    this.pontos = PAUTA.length;
    this.terminar();
  }

  desenhar(tl: Tela, tempo: number): void {
    const b = tl.b;
    tl.comecar('#2a1008');
    // fogueira atrás
    const g = b.createRadialGradient(160, 190, 10, 160, 170, 200);
    g.addColorStop(0, '#ffb347');
    g.addColorStop(0.4, '#a0401a');
    g.addColorStop(1, '#2a1008');
    b.fillStyle = g;
    b.fillRect(0, 0, LARG, ALT);
    // o muro
    b.fillStyle = '#6b3622';
    b.fillRect(0, 84, LARG, 22);
    b.fillStyle = '#8a4a2e';
    b.fillRect(0, 84, LARG, 3);
    // a parede lá longe, com a sombra
    b.fillStyle = '#c98a5e';
    b.fillRect(60, 16, 200, 56);
    const pedido = PAUTA[Math.min(this.i, PAUTA.length - 1)];
    if (this.fbT > 0 && this.levantado >= 0) desenharSilhueta(b, BONECOS[this.levantado], 136, 22, '#3a1a24', 4);
    // bonecos em varetas
    this.rects().forEach((q, k) => {
      const sobe = k === this.levantado && this.fbT > 0 ? -14 : 0;
      b.fillStyle = '#5a3a24';
      b.fillRect(q.x + 23, q.y + 30 + sobe, 3, 12 - sobe);
      b.fillStyle = '#3a2418';
      b.fillRect(q.x, q.y + sobe + 2, q.w, 30);
      desenharSilhueta(b, BONECOS[k], q.x + 12, q.y + 5 + sobe, '#d8a070', 2);
    });
    desenharPessoa(b, 8, 140, PERSONAGENS.gorgias.ap, tempo);
    tl.ampliar();

    tl.texto('TURNO DE TESTE: SINDICATO DOS TITEREIROS', LARG / 2, 2, { alinhar: 'center', tam: 7, cor: '#ffd36b', peso: 700 });
    if (!this.comecou) {
      tl.moldura(40, 60, 240, 54, '#1b1020', '#ff9a52');
      tl.texto('Górgias grita o que a plateia quer.', 160, 66, { alinhar: 'center', tam: 7, cor: '#ffe8c2' });
      tl.texto('Levante o boneco certo com 1, 2, 3 ou 4', 160, 78, { alinhar: 'center', tam: 7, cor: '#ffe8c2' });
      tl.texto('(ou clique nele) antes do tempo acabar.', 160, 88, { alinhar: 'center', tam: 7, cor: '#ffe8c2' });
      tl.texto('Enter para começar', 160, 101, { alinhar: 'center', tam: 6, cor: '#ffd36b' });
      return;
    }
    this.rects().forEach((q, k) => tl.texto(String(k + 1), q.x + q.w / 2, q.y + 32, { alinhar: 'center', tam: 7, cor: '#ffe8c2' }));
    const nome = BONECOS.includes(pedido) ? NOMES[pedido] : pedido;
    if (this.i < PAUTA.length && this.fbT <= 0) {
      tl.texto('Górgias:', 40, 140, { tam: 6, cor: PERSONAGENS.gorgias.cor });
      tl.texto(`A PLATEIA QUER ${nome}!`, 40, 148, { tam: 8, cor: '#ffffff', peso: 700 });
      if (!BONECOS.includes(pedido)) tl.texto('(não tem boneco disso... bota qualquer um!)', 40, 160, { tam: 6, cor: '#ffd36b' });
      const frac = Math.max(0, 1 - this.t / this.limite);
      tl.ret(220, 150, 80, 4, '#00000088');
      tl.ret(220, 150, 80 * frac, 4, frac > 0.3 ? '#8fd17a' : '#ff5a5a');
    } else if (this.feedback) {
      tl.texto(this.feedback, 40, 150, { tam: 6, cor: '#ffe8c2' });
    }
    tl.texto(`Audiência: ${this.pontos}/${PAUTA.length}   Pedido ${Math.min(this.i + 1, PAUTA.length)} de ${PAUTA.length}`, 160, 172, { alinhar: 'center', tam: 6, cor: '#ffd36b' });
  }
}

export function criarMinijogo(id: string): Minijogo {
  if (id === 'sombras') return new Sombras();
  if (id === 'titereiro') return new Titereiro();
  throw new Error(`minijogo desconhecido: ${id}`);
}

export const MINIJOGOS = ['sombras', 'titereiro'];
