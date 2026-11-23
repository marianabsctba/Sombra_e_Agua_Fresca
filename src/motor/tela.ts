// Tela em duas camadas: o mundo é desenhado num buffer de 320x180 e ampliado
// sem suavização; textos e painéis vão direto na tela grande, na escala certa,
// para a fonte pixel ficar nítida.

export const LARG = 320;
export const ALT = 180;
export const FONTE = "'Pixelify Sans', monospace";

export interface OpcoesTexto {
  cor?: string;
  tam?: number;
  alinhar?: CanvasTextAlign;
  sombra?: string | false;
  peso?: number;
}

export class Tela {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly buf: HTMLCanvasElement;
  readonly b: CanvasRenderingContext2D;
  escala = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.buf = document.createElement('canvas');
    this.buf.width = LARG;
    this.buf.height = ALT;
    this.b = this.buf.getContext('2d')!;
    this.ajustar();
    addEventListener('resize', () => this.ajustar());
  }

  ajustar(): void {
    const dpr = window.devicePixelRatio || 1;
    const w = innerWidth * dpr;
    const h = innerHeight * dpr;
    let e = Math.min(w / LARG, h / ALT);
    e = e >= 2 ? Math.floor(e) : Math.max(1, Math.floor(e * 2) / 2);
    this.escala = e;
    this.canvas.width = Math.round(LARG * e);
    this.canvas.height = Math.round(ALT * e);
    this.canvas.style.width = `${this.canvas.width / dpr}px`;
    this.canvas.style.height = `${this.canvas.height / dpr}px`;
  }

  /** Converte coordenada da página para coordenada do mundo (320x180). */
  doCliente(cx: number, cy: number): { x: number; y: number } {
    const r = this.canvas.getBoundingClientRect();
    return { x: ((cx - r.left) / r.width) * LARG, y: ((cy - r.top) / r.height) * ALT };
  }

  comecar(fundo = '#000'): void {
    this.b.imageSmoothingEnabled = false;
    this.b.setTransform(1, 0, 0, 1, 0, 0);
    this.b.globalAlpha = 1;
    this.b.fillStyle = fundo;
    this.b.fillRect(0, 0, LARG, ALT);
  }

  /** Amplia o buffer do mundo para a tela grande. */
  ampliar(): void {
    const c = this.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.imageSmoothingEnabled = false;
    c.globalAlpha = 1;
    c.drawImage(this.buf, 0, 0, this.canvas.width, this.canvas.height);
  }

  // ---------- camada de interface (coordenadas do mundo, desenho na tela grande)

  ret(x: number, y: number, w: number, h: number, cor: string, alfa = 1): void {
    const e = this.escala;
    const c = this.ctx;
    c.globalAlpha = alfa;
    c.fillStyle = cor;
    c.fillRect(Math.round(x * e), Math.round(y * e), Math.round(w * e), Math.round(h * e));
    c.globalAlpha = 1;
  }

  moldura(x: number, y: number, w: number, h: number, fundo: string, borda: string, alfa = 0.94): void {
    this.ret(x, y, w, h, fundo, alfa);
    this.ret(x, y, w, 1, borda);
    this.ret(x, y + h - 1, w, 1, borda);
    this.ret(x, y, 1, h, borda);
    this.ret(x + w - 1, y, 1, h, borda);
    this.ret(x + 1, y + 1, 1, 1, borda);
    this.ret(x + w - 2, y + 1, 1, 1, borda);
    this.ret(x + 1, y + h - 2, 1, 1, borda);
    this.ret(x + w - 2, y + h - 2, 1, 1, borda);
  }

  private fonte(tam: number, peso: number): string {
    return `${peso} ${Math.round(tam * this.escala)}px ${FONTE}`;
  }

  texto(txt: string, x: number, y: number, o: OpcoesTexto = {}): void {
    const c = this.ctx;
    const e = this.escala;
    const tam = o.tam ?? 8;
    c.font = this.fonte(tam, o.peso ?? 500);
    c.textAlign = o.alinhar ?? 'left';
    c.textBaseline = 'top';
    if (o.sombra !== false) {
      c.fillStyle = o.sombra ?? '#00000099';
      c.fillText(txt, Math.round((x + 0.5) * e), Math.round((y + 0.5) * e));
    }
    c.fillStyle = o.cor ?? '#fff';
    c.fillText(txt, Math.round(x * e), Math.round(y * e));
  }

  largura(txt: string, tam = 8, peso = 500): number {
    this.ctx.font = this.fonte(tam, peso);
    return this.ctx.measureText(txt).width / this.escala;
  }

  /** Quebra o texto em linhas que caibam na largura (em pixels do mundo). */
  quebrar(txt: string, larg: number, tam = 8): string[] {
    const saida: string[] = [];
    for (const par of txt.split('\n')) {
      let linha = '';
      for (const p of par.split(' ')) {
        const tenta = linha ? `${linha} ${p}` : p;
        if (this.largura(tenta, tam) > larg && linha) {
          saida.push(linha);
          linha = p;
        } else linha = tenta;
      }
      saida.push(linha);
    }
    return saida;
  }
}
