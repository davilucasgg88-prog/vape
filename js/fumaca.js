/* ==========================================================
   Motor de fumaça em <canvas>
   Partículas com textura suave, empuxo, turbulência e anéis.
   ========================================================== */

class Fumaca {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particulas = [];
    this.texturas = new Map();
    this.tempo = 0;
    this.max = 1400;
    this.vento = 0;
    this._redimensionar = this._redimensionar.bind(this);
    this._quadro = this._quadro.bind(this);
    if ('ResizeObserver' in window) new ResizeObserver(this._redimensionar).observe(canvas);
    else window.addEventListener('resize', this._redimensionar);
    this._redimensionar();
    this._ultimo = performance.now();
    requestAnimationFrame(this._quadro);
  }

  _redimensionar() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /* Textura de "nuvem": gradiente radial com bolhas aleatórias, gerada uma vez por cor */
  _textura(cor, variante) {
    const chave = cor + variante;
    if (this.texturas.has(chave)) return this.texturas.get(chave);
    const t = document.createElement('canvas');
    const s = 128;
    t.width = t.height = s;
    const c = t.getContext('2d');
    const [r, g, b] = Fumaca.rgb(cor);
    // mistura a cor do sabor com branco para parecer vapor
    const mr = Math.round(r * 0.45 + 255 * 0.55);
    const mg = Math.round(g * 0.45 + 255 * 0.55);
    const mb = Math.round(b * 0.45 + 255 * 0.55);
    let semente = variante * 9301 + 49297;
    const aleatorio = () => ((semente = (semente * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 7; i++) {
      const x = s / 2 + (aleatorio() - 0.5) * s * 0.35;
      const y = s / 2 + (aleatorio() - 0.5) * s * 0.35;
      const raio = s * (0.22 + aleatorio() * 0.28);
      const gr = c.createRadialGradient(x, y, 0, x, y, raio);
      gr.addColorStop(0, `rgba(${mr},${mg},${mb},0.3)`);
      gr.addColorStop(0.5, `rgba(${mr},${mg},${mb},0.1)`);
      gr.addColorStop(1, `rgba(${mr},${mg},${mb},0)`);
      c.fillStyle = gr;
      c.fillRect(0, 0, s, s);
    }
    this.texturas.set(chave, t);
    return t;
  }

  /* Solta uma baforada a partir de (x, y) */
  emitir(x, y, op = {}) {
    const {
      qtd = 6, cor = '#ffffff', vx = 0, vy = -60, espalha = 40,
      tamanho = 14, cresce = 38, vida = 3.2, opacidade = 0.85, empuxo = 26,
    } = op;
    for (let i = 0; i < qtd; i++) {
      if (this.particulas.length >= this.max) this.particulas.shift();
      const vidaP = vida * (0.7 + Math.random() * 0.6);
      this.particulas.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: vx + (Math.random() - 0.5) * espalha,
        vy: vy + (Math.random() - 0.5) * espalha * 0.6,
        r: tamanho * (0.6 + Math.random() * 0.8),
        cresce: cresce * (0.6 + Math.random() * 0.8),
        vida: vidaP, total: vidaP,
        a: opacidade,
        rot: Math.random() * Math.PI * 2,
        giro: (Math.random() - 0.5) * 0.8,
        semente: Math.random() * 1000,
        empuxo,
        tex: this._textura(cor, (Math.random() * 4) | 0),
      });
    }
  }

  /* Anel de fumaça: partículas pequenas distribuídas numa elipse que viajam juntas */
  anel(x, y, op = {}) {
    const { cor = '#ffffff', raio = 16, vx = 50, vy = -70, vida = 3.6 } = op;
    const n = 34;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2;
      const ox = Math.cos(ang), oy = Math.sin(ang) * 0.55;
      this.particulas.push({
        x: x + ox * raio, y: y + oy * raio,
        vx: vx + ox * 16, vy: vy + oy * 16,
        r: 7, cresce: 6,
        vida, total: vida, a: 0.9,
        rot: ang, giro: 0.2, semente: i, empuxo: 6,
        anel: true,
        tex: this._textura(cor, i % 4),
      });
    }
  }

  /* Faísca mágica: estrelinha brilhante que sobe e pisca */
  faisca(x, y, op = {}) {
    const { cor = '#ffffff', vx = 0, vy = -40, espalha = 60, vida = 1.4 } = op;
    if (this.particulas.length >= this.max) this.particulas.shift();
    const v = vida * (0.6 + Math.random() * 0.8);
    this.particulas.push({
      x, y,
      vx: vx + (Math.random() - 0.5) * espalha,
      vy: vy + (Math.random() - 0.5) * espalha,
      r: 2 + Math.random() * 3.5, cresce: 0,
      vida: v, total: v, a: 1,
      rot: Math.random() * Math.PI, giro: (Math.random() - 0.5) * 6,
      semente: Math.random() * 1000, empuxo: 14,
      estrela: true, cor,
    });
  }

  _estrela(ctx, p, alfa) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    const brilho = 0.6 + 0.4 * Math.sin(this.tempo * 18 + p.semente);
    ctx.globalAlpha = alfa * brilho;
    const r = p.r * 2.6;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.25, p.cor);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const s = p.r * 1.6, f = p.r * 0.25;
    ctx.moveTo(0, -s); ctx.lineTo(f, -f); ctx.lineTo(s, 0); ctx.lineTo(f, f);
    ctx.lineTo(0, s); ctx.lineTo(-f, f); ctx.lineTo(-s, 0); ctx.lineTo(-f, -f);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _quadro(agora) {
    const dt = Math.min((agora - this._ultimo) / 1000, 0.05);
    this._ultimo = agora;
    this.tempo += dt;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    const ps = this.particulas;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.vida -= dt;
      if (p.vida <= 0 || p.y < -200) { ps.splice(i, 1); continue; }

      // turbulência suave (campo de seno) + empuxo + arrasto
      const t = this.tempo;
      const turb = p.anel ? 4 : 26;
      p.vx += (Math.sin(p.y * 0.012 + t * 1.3 + p.semente) * turb + this.vento) * dt;
      p.vy += (Math.cos(p.x * 0.01 + t * 0.9 + p.semente) * turb * 0.5 - p.empuxo) * dt;
      const arrasto = p.anel ? 0.992 : 0.982;
      p.vx *= arrasto;
      p.vy *= arrasto;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.r += p.cresce * dt;
      p.rot += p.giro * dt;

      const k = p.vida / p.total;               // 1 → 0
      const entrada = Math.min(1, (1 - k) * 8); // aparece rápido
      const alfa = p.a * entrada * Math.pow(k, 1.4);
      if (alfa < 0.01) continue;
      if (p.estrela) { this._estrela(ctx, p, alfa); continue; }

      ctx.globalAlpha = alfa;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const d = p.r * 2;
      ctx.drawImage(p.tex, -p.r, -p.r, d, d);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(this._quadro);
  }

  static rgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
}
