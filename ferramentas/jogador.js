// Jogador automático que usa só a entrada de verdade: aperta os botões de toque
// (ou o teclado, se não houver toque) e toca na tela. Lê o estado do jogo
// apenas para decidir o caminho, como uma pessoa olhando a tela.
//
// No navegador, com o servidor de desenvolvimento:
//   const j = await import('/ferramentas/jogador.js'); await j.jogarAteORei();
// O andamento fica em window.jogadorLog.

const T = 16;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const jogo = () => window.jogo;
export const log = (window.jogadorLog = []);
const anota = (s) => {
  log.push(s);
  if (log.length > 400) log.shift();
};

const TECLAS = { cima: 'ArrowUp', baixo: 'ArrowDown', esq: 'ArrowLeft', dir: 'ArrowRight', ok: 'Enter', album: 'Tab' };

function botao(acao) {
  const k = TECLAS[acao];
  const ativo = document.getElementById('toque')?.classList.contains('ativo');
  return ativo ? document.querySelector(`#toque button[data-k="${k}"]`) : null;
}

function apertar(acao) {
  const b = botao(acao);
  if (b) b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
  else dispatchEvent(new KeyboardEvent('keydown', { code: TECLAS[acao] }));
}

function soltar(acao) {
  const b = botao(acao);
  if (b) b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }));
  else dispatchEvent(new KeyboardEvent('keyup', { code: TECLAS[acao] }));
}

export async function tocar(acao, ms = 60) {
  apertar(acao);
  await espera(ms);
  soltar(acao);
  await espera(60);
}

/** Toque na tela em coordenadas do mundo (320x180). */
export async function tocarTela(x, y) {
  const c = document.getElementById('tela');
  const r = c.getBoundingClientRect();
  const cx = r.left + (x / 320) * r.width;
  const cy = r.top + (y / 180) * r.height;
  c.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: cx, clientY: cy, pointerType: 'touch' }));
  await espera(80);
}

// ------------------------------------------------------------ caminho

const tileJogador = () => [Math.floor(jogo().px / T), Math.floor((jogo().py - 2) / T)];

function bloqueados() {
  const s = new Set();
  for (const n of jogo().npcsVisiveis()) {
    if (n.vaivem || n.obj === 'nada' || n.obj === 'rachadura') continue;
    s.add(`${n.x},${n.y}`);
  }
  return s;
}

function livre(x, y, bl) {
  const j = jogo();
  if (j.solido(x, y) || bl.has(`${x},${y}`)) return false;
  // a corrente do ato 1 (o mesmo retângulo do mapa)
  const lim = j.cena.limite;
  if (lim && j.cena.id === 'fundo' && !j.e.flags.solto && (x < lim.x0 || x > lim.x1 || y < lim.y0 || y > lim.y1)) return false;
  const ch = j.ladrilho(x, y);
  // depois de olhar o reflexo, o jogador sabe onde o chão mente
  if (ch === 'X' && j.e.flags.reflexo) return false;
  return true;
}

function caminho(alvos) {
  const bl = bloqueados();
  const [sx, sy] = tileJogador();
  const chave = (x, y) => `${x},${y}`;
  const alvo = new Set(alvos.map(([x, y]) => chave(x, y)));
  const de = new Map([[chave(sx, sy), null]]);
  const fila = [[sx, sy]];
  while (fila.length) {
    const [x, y] = fila.shift();
    if (alvo.has(chave(x, y))) {
      const rota = [];
      let k = chave(x, y);
      while (k) {
        rota.unshift(k.split(',').map(Number));
        k = de.get(k);
      }
      return rota.slice(1);
    }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (de.has(chave(nx, ny)) || !livre(nx, ny, bl)) continue;
      de.set(chave(nx, ny), chave(x, y));
      fila.push([nx, ny]);
    }
  }
  return null;
}

async function passo(tx, ty) {
  const j = jogo();
  const ax = tx * T + 8, ay = ty * T + 14;
  let semAndar = false;
  for (let i = 0; i < 120; i++) {
    if (j.dialogo || j.pendentes.length || j.mini || j.modo !== 'mundo') return 'interrompido';
    const dx = ax - j.px, dy = ay - j.py;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return 'ok';
    // eixo principal; se não andou da última vez, tenta o outro (como gente faz na quina)
    let horizontal = Math.abs(dx) >= Math.abs(dy);
    if (i % 2 === 1 && semAndar) horizontal = !horizontal;
    if (horizontal && Math.abs(dx) < 2) horizontal = false;
    if (!horizontal && Math.abs(dy) < 2) horizontal = true;
    const acao = horizontal ? (dx > 0 ? 'dir' : 'esq') : dy > 0 ? 'baixo' : 'cima';
    const antes = [j.px, j.py];
    apertar(acao);
    const dist = Math.abs(horizontal ? dx : dy);
    await espera(Math.max(16, Math.min(120, (dist / 66) * 1000 - 8)));
    soltar(acao);
    await espera(20);
    semAndar = Math.hypot(j.px - antes[0], j.py - antes[1]) < 0.5;
  }
  return 'travado';
}

export async function andarAte(alvos, rotulo = '') {
  for (let tentativa = 0; tentativa < 6; tentativa++) {
    const cena = jogo().cena.id;
    const rota = caminho(alvos);
    if (!rota) throw new Error(`sem caminho para ${rotulo} em ${cena}`);
    let interrompido = false;
    for (const [x, y] of rota) {
      const r = await passo(x, y);
      if (r === 'interrompido') {
        interrompido = true;
        break;
      }
      if (r === 'travado') break;
    }
    if (jogo().cena.id !== cena) return;
    const [px, py] = tileJogador();
    if (alvos.some(([x, y]) => x === px && y === py)) return;
    if (interrompido) await resolverConversa([]);
  }
  throw new Error(`não cheguei em ${rotulo}`);
}

function vizinhos(n) {
  const p = jogo().posNpc(n);
  const x = Math.round((p.x - 8) / T), y = n.y;
  return [[x, y + 1], [x - 1, y], [x + 1, y], [x, y - 1]];
}

// ------------------------------------------------------------ conversa

/** Responde a conversa aberta tocando na tela; escolhas pelo começo do texto. */
export async function resolverConversa(escolhas) {
  const j = jogo();
  const fila = [...escolhas];
  for (let i = 0; i < 300; i++) {
    if (j.mini || j.modo !== 'mundo') return;
    if (!j.dialogo) {
      if (!j.pendentes.length) return;
      await espera(150);
      continue;
    }
    const d = j.dialogo;
    const l = d.linha();
    const esc = d.escolhas();
    if (esc.length && (!l || j.revelado >= l[1].length) && j.rectsEscolha.length === esc.length) {
      const quer = fila.shift();
      let k = quer === undefined ? 0 : esc.findIndex((e) => e.t.startsWith(quer));
      if (k < 0) throw new Error(`escolha "${quer}" não está lá: ${esc.map((e) => e.t).join(' | ')}`);
      anota(`  > ${esc[k].t}`);
      const r = j.rectsEscolha[k];
      await tocarTela(r.x + r.w / 2, r.y + r.h / 2);
      await espera(120);
      continue;
    }
    if (l && j.revelado < l[1].length) {
      await espera(40);
      if (Math.random() < 0.5) continue; // às vezes espera o texto, às vezes pula
    }
    if (l && j.revelado >= l[1].length) anota(`  ${l[0] || '*'}: ${l[1].slice(0, 70)}`);
    await tocar('ok');
    await espera(40);
  }
  throw new Error('conversa não terminou');
}

export async function falar(id, escolhas = []) {
  const j = jogo();
  for (let t = 0; t < 4; t++) {
    const n = j.npcsVisiveis().find((x) => x.id === id);
    if (!n) throw new Error(`${id} não está visível em ${j.cena.id}`);
    await andarAte(vizinhos(n), id);
    await espera(80);
    if (j.npcProximo()?.id !== id) continue;
    anota(`[${j.cena.id}] falar com ${id}`);
    await tocar('ok');
    await espera(100);
    await resolverConversa(escolhas);
    return;
  }
  throw new Error(`não consegui falar com ${id}`);
}

async function esperarCena(id) {
  for (let i = 0; i < 200; i++) {
    if (jogo().cena.id === id) break;
    await espera(50);
  }
  if (jogo().cena.id !== id) throw new Error(`esperava a cena ${id}, estou em ${jogo().cena.id}`);
  await espera(2400); // cartão do ato
  await resolverConversa([]);
}

// ------------------------------------------------------------ minijogos

async function jogarSombras() {
  const j = jogo();
  let erros = 0;
  while (j.mini && !j.mini.acabou) {
    const m = j.mini;
    if (m.fase === 'mostrando') {
      await espera(200);
      continue;
    }
    if (m.fase === 'pergunta') {
      const r = (await import('/src/minijogos/minijogos.ts')).RODADAS[m.rodada];
      // erra de propósito uma vez, para ver o Trasímaco rir
      const k = erros === 0 && m.rodada === 1 ? (r.certa + 1) % r.opcoes.length : r.certa;
      if (k !== r.certa) erros++;
      const n = r.opcoes.length, w = 56, x0 = (320 - n * w - (n - 1) * 10) / 2;
      anota(`  sombras: rodada ${m.rodada + 1}, toco a opção ${k + 1}`);
      await tocarTela(x0 + k * (w + 10) + w / 2, 140);
      await espera(1600);
      continue;
    }
    await tocar('ok');
    await espera(300);
  }
}

async function jogarTitereiro() {
  const j = jogo();
  const { PAUTA } = await import('/src/minijogos/minijogos.ts');
  const bonecos = ['coelho', 'cavalo', 'passaro', 'homem'];
  await tocar('ok');
  while (j.mini && !j.mini.acabou) {
    const m = j.mini;
    if (m.fbT > 0) {
      await espera(100);
      continue;
    }
    const pedido = PAUTA[m.i];
    let k = bonecos.indexOf(pedido);
    if (k < 0) k = 2; // pedido abstrato: qualquer boneco serve
    if (m.i === 4) k = 0; // erra um, de propósito
    await espera(500);
    await tocarTela(40 + k * 64 + 24, 116);
    await espera(200);
  }
}

// ------------------------------------------------------------ partida inteira

async function sairPor(gatilhoFx) {
  const g = jogo().cena.gatilhos.find((x) => x.fx?.includes(gatilhoFx));
  const alvos = [];
  for (let y = g.y; y < g.y + g.h; y++) for (let x = g.x; x < g.x + g.w; x++) alvos.push([x, y]);
  await andarAte(alvos, gatilhoFx);
}

export async function comecar() {
  log.length = 0;
  const j = jogo();
  if (j.modo !== 'titulo') j.modo = 'titulo';
  await espera(300);
  const k = j.opcoesTitulo().indexOf('Novo jogo');
  const r = j.rectsMenu[k];
  await tocarTela(r.x + r.w / 2, r.y + r.h / 2);
  await esperarCena('fundo');
}

export async function ato1() {
  for (const id of ['doxa', 'sartre', 'critico', 'parmenides', 'zenao', 'heraclito', 'pirro', 'marx']) await falar(id, ['Como']);
  await falar('socrates', ['Não faço']);
  await falar('trasimaco', ['Quero disputar']);
  await jogarSombras();
  await resolverConversa([]);
  await falar('socrates', ['Honra', '...nada']);
  await sairPor('cena:fogo');
  await esperarCena('fogo');
}

export async function ato2() {
  for (const id of ['protagoras', 'maquiavel', 'debord', 'baudrillard', 'han', 'foucault', 'socrates']) await falar(id, ['Uns dois']);
  // tenta subir antes da hora: tem que ser barrado
  await sairPor('cena:subida').catch(() => anota('  (barrado na subida, como esperado)'));
  await resolverConversa([]);
  await falar('gorgias', ['Bora']);
  await jogarTitereiro();
  await resolverConversa([]);
  await falar('gorgias', ['Posso pensar']);
  await falar('gorgias', ['Não. Quero ver']);
  await falar('socrates');
  await sairPor('cena:subida');
  await esperarCena('subida');
}

export async function ato3() {
  // primeiro tenta atravessar sem olhar o reflexo, e cai
  const antes = log.length;
  await andarAte([[15, 31]], 'chão falso').catch(() => {});
  await resolverConversa([]);
  anota(`  caiu no chão falso: ${log.slice(antes).some((s) => s.includes('imaginação')) || jogo().py > 42 * 16}`);
  await falar('diogenes', ['Sou']);
  await falar('hiparquia');
  await falar('poca');
  await andarAte([[10, 29]], 'fim do labirinto');
  await resolverConversa([]);
  await falar('tales');
  await falar('camus');
  await falar('sisifo', ['Quer ajuda']);
  await falar('kierkegaard', ['Pensar mais']);
  await falar('kierkegaard', ['Pular']);
  await falar('descartes');
  await falar('pitagoras', ['360', '180', '5.', 'Um pouquinho', '180', '5.', 'Não!']);
  await andarAte([[10, 7]], 'andar 4');
  await resolverConversa([]);
  await falar('kant');
  await falar('portakant');
  await falar('socrates', ['A conveniência', 'Ser campeão', 'Eu... não sei']);
  await falar('wittgenstein', ['O senhor']);
  await sairPor('cena:fora');
  await esperarCena('fora');
}

export async function ato4() {
  await falar('reflexo'); // cedo demais: ainda claro
  await falar('sombrachao');
  await falar('reflexo');
  await falar('socrates');
  for (const id of ['spinoza', 'beauvoir', 'arvore', 'cavalo', 'cadeira', 'aristoteles', 'platao', 'confucio', 'balanca', 'marcoaurelio', 'laotse', 'diotima', 'schopenhauer']) await falar(id, ['Sou']);
  await falar('sol'); // ainda não pode
  await falar('hipatia');
  await falar('nietzsche');
  await falar('sol');
  await falar('rachadura', ['Fingir']);
  await falar('epicuro', ['Ainda não sei']);
  await falar('socrates');
  await falar('epicuro', ['Preciso voltar']);
  await sairPor('cena:volta');
  await esperarCena('volta');
}

export async function ato5() {
  await falar('socrates');
  await falar('sartre');
  const boas = {
    doxa: 'A senhora já viu', trasimaco: 'Se o mais forte', critico: 'Se tudo na parede',
    parmenides: 'Se o ser é uno', pirro: 'Se nada é certo', zenao: 'E mesmo assim',
  };
  for (const [id, e] of Object.entries(boas)) await falar(id, [e]);
  await falar('marx');
  await falar('heraclito');
  await falar('arendt');
  await falar('anito', ['Eu não vim ensinar']);
}

/**
 * Joga até o final do Rei Filósofo. Com `desde` > 1, chega rápido até aquele
 * ato pelo robô e joga com toques reais dali em diante.
 */
export async function jogarAteORei(desde = 1) {
  const t0 = performance.now();
  const atos = [ato1, ato2, ato3, ato4, ato5];
  const cenas = ['fundo', 'fogo', 'subida', 'fora', 'volta'];
  try {
    if (desde > 1) {
      log.length = 0;
      const r = window.robo;
      jogo().novoJogo();
      r.ato1();
      if (desde > 2) r.ato2();
      if (desde > 3) r.ato3();
      if (desde > 4) {
        r.ato4(true).falar('epicuro').escolher('Preciso voltar').gatilho(0);
      }
      if (desde === 2) r.gatilho(0);
      if (desde === 3) r.gatilho(0);
      jogo().fecharDialogo();
      jogo().pendentes = [];
      anota(`(robô levou até ${cenas[desde - 1]})`);
    } else {
      await comecar();
    }
    for (let i = desde - 1; i < atos.length; i++) await atos[i]();
    const j = jogo();
    anota(`FIM: modo=${j.modo} final=${j.e.final} cartas=${j.e.cartas.length} formas=${j.e.formas.length} conv=${j.e.convencidos.length} irrit=${j.e.irritacao}`);
  } catch (e) {
    anota(`ERRO: ${e.message} (cena ${jogo().cena.id}, ${tileJogador()})`);
  }
  anota(`tempo: ${Math.round((performance.now() - t0) / 1000)} s`);
  return log.slice(-3);
}
