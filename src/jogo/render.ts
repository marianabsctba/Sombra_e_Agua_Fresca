import { ALBUM, ORDEM_ALBUM } from '../historia/album';
import { FINAIS, ORDEM_FINAIS } from '../historia/finais';
import { FORMAS } from '../historia/index';
import { PERSONAGENS } from '../historia/personagens';
import { desenharLadrilho, PALETAS, T } from '../motor/mapa';
import { estaMudo } from '../motor/som';
import { desenharPessoa, desenharSilhueta, type Aparencia, type Olhar } from '../motor/sprites';
import { ALT, LARG, Tela } from '../motor/tela';
import type { Jogo } from './jogo';
import type { Npc } from './tipos';

const SOMBRAS_PAREDE = ['coelho', 'cavalo', 'passaro', 'homem', 'vaso', 'arvore'];
const SOMBRAS_SECRETA = ['arvore', 'cavalo', 'homem', 'sol', 'cadeira', 'triangulo'];

const retrato = typeof document !== 'undefined' ? document.createElement('canvas') : null;
if (retrato) {
  retrato.width = 18;
  retrato.height = 18;
}

function desenharRetrato(tl: Tela, ap: Aparencia, x: number, y: number, tam: number, t: number): void {
  if (!retrato) return;
  const c = retrato.getContext('2d')!;
  c.clearRect(0, 0, 18, 18);
  desenharPessoa(c, 1, 1, { ...ap, sentado: false, acorrentado: ap.acorrentado }, t, 'baixo');
  const e = tl.escala;
  tl.ctx.imageSmoothingEnabled = false;
  tl.ctx.drawImage(retrato, Math.round(x * e), Math.round(y * e), Math.round(tam * e), Math.round(tam * e));
}

function apJogador(j: Jogo): Aparencia {
  const ap = { ...PERSONAGENS.glauco.ap };
  if (j.cena.id === 'fundo' && !j.e.flags.solto) ap.acorrentado = true;
  if (j.e.flags.lente && j.cena.id === 'fora') ap.acessorio = 'oculos';
  return ap;
}

// ------------------------------------------------------------------ mundo

export function desenhar(j: Jogo, tl: Tela): void {
  if (j.modo === 'titulo') {
    desenharTitulo(j, tl);
    if (j.albumAberto) desenharAlbum(j, tl);
    return;
  }
  if (j.modo === 'final') return desenharFinal(j, tl);
  if (j.mini) {
    j.mini.desenhar(tl, j.tempo);
    desenharAvisos(j, tl);
    return;
  }
  desenharMundo(j, tl);
  desenharInterface(j, tl);
  if (j.albumAberto) desenharAlbum(j, tl);
}

function camera(j: Jogo): { cx: number; cy: number } {
  const mw = j.cena.mapa[0].length * T;
  const mh = j.cena.mapa.length * T;
  const cx = mw <= LARG ? (mw - LARG) / 2 : Math.max(0, Math.min(mw - LARG, j.px - LARG / 2));
  const cy = mh <= ALT ? (mh - ALT) / 2 : Math.max(0, Math.min(mh - ALT, j.py - 8 - ALT / 2));
  return { cx: Math.round(cx), cy: Math.round(cy) };
}

function desenharMundo(j: Jogo, tl: Tela): void {
  const pal = PALETAS[j.cena.paleta];
  tl.comecar(pal.fundo);
  const b = tl.b;
  const { cx, cy } = camera(j);
  const mapa = j.cena.mapa;
  const x0 = Math.floor(cx / T), y0 = Math.floor(cy / T);
  const rachado = !!j.e.flags.reflexo;
  for (let ty = y0; ty <= y0 + Math.ceil(ALT / T) + 1; ty++) {
    for (let tx = x0; tx <= x0 + Math.ceil(LARG / T) + 1; tx++) {
      let ch = j.ladrilho(tx, ty);
      if (ch === 'P' && j.aberto(tx, ty)) ch = 'p';
      desenharLadrilho(b, ch, tx, ty, tx * T - cx, ty * T - cy, pal, j.tempo, (dx, dy) => j.ladrilho(tx + dx, ty + dy), rachado);
    }
  }

  // sombras na parede
  if (j.cena.efeito === 'sombras') desenharSombrasParede(j, tl, cx, cy);

  // luz da fogueira
  if (j.cena.paleta === 'fogo' || j.cena.paleta === 'caverna') {
    b.save();
    b.globalCompositeOperation = 'lighter';
    for (let ty = 0; ty < mapa.length; ty++) {
      for (let tx = 0; tx < mapa[ty].length; tx++) {
        if (mapa[ty][tx] !== 'F') continue;
        const x = tx * T + 8 - cx, y = ty * T + 8 - cy;
        const r = 70 + Math.sin(j.tempo * 7 + tx) * 4;
        const g = b.createRadialGradient(x, y, 4, x, y, r);
        g.addColorStop(0, 'rgba(255,150,60,0.35)');
        g.addColorStop(1, 'rgba(255,120,40,0)');
        b.fillStyle = g;
        b.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }
    if (j.cena.id === 'fundo') {
      // o fogo atrás do muro ilumina a parede por baixo
      const g = b.createLinearGradient(0, 200 - cy, 0, 20 - cy);
      g.addColorStop(0, 'rgba(255,140,60,0.22)');
      g.addColorStop(1, 'rgba(255,140,60,0)');
      b.fillStyle = g;
      b.fillRect(0, 0, LARG, ALT);
    }
    b.restore();
  }

  // gente e objetos, ordenados pela altura
  type Coisa = { y: number; f: () => void };
  const coisas: Coisa[] = [];
  for (const n of j.npcsVisiveis()) {
    const p = j.posNpc(n);
    coisas.push({ y: p.y, f: () => desenharNpc(j, tl, n, p.x - cx, p.y - cy) });
  }
  coisas.push({
    y: j.py,
    f: () => {
      const sentado = j.cena.id === 'fundo' && !j.e.flags.solto && !j.andando;
      desenharPessoa(b, Math.round(j.px - 8 - cx), Math.round(j.py - 15 - cy), { ...apJogador(j), sentado }, j.tempo, j.olhar, j.andando);
    },
  });
  coisas.sort((a, c) => a.y - c.y).forEach((c) => c.f());

  // efeitos de luz
  if (j.cena.efeito === 'claridade') {
    if (j.e.flags.noite) {
      b.fillStyle = 'rgba(10,14,48,0.72)';
      b.fillRect(0, 0, LARG, ALT);
      for (let i = 0; i < 70; i++) {
        const sx = (i * 97) % LARG, sy = (i * 53) % 110;
        const pisca = Math.sin(j.tempo * 2 + i) > 0.6 ? '#ffffff' : '#c8d8ff';
        b.fillStyle = pisca;
        b.fillRect(sx, sy, 1, 1);
      }
      b.fillStyle = '#fff6a8';
      for (const [sx, sy] of [[120, 30], [160, 18], [140, 52]]) b.fillRect(sx - 1, sy - 1, 3, 3);
      b.strokeStyle = '#fff6a855';
      b.beginPath();
      b.moveTo(120, 30); b.lineTo(160, 18); b.lineTo(140, 52); b.closePath();
      b.stroke();
    } else {
      const tab = [0.93, 0.78, 0.58, 0.38, 0.2, 0.04];
      let a = tab[Math.min(5, j.e.visao)];
      if (j.e.flags.lente) a *= 0.55;
      const pulsa = a * (0.96 + Math.sin(j.tempo * 1.5) * 0.04);
      b.fillStyle = `rgba(255,253,240,${pulsa.toFixed(3)})`;
      b.fillRect(0, 0, LARG, ALT);
    }
  }
  if (j.cena.efeito === 'escuro') {
    const r = 26 + Math.min(j.tempoCena * 3.5, 110);
    const x = j.px - cx, y = j.py - 8 - cy;
    const g = b.createRadialGradient(x, y, r * 0.35, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(3,1,5,0.97)');
    b.fillStyle = g;
    b.fillRect(0, 0, LARG, ALT);
  }

  tl.ampliar();

  // balões e nomes (na camada da interface)
  if (!j.dialogo) {
    const perto = j.npcProximo();
    for (const n of j.npcsVisiveis()) {
      const p = j.posNpc(n);
      const sx = p.x - cx, sy = p.y - cy;
      const d = Math.hypot(p.x - j.px, p.y - j.py);
      if (n === perto) {
        const nome = n.obj ? 'examinar' : PERSONAGENS[n.quem ?? n.id]?.nome ?? '';
        const w = tl.largura(nome, 6) + 8;
        const yy = sy - (n.obj ? 18 : 26);
        tl.moldura(sx - w / 2, yy, w, 10, '#1b1020', '#ff9a52', 0.85);
        tl.texto(nome, sx, yy + 2, { alinhar: 'center', tam: 6, cor: '#ffe8c2' });
      } else if (n.balao && d < 64 && j.cena.efeito !== 'escuro') {
        const w = tl.largura(n.balao, 6) + 8;
        const yy = sy - 28 + Math.sin(j.tempo * 3) * 1;
        tl.moldura(sx - w / 2, yy, w, 10, '#fff6e8', '#1b1020', 0.95);
        tl.texto(n.balao, sx, yy + 2, { alinhar: 'center', tam: 6, cor: '#1b1020', sombra: false });
      }
    }
  }
}

function desenharSombrasParede(j: Jogo, tl: Tela, cx: number, cy: number): void {
  const b = tl.b;
  const mapa = j.cena.mapa;
  let xa = Infinity, xb = -1, ya = Infinity, yb = -1;
  mapa.forEach((l, y) => [...l].forEach((ch, x) => {
    if (ch === 'W') {
      xa = Math.min(xa, x); xb = Math.max(xb, x); ya = Math.min(ya, y); yb = Math.max(yb, y);
    }
  }));
  if (xb < 0) return;
  const px0 = xa * T - cx, px1 = (xb + 1) * T - cx, py0 = ya * T - cy, py1 = (yb + 1) * T - cy;
  b.save();
  b.beginPath();
  b.rect(px0, py0, px1 - px0, py1 - py0);
  b.clip();
  const lista = j.cena.id === 'secreta' ? SOMBRAS_SECRETA : SOMBRAS_PAREDE;
  const largura = px1 - px0 + 60;
  // na volta e depois de solto, as sombras continuam passando para os outros
  lista.forEach((nome, i) => {
    const x = px0 - 30 + ((j.tempo * 16 + i * (largura / lista.length)) % largura);
    const y = py0 + 4 + Math.sin(j.tempo * 2 + i) * 1.5;
    desenharSilhueta(b, nome, x, y, 'rgba(40,16,30,0.72)', 2);
  });
  b.restore();
}

function olharPara(j: Jogo, x: number, y: number): Olhar {
  const dx = j.px - x, dy = j.py - y;
  if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? 'esq' : 'dir';
  return dy < 0 ? 'cima' : 'baixo';
}

function desenharNpc(j: Jogo, tl: Tela, n: Npc, x: number, y: number): void {
  const b = tl.b;
  const t = j.tempo;
  if (n.obj) {
    desenharObjeto(j, tl, n, x, y);
    return;
  }
  const pers = PERSONAGENS[n.quem ?? n.id];
  if (!pers) return;
  const perto = j.falandoCom === n.id;
  const pos = j.posNpc(n);
  const dist = Math.hypot(j.px - pos.x, j.py - pos.y);
  let olhar: Olhar = n.olhar ?? 'baixo';
  if (perto || dist < 30) olhar = olharPara(j, pos.x, pos.y);
  if (n.olhar === 'cima' && !perto && dist >= 30) olhar = 'cima';
  const andando = !!n.vaivem && !j.dialogo;
  desenharPessoa(b, Math.round(x - 8), Math.round(y - 15), pers.ap, t + n.x * 0.37, olhar, andando);
}

function desenharObjeto(j: Jogo, tl: Tela, n: Npc, x: number, y: number): void {
  const b = tl.b;
  const t = j.tempo;
  const brilha = (cor = '#fff6c8') => {
    for (let i = 0; i < 4; i++) {
      const a = t * 2 + i * 1.57;
      b.fillStyle = cor;
      b.fillRect(Math.round(x + Math.cos(a) * 9), Math.round(y - 8 + Math.sin(a) * 6), 1, 1);
    }
  };
  switch (n.obj) {
    case 'nada':
      return;
    case 'brilho': {
      const f = Math.floor(t * 4) % 4;
      b.fillStyle = '#ffffff';
      b.fillRect(x - 1 + (f % 2) * 3, y - 6 - (f > 1 ? 2 : 0), 1, 1);
      b.fillRect(x + 3 - f, y - 3, 1, 1);
      b.fillStyle = '#cfeaff';
      b.fillRect(x - 3 + f, y - 8, 2, 1);
      return;
    }
    case 'sombra':
      b.fillStyle = 'rgba(20,30,20,0.35)';
      b.fillRect(x - 12, y - 6, 24, 8);
      b.fillRect(x - 8, y - 9, 16, 3);
      b.fillRect(x - 2, y + 1, 4, 4);
      return;
    case 'rachadura':
      b.fillStyle = '#1b1020';
      for (let i = 0; i < 10; i++) b.fillRect(x - 10 + i * 2, y - 10 + ((i * 7) % 5) - 2, 2, 1);
      b.fillStyle = '#ffffff';
      b.fillRect(x - 6, y - 12, 1, 1);
      return;
    case 'sol': {
      const r = 7 + Math.sin(t * 2) * 1;
      b.fillStyle = '#fff2a8';
      b.beginPath();
      b.arc(x, y - 10, r + 3, 0, Math.PI * 2);
      b.fill();
      b.fillStyle = '#ffcc33';
      b.beginPath();
      b.arc(x, y - 10, r, 0, Math.PI * 2);
      b.fill();
      for (let i = 0; i < 8; i++) {
        const a = i * (Math.PI / 4) + t * 0.5;
        b.fillRect(Math.round(x + Math.cos(a) * (r + 6)), Math.round(y - 10 + Math.sin(a) * (r + 6)), 2, 2);
      }
      return;
    }
    default: {
      const bal = n.obj === 'cavalo' ? Math.abs(Math.sin(t * 6)) * (j.dialogo ? 0 : 1) : 0;
      desenharSilhueta(b, n.obj!, x - 6, y - 12 - bal, n.objCor ?? '#ffffff', 1);
      const forma = Object.entries(FORMAS).find(([, f]) => f.silhueta === n.obj)?.[0];
      if (forma && !j.e.formas.includes(forma)) brilha();
    }
  }
}

// ------------------------------------------------------------------ interface

function desenharInterface(j: Jogo, tl: Tela): void {
  // topo
  const alb = `Álbum ${j.e.cartas.length}/${ORDEM_ALBUM.length} (Tab)`;
  tl.texto(alb, LARG - 4, 3, { alinhar: 'right', tam: 6, cor: '#ffe8c2' });
  if (j.cena.id === 'fora' || j.e.formas.length) {
    tl.texto(`Formas ${j.e.formas.length}/7`, LARG - 4, 11, { alinhar: 'right', tam: 6, cor: '#ffe08a' });
  }
  if (j.cena.id === 'volta') {
    tl.texto(`Convencidos ${j.e.convencidos.length}  Irritação ${'●'.repeat(Math.min(6, j.e.irritacao))}${'○'.repeat(Math.max(0, 6 - j.e.irritacao))}`, 4, 3, { tam: 6, cor: '#ffd0a0' });
  }
  if (estaMudo()) tl.texto('som desligado (M)', 4, ALT - 9, { tam: 5, cor: '#ffffff88' });

  // cartão de cena
  if (j.tituloCena > 0) {
    const a = Math.min(1, j.tituloCena / 0.6, (3.2 - j.tituloCena) / 0.4);
    tl.ret(0, 62, LARG, 40, '#000000', 0.55 * a);
    tl.ctx.globalAlpha = a;
    tl.texto(j.cena.titulo, LARG / 2, 68, { alinhar: 'center', tam: 14, cor: '#ffd36b', peso: 700 });
    tl.texto(j.cena.subtitulo, LARG / 2, 87, { alinhar: 'center', tam: 7, cor: '#ffe8c2' });
    tl.ctx.globalAlpha = 1;
  }

  desenharAvisos(j, tl);
  if (j.dialogo) desenharDialogo(j, tl);
}

function desenharAvisos(j: Jogo, tl: Tela): void {
  j.avisos.slice(0, 3).forEach((a, i) => {
    const w = tl.largura(a.txt, 6) + 12;
    const y = 18 + i * 13;
    tl.ctx.globalAlpha = Math.min(1, a.t);
    tl.moldura((LARG - w) / 2, y, w, 11, '#1b1020', a.cor, 0.92);
    tl.texto(a.txt, LARG / 2, y + 2, { alinhar: 'center', tam: 6, cor: a.cor });
    tl.ctx.globalAlpha = 1;
  });
}

function desenharDialogo(j: Jogo, tl: Tela): void {
  const d = j.dialogo!;
  const l = d.linha();
  const esc = d.escolhas();
  const bx = 4, by = 116, bw = LARG - 8, bh = 60;
  tl.moldura(bx, by, bw, bh, '#1b1020', '#ff9a52');
  if (l) {
    const [quem, texto] = l;
    const pers = quem ? PERSONAGENS[quem] : null;
    let tx = bx + 8;
    let larg = bw - 16;
    if (pers) {
      tl.moldura(bx + 5, by + 5, 42, 42, '#2a1830', pers.cor, 1);
      desenharRetrato(tl, pers.ap, bx + 6, by + 6, 40, j.tempo);
      tx = bx + 54;
      larg = bw - 62;
      tl.texto(pers.nome, tx, by + 5, { tam: 7, cor: pers.cor, peso: 700 });
    }
    const vis = texto.slice(0, Math.floor(j.revelado));
    const linhas = tl.quebrar(texto, larg, 7);
    // revela por caracteres sem reembaralhar as quebras
    let resta = vis.length;
    const y0 = by + (pers ? 16 : 7);
    linhas.slice(0, 5).forEach((ln, i) => {
      const parte = ln.slice(0, Math.max(0, resta));
      resta -= ln.length + 1;
      tl.texto(parte, tx, y0 + i * 9, { tam: 7, cor: quem ? '#fff6e8' : '#d8c8e8' });
    });
    const pronto = j.revelado >= texto.length;
    if (pronto && !esc.length && Math.floor(j.tempo * 3) % 2) tl.texto('▼', bx + bw - 10, by + bh - 10, { tam: 6, cor: '#ff9a52' });
  }
  j.rectsEscolha = [];
  if (esc.length && (!l || j.revelado >= l[1].length)) {
    const larguras = esc.map((e, i) => tl.largura(`${i + 1}. ${e.t}`, 7));
    const w = Math.min(LARG - 16, Math.max(...larguras) + 18);
    const h = esc.length * 12 + 6;
    const x = LARG - 8 - w;
    const y = by - h - 2;
    tl.moldura(x, y, w, h, '#2a1830', '#ffd36b');
    esc.forEach((e, i) => {
      const yy = y + 4 + i * 12;
      const marcado = i === j.sel;
      if (marcado) tl.ret(x + 2, yy - 1, w - 4, 11, '#ff9a52', 0.3);
      tl.texto(`${marcado ? '▸' : ' '} ${i + 1}. ${e.t}`, x + 4, yy, { tam: 7, cor: marcado ? '#ffffff' : '#ffe8c2' });
      j.rectsEscolha.push({ x, y: yy - 1, w, h: 12 });
    });
  }
}

// ------------------------------------------------------------------ álbum

function desenharAlbum(j: Jogo, tl: Tela): void {
  tl.ret(0, 0, LARG, ALT, '#120a14', 0.97);
  tl.texto('ÁLBUM DE FILÓSOFOS', 6, 3, { tam: 8, cor: '#ffd36b', peso: 700 });
  tl.texto(`${j.e.cartas.length}/${ORDEM_ALBUM.length}   setas: navegar · Tab/Esc: fechar`, LARG - 6, 4, { alinhar: 'right', tam: 6, cor: '#ffe8c2' });
  const col = 8;
  const cw = 38, ch = 18;
  const x0 = (LARG - col * cw) / 2;
  j.rectsMenu = [];
  ORDEM_ALBUM.forEach((id, i) => {
    const x = x0 + (i % col) * cw;
    const y = 15 + Math.floor(i / col) * ch;
    const tem = j.e.cartas.includes(id);
    const sel = i === j.albumSel;
    tl.moldura(x + 1, y + 1, cw - 2, ch - 2, sel ? '#3a2238' : '#1e1422', sel ? '#ffd36b' : tem ? '#6a4a5a' : '#3a2a3a', 1);
    if (tem) desenharRetrato(tl, PERSONAGENS[id].ap, x + 3, y + 1, 16, 0);
    else tl.texto('?', x + 8, y + 4, { tam: 8, cor: '#5a4a5a' });
    j.rectsMenu.push({ x, y, w: cw, h: ch });
  });
  const id = ORDEM_ALBUM[j.albumSel];
  const tem = j.e.cartas.includes(id);
  const yd = 15 + Math.ceil(ORDEM_ALBUM.length / col) * ch + 2;
  tl.moldura(4, yd, LARG - 8, ALT - yd - 3, '#1b1020', '#ff9a52', 1);
  if (!tem) {
    tl.texto('???', 10, yd + 4, { tam: 8, cor: '#8a7a8a', peso: 700 });
    tl.texto('Converse com mais gente para descobrir quem é.', 10, yd + 16, { tam: 6, cor: '#c8b8c8' });
    return;
  }
  const p = PERSONAGENS[id];
  const c = ALBUM[id];
  tl.texto(p.nome, 10, yd + 3, { tam: 8, cor: p.cor, peso: 700 });
  tl.texto(c.vida, LARG - 10, yd + 4, { alinhar: 'right', tam: 6, cor: '#c8b8c8' });
  let y = yd + 14;
  for (const ln of tl.quebrar(c.ideia, LARG - 20, 6)) {
    tl.texto(ln, 10, y, { tam: 6, cor: '#fff6e8' });
    y += 7;
  }
  y += 1;
  for (const ln of tl.quebrar(`Curiosidade: ${c.piada}`, LARG - 20, 6)) {
    tl.texto(ln, 10, y, { tam: 6, cor: '#ffd36b' });
    y += 7;
  }
}

// ------------------------------------------------------------------ título e final

function desenharTitulo(j: Jogo, tl: Tela): void {
  tl.comecar('#0d0710');
  const b = tl.b;
  const t = j.tempo;
  const g = b.createRadialGradient(160, 200, 20, 160, 120, 260);
  g.addColorStop(0, '#ff9a3a');
  g.addColorStop(0.35, '#7a2e22');
  g.addColorStop(1, '#0d0710');
  b.fillStyle = g;
  b.fillRect(0, 0, LARG, ALT);
  // parede com sombras
  b.fillStyle = '#c98a5e44';
  b.fillRect(0, 0, LARG, 70);
  SOMBRAS_PAREDE.forEach((nome, i) => {
    const x = -40 + ((t * 14 + i * 64) % 400);
    desenharSilhueta(b, nome, x, 8 + Math.sin(t * 2 + i) * 2, 'rgba(40,16,30,0.55)', 3);
  });
  // plateia acorrentada
  for (let i = 0; i < 9; i++) {
    const ap = { ...PERSONAGENS.glauco.ap, cor: '#3a2026', pele: '#2a1618', cabelo: '#1a0c10', acorrentado: true, sentado: true };
    // o quinto da fila é o Glauco, o único que virou o pescoço
    if (i === 4) desenharPessoa(b, 12 + i * 36, 150, { ...PERSONAGENS.glauco.ap, acorrentado: true, sentado: true }, t, 'baixo');
    else desenharPessoa(b, 12 + i * 36, 150, ap, t + i, 'cima');
  }
  tl.ampliar();
  tl.texto('Sombra e', LARG / 2, 74, { alinhar: 'center', tam: 13, cor: '#ffe8c2', peso: 700, sombra: '#2a1020' });
  tl.texto('Água Fresca', LARG / 2, 88, { alinhar: 'center', tam: 20, cor: '#ffd36b', peso: 700, sombra: '#2a1020' });
  tl.texto('um jogo sobre sair da caverna (e a vontade de voltar)', LARG / 2, 111, { alinhar: 'center', tam: 6, cor: '#ffe8c2' });
  const ops = j.opcoesTitulo();
  j.rectsMenu = [];
  ops.forEach((o, i) => {
    const y = 122 + i * 11;
    const sel = i === j.menuSel;
    const w = 110;
    tl.moldura(LARG / 2 - w / 2, y, w, 10, sel ? '#ff9a52' : '#1b1020', sel ? '#ffe8c2' : '#ff9a52', 0.9);
    tl.texto(o, LARG / 2, y + 2, { alinhar: 'center', tam: 7, cor: sel ? '#1b1020' : '#ffe8c2', sombra: false, peso: 600 });
    j.rectsMenu.push({ x: LARG / 2 - w / 2, y, w, h: 10 });
  });
  const vistos = ORDEM_FINAIS.filter((f) => j.permanente.finais.includes(f)).length;
  tl.texto(`Finais vistos: ${vistos}/${ORDEM_FINAIS.length}`, 4, ALT - 8, { tam: 5, cor: '#ffe8c2aa' });
  tl.texto('setas/WASD · Enter · Tab · M', LARG - 4, ALT - 8, { alinhar: 'right', tam: 5, cor: '#ffe8c2aa' });
}

function desenharFinal(j: Jogo, tl: Tela): void {
  const f = FINAIS[j.e.final ?? 'sombra'];
  tl.comecar(f.fundo);
  const b = tl.b;
  const g = b.createRadialGradient(160, 30, 5, 160, 30, 140);
  g.addColorStop(0, f.cor + '55');
  g.addColorStop(1, f.fundo);
  b.fillStyle = g;
  b.fillRect(0, 0, LARG, ALT);
  desenharSilhueta(b, f.silhueta, 160 - 18, 6 + Math.sin(j.tempo * 1.5) * 2, f.cor, 3);
  tl.ampliar();
  const n = ORDEM_FINAIS.indexOf(j.e.final ?? '') + 1;
  tl.texto(`FINAL ${n} DE ${ORDEM_FINAIS.length}`, LARG / 2, 44, { alinhar: 'center', tam: 6, cor: '#ffffffaa' });
  tl.texto(f.titulo, LARG / 2, 52, { alinhar: 'center', tam: 13, cor: f.cor, peso: 700 });
  let y = 72;
  for (const p of f.texto) {
    for (const ln of tl.quebrar(p, LARG - 30, 6)) {
      tl.texto(ln, 15, y, { tam: 6, cor: '#fff6e8' });
      y += 7;
    }
    y += 3;
  }
  for (const ln of tl.quebrar(f.moral, LARG - 30, 6)) {
    tl.texto(ln, LARG / 2, y, { alinhar: 'center', tam: 6, cor: f.cor });
    y += 7;
  }
  const vistos = j.permanente.finais.length;
  tl.texto(`Filósofos no álbum: ${j.permanente.cartas.length}/${ORDEM_ALBUM.length}  ·  Finais vistos: ${vistos}/${ORDEM_FINAIS.length}`, LARG / 2, ALT - 20, { alinhar: 'center', tam: 6, cor: '#ffe8c2' });
  if (Math.floor(j.tempo * 2) % 2) tl.texto('Enter para voltar ao início', LARG / 2, ALT - 10, { alinhar: 'center', tam: 6, cor: '#ffd36b' });
}
