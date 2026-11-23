import { describe, expect, it } from 'vitest';
import { ALBUM } from '../src/historia/album';
import { CENAS } from '../src/historia/cenas';
import { FINAIS } from '../src/historia/finais';
import { CONVERSAS } from '../src/historia/index';
import { PERSONAGENS } from '../src/historia/personagens';
import { condicaoValida } from '../src/jogo/condicao';
import { armazemDeMentira, Jogo } from '../src/jogo/jogo';
import { Robo } from '../src/jogo/robo';
import { SILHUETAS } from '../src/motor/sprites';
import { MINIJOGOS } from '../src/minijogos/minijogos';

const EFEITO = /^(-?flag:[\w-]+([=+]-?\d+)?|carta:\w+|forma:\w+|conv:\w+|irrit[+-]\d+|visao:\d+|cena:\w+|mini:\w+|final:\w+|teleporte:\d+,\d+|conversa:\w+)$/;
const OBJETOS_ESPECIAIS = new Set(['brilho', 'sombra', 'nada', 'rachadura', 'sol']);

function efeitos(fx: string[] | undefined, onde: string): void {
  for (const f of fx ?? []) {
    expect(f, onde).toMatch(EFEITO);
    const [tipo, alvo] = f.replace(/^-/, '').split(':');
    if (tipo === 'cena') expect(CENAS[alvo], `${onde}: cena ${alvo}`).toBeDefined();
    if (tipo === 'final') expect(FINAIS[alvo], `${onde}: final ${alvo}`).toBeDefined();
    if (tipo === 'conversa') expect(CONVERSAS[alvo], `${onde}: conversa ${alvo}`).toBeDefined();
    if (tipo === 'mini') expect(MINIJOGOS, `${onde}: mini ${alvo}`).toContain(alvo);
    if (tipo === 'carta') expect(ALBUM[alvo], `${onde}: carta ${alvo}`).toBeDefined();
  }
}

describe('texto da história', () => {
  it('nunca usa travessão', () => {
    const tudo = JSON.stringify({ CONVERSAS, ALBUM, FINAIS, CENAS });
    expect(tudo).not.toMatch(/[—–]/);
  });

  it('conversas apontam para nós, falantes, condições e efeitos que existem', () => {
    for (const [id, conv] of Object.entries(CONVERSAS)) {
      expect(conv.inicio, `${id} sem inicio`).toBeDefined();
      for (const [nome, no] of Object.entries(conv)) {
        const onde = `${id}.${nome}`;
        if (!no.ramos) expect(no.l.length + (no.esc?.length ?? 0), `${onde} vazio`).toBeGreaterThan(0);
        for (const [quem, txt] of no.l) {
          if (quem) expect(PERSONAGENS[quem], `${onde}: falante ${quem}`).toBeDefined();
          expect(txt.length, `${onde}: fala vazia`).toBeGreaterThan(0);
          expect(txt.length, `${onde}: fala longa demais para a caixa`).toBeLessThan(230);
        }
        if (no.ir) expect(conv[no.ir], `${onde} -> ${no.ir}`).toBeDefined();
        for (const r of no.ramos ?? []) {
          expect(conv[r.ir], `${onde} ramo -> ${r.ir}`).toBeDefined();
          if (r.se) expect(condicaoValida(r.se), `${onde}: ${r.se}`).toBe(true);
        }
        for (const e of no.esc ?? []) {
          if (e.ir) expect(conv[e.ir], `${onde} escolha -> ${e.ir}`).toBeDefined();
          if (e.se) expect(condicaoValida(e.se)).toBe(true);
          efeitos(e.fx, `${onde} escolha`);
        }
        efeitos(no.fx, onde);
      }
    }
  });

  it('toda carta do álbum tem personagem', () => {
    for (const id of Object.keys(ALBUM)) expect(PERSONAGENS[id], id).toBeDefined();
  });
});

describe('mapas', () => {
  for (const c of Object.values(CENAS)) {
    it(`${c.id}: retangular, com início livre e npcs válidos`, () => {
      const w = c.mapa[0].length;
      c.mapa.forEach((l, y) => expect(l.length, `${c.id} linha ${y}`).toBe(w));
      const j = new Jogo(armazemDeMentira());
      j.cena = c;
      expect(j.solido(c.inicio[0], c.inicio[1]), `${c.id} início em parede`).toBe(false);
      for (const n of c.npcs) {
        expect(CONVERSAS[n.conversa], `${c.id}: conversa ${n.conversa}`).toBeDefined();
        if (n.obj) expect(OBJETOS_ESPECIAIS.has(n.obj) || !!SILHUETAS[n.obj], `${c.id}: objeto ${n.obj}`).toBe(true);
        else expect(PERSONAGENS[n.quem ?? n.id], `${c.id}: personagem ${n.id}`).toBeDefined();
        expect(j.solido(n.x, n.y), `${c.id}: ${n.id} dentro da parede`).toBe(false);
        if (n.se) expect(condicaoValida(n.se)).toBe(true);
      }
      for (const g of c.gatilhos) {
        efeitos(g.fx, `${c.id} gatilho`);
        if (g.conversa) expect(CONVERSAS[g.conversa]).toBeDefined();
        if (g.bloqueio) expect(CONVERSAS[g.bloqueio]).toBeDefined();
      }
    });
  }

  it('o labirinto de chão falso tem caminho de verdade do começo até a escada', () => {
    const m = CENAS.subida.mapa;
    const livre = (x: number, y: number) => m[y] && '.,'.includes(m[y][x] ?? '#');
    const fila: [number, number][] = [[10, 41]];
    const visto = new Set(['10,41']);
    let chegou = false;
    while (fila.length) {
      const [x, y] = fila.shift()!;
      if (y === 29) chegou = true;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (ny < 29 || ny > 44 || !livre(nx, ny) || visto.has(`${nx},${ny}`)) continue;
        visto.add(`${nx},${ny}`);
        fila.push([nx, ny]);
      }
    }
    expect(chegou).toBe(true);
  });
});

describe('robô joga até cada final', () => {
  const novo = () => {
    const j = new Jogo(armazemDeMentira());
    j.novoJogo();
    return new Robo(j);
  };

  it('Titereiro: aceita o emprego', () => {
    const r = novo().ato1().ato2(true);
    expect(r.j.modo).toBe('final');
    expect(r.j.e.final).toBe('titereiro');
  });

  it('Sombra e Água Fresca: fica no jardim', () => {
    const r = novo().ato1().ato2().ato3().ato4();
    expect(r.cena()).toBe('fora');
    r.falar('epicuro').escolher('Fico');
    expect(r.j.e.final).toBe('sombra');
  });

  it('Rei Filósofo: volta e pergunta em vez de ensinar', () => {
    const r = novo().ato1().ato2().ato3().ato4();
    r.falar('epicuro').escolher('Preciso voltar').gatilho(0);
    expect(r.cena()).toBe('volta');
    r.ato5(true).falar('arendt').falar('anito').escolher('Eu não vim ensinar');
    expect(r.j.e.final).toBe('rei');
  });

  it('Cicuta: volta debochando de todo mundo', () => {
    const r = novo().ato1().ato2().ato3().ato4();
    r.falar('epicuro').escolher('Preciso voltar').gatilho(0);
    r.ato5(false).falar('anito').escolher('Eu não vim ensinar');
    expect(r.j.e.irritacao).toBeGreaterThan(3);
    expect(r.j.e.final).toBe('cicuta');
  });

  it('De Volta ao Sofá: desiste na assembleia', () => {
    const r = novo().ato1().ato2().ato3().ato4();
    r.falar('epicuro').escolher('Preciso voltar').gatilho(0);
    r.ato5(true).falar('anito').escolher('Tá bom');
    expect(r.j.e.final).toBe('sofa');
  });

  it('A Caverna da Caverna: sete Formas e a rachadura no céu', () => {
    const r = novo().ato1().ato2().ato3().ato4(true);
    expect(r.j.e.formas).toHaveLength(7);
    r.falar('rachadura').escolher('Entrar');
    expect(r.cena()).toBe('secreta');
    r.falar('descartes').falar('bacon').falar('socrates').escolher('Então vamos');
    expect(r.j.e.final).toBe('cavernas');
  });

  it('o álbum enche conversando com todo mundo e sobrevive a um jogo novo', () => {
    const r = novo().ato1();
    for (const n of CENAS.fundo.npcs) r.falar(n.id);
    const antes = r.j.e.cartas.length;
    expect(antes).toBe(8);
    r.j.novoJogo();
    expect(r.j.e.cartas.length).toBe(antes);
  });

  it('os seis finais são alcançáveis', () => {
    expect(Object.keys(FINAIS).sort()).toEqual(['cavernas', 'cicuta', 'rei', 'sofa', 'sombra', 'titereiro']);
  });
});
