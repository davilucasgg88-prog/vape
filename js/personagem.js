/* ==========================================================
   Personagem: levanta o pod, puxa (LED acende, olhos fecham,
   peito enche), abaixa o braço e solta a fumaça pela boca.
   ========================================================== */

class Personagem {
  constructor(svg, fumaca, opcoes = {}) {
    this.svg = svg;
    this.fumaca = fumaca;
    this.cor = opcoes.cor || '#a855f7';
    this.aoSoltar = opcoes.aoSoltar || (() => {});
    this.aoCarregar = opcoes.aoCarregar || (() => {});
    this.aoConjurar = opcoes.aoConjurar || (() => {});
    this.som = opcoes.som || null;

    const $ = (id) => svg.querySelector('#' + id);
    this.el = {
      braco: $('braco'), cabeca: $('cabeca'), corpo: $('corpo'),
      pupE: $('pupila-e'), pupD: $('pupila-d'),
      palE: $('palpebra-e'), palD: $('palpebra-d'),
      cilE: $('cilio-e'), cilD: $('cilio-d'),
      sobE: $('sob-e'), sobD: $('sob-d'),
      bocE: $('bochecha-e'), bocD: $('bochecha-d'),
      bocaNormal: $('boca-normal'), bocaPuxa: $('boca-puxa'), bocaSolta: $('boca-solta'),
      bocaPonto: $('boca-ponto'), led: $('led'), ledBrilho: $('led-brilho'),
      pod: $('pod'),
      // extras do mago (opcionais)
      cajado: $('cajado'), orbe: $('orbe'), orbeBrilho: $('orbe-brilho'),
      olhoME: $('olho-magico-e'), olhoMD: $('olho-magico-d'),
    };

    // estado visual (interpolado a cada quadro)
    this.v = { braco: 15, cabeca: 0, palpebra: 0, bochecha: 0, peito: 0, led: 0, magia: 0 };
    this.alvo = { ...this.v };
    this.estado = 'parado'; // parado | subindo | puxando | descendo | segurando | soltando
    this.carga = 0;         // 0..1
    this.cargaMax = 4;      // segundos para encher 100%
    this.olhar = { x: 0, y: 0 };
    this.piscar = 0;
    this.proximaPiscada = 2;
    this.tempo = 0;

    this.BRACO_PARADO = 15;
    this.BRACO_BOCA = -28.8;

    this._quadro = this._quadro.bind(this);
    this._ultimo = performance.now();
    requestAnimationFrame(this._quadro);

    window.addEventListener('pointermove', (e) => {
      const r = this.svg.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * 0.45;
      this.olhar.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      this.olhar.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));
    });
  }

  get ocupado() { return this.estado !== 'parado'; }

  /* Começa o puff (segurar) */
  comecar() {
    if (this.estado !== 'parado') return false;
    this.estado = 'subindo';
    this.carga = 0;
    this.alvo.braco = this.BRACO_BOCA;
    this.alvo.cabeca = 2;
    return true;
  }

  /* Solta o botão: termina a puxada */
  terminar() {
    if (this.estado === 'subindo') { this._soltarAoChegar = true; return; }
    if (this.estado !== 'puxando') return;
    this.som && this.som.pararPuxar();
    this.estado = 'descendo';
    this.alvo.braco = this.BRACO_PARADO;
    this.alvo.led = 0;
  }

  /* Puff automático com duração em segundos */
  automatico(segundos) {
    if (!this.comecar()) return;
    this._autoFim = segundos;
  }

  setCor(cor) { this.cor = cor; }

  _centro(el) {
    const b = el.getBoundingClientRect();
    const c = this.fumaca.canvas.getBoundingClientRect();
    return { x: b.left + b.width / 2 - c.left, y: b.top + b.height / 2 - c.top };
  }

  _bocaNaTela() {
    const b = this.el.bocaPonto.getBoundingClientRect();
    const c = this.fumaca.canvas.getBoundingClientRect();
    return { x: b.left + b.width / 2 - c.left, y: b.top + b.height / 2 - c.top };
  }

  _pontaDoPod() {
    const b = this.el.pod.getBoundingClientRect();
    const c = this.fumaca.canvas.getBoundingClientRect();
    return { x: b.left + b.width / 2 - c.left, y: b.top - c.top };
  }

  _boca(tipo) {
    this.el.bocaNormal.style.opacity = tipo === 'normal' ? 1 : 0;
    this.el.bocaPuxa.style.opacity = tipo === 'puxa' ? 1 : 0;
    this.el.bocaSolta.style.opacity = tipo === 'solta' ? 1 : 0;
  }

  _quadro(agora) {
    const dt = Math.min((agora - this._ultimo) / 1000, 0.05);
    this._ultimo = agora;
    this.tempo += dt;
    const v = this.v, a = this.alvo;

    // ---- máquina de estados ----
    switch (this.estado) {
      case 'subindo':
        if (Math.abs(v.braco - this.BRACO_BOCA) < 1.2) {
          this.estado = 'puxando';
          this._boca('puxa');
          this.som && this.som.puxar();
          if (this._soltarAoChegar) { this._soltarAoChegar = false; this._autoFim = 0.35; }
        }
        break;
      case 'puxando': {
        this.carga = Math.min(1, this.carga + dt / this.cargaMax);
        a.led = 1;
        a.palpebra = 0.55 + this.carga * 0.35;
        a.peito = this.carga;
        a.cabeca = 2 + this.carga * 3;
        this.aoCarregar(this.carga);
        // fiozinho de vapor sendo puxado na ponta do pod
        if (Math.random() < 0.5) {
          const p = this._pontaDoPod();
          this.fumaca.emitir(p.x + 4, p.y + 2, { qtd: 1, cor: this.cor, vx: -10, vy: -6, espalha: 6, tamanho: 3, cresce: 4, vida: 0.6, opacidade: 0.35, empuxo: 4 });
        }
        a.magia = this.carga;
        if (this.el.orbe && Math.random() < 0.15 + this.carga * 0.5) {
          const o = this._centro(this.el.orbe);
          this.fumaca.faisca(o.x, o.y, { cor: this.cor, espalha: 90 });
        }
        if (this._autoFim !== undefined) {
          this._autoFim -= dt;
          if (this._autoFim <= 0) { this._autoFim = undefined; this.terminar(); }
        }
        if (this.carga >= 1) this.terminar();
        break;
      }
      case 'descendo':
        this._boca('normal');
        a.bochecha = 1; // segura a fumaça na boca
        a.palpebra = 0.3;
        if (Math.abs(v.braco - this.BRACO_PARADO) < 6) {
          this.estado = 'segurando';
          this._espera = 0.25;
        }
        break;
      case 'segurando':
        this._espera -= dt;
        if (this._espera <= 0) {
          this.estado = 'soltando';
          this._boca('solta');
          this._duracaoSolta = 0.9 + this.carga * 2.2;
          this._soltou = 0;
          this._aneis = this.carga > 0.62 ? 1 + Math.floor((this.carga - 0.62) * 8) : 0;
          a.bochecha = 0;
          a.cabeca = -7;
          a.palpebra = 0.2;
          a.peito = 0;
          this.som && this.som.soltar(this._duracaoSolta, this.carga);
          this.aoConjurar(this.carga);
        }
        break;
      case 'soltando': {
        this._soltou += dt;
        const k = this._soltou / this._duracaoSolta; // 0 → 1
        const b = this._bocaNaTela();
        const forca = 0.4 + this.carga * 0.9;
        const s = this.svg.getBoundingClientRect().width / 400; // escala do personagem
        if (this._aneis > 0) {
          // anéis primeiro, depois a nuvem
          this._timerAnel = (this._timerAnel || 0) - dt;
          if (this._timerAnel <= 0) {
            this.fumaca.anel(b.x, b.y, { cor: this.cor, raio: 12 * s, vx: 70 * s, vy: -40 * s });
            this._aneis--;
            this._timerAnel = 0.45;
            this._boca(this._aneis % 2 ? 'puxa' : 'solta');
          }
          this._soltou -= dt * 0.7; // aneis não consomem a nuvem toda
        } else {
          this._boca('solta');
          // taxa de partículas por segundo, caindo conforme o fôlego acaba
          this._acumulo = (this._acumulo || 0) + dt * (30 + 70 * forca) * (1 - k * 0.8);
          const qtd = Math.floor(this._acumulo);
          this._acumulo -= qtd;
          if (qtd) this.fumaca.emitir(b.x, b.y + 4 * s, {
            qtd, cor: this.cor,
            vx: (30 + Math.random() * 50) * s * forca,
            vy: (-40 - Math.random() * 50) * s * forca,
            espalha: 50 * s, tamanho: 6 * s, cresce: (20 + forca * 18) * s,
            vida: 2.2 + forca * 1.2, opacidade: 0.7, empuxo: 18 * s,
          });
        }
        if (Math.random() < 0.25 + forca * 0.35) {
          this.fumaca.faisca(b.x, b.y, { cor: this.cor, vx: 80 * s * forca, vy: -60 * s * forca, espalha: 110 * s });
        }
        if (k >= 1) {
          this.estado = 'parado';
          a.magia = 0;
          this._boca('normal');
          a.cabeca = 0;
          a.palpebra = 0;
          this.aoSoltar(this.carga);
          this.carga = 0;
          this.aoCarregar(0);
        }
        break;
      }
    }

    // ---- interpolação suave ----
    const suave = (atual, alvo, vel) => atual + (alvo - atual) * (1 - Math.exp(-vel * dt));
    v.braco = suave(v.braco, a.braco, this.estado === 'descendo' ? 9 : 7);
    v.cabeca = suave(v.cabeca, a.cabeca, 4);
    v.palpebra = suave(v.palpebra, a.palpebra, 8);
    v.bochecha = suave(v.bochecha, a.bochecha, 10);
    v.peito = suave(v.peito, a.peito, 3);
    v.led = suave(v.led, a.led, 14);
    v.magia = suave(v.magia, a.magia, this.estado === 'soltando' ? 1.5 : 6);

    // piscadas automáticas
    this.proximaPiscada -= dt;
    if (this.proximaPiscada <= 0) { this.piscar = 1; this.proximaPiscada = 2.5 + Math.random() * 3.5; }
    this.piscar = Math.max(0, this.piscar - dt * 7);
    const piscada = Math.sin(this.piscar * Math.PI);

    this._render(Math.max(v.palpebra, piscada));
    requestAnimationFrame(this._quadro);
  }

  _render(palpebra) {
    const e = this.el, v = this.v;
    const respira = Math.sin(this.tempo * 1.6) * 0.008;

    e.braco.setAttribute('transform', `rotate(${v.braco.toFixed(2)} 300 460)`);

    const segue = this.estado === 'parado' ? 1 : 0.3;
    const inclina = v.cabeca + this.olhar.x * 3 * segue;
    const sobe = Math.sin(this.tempo * 1.6) * 1.2;
    e.cabeca.setAttribute('transform', `translate(0 ${sobe.toFixed(2)}) rotate(${inclina.toFixed(2)} 200 330)`);

    const sy = 1 + respira + v.peito * 0.045;
    const sx = 1 + v.peito * 0.02;
    e.corpo.setAttribute('transform', `translate(200 500) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(-200 -500)`);

    // olhos seguem o cursor
    const ox = (this.olhar.x * 4 * segue).toFixed(2), oy = (this.olhar.y * 2.5 * segue).toFixed(2);
    e.pupE.setAttribute('transform', `translate(${ox} ${oy})`);
    e.pupD.setAttribute('transform', `translate(${ox} ${oy})`);

    // pálpebras: altura 0 (aberto) até 22 (fechado)
    const h = (palpebra * 22).toFixed(2);
    e.palE.setAttribute('height', h);
    e.palD.setAttribute('height', h);
    const yc = 214 + palpebra * 22;
    const curva = 9 - palpebra * 12;
    e.cilE.setAttribute('d', `M152 ${yc.toFixed(1)} Q168 ${(yc - curva).toFixed(1)} 184 ${yc.toFixed(1)}`);
    e.cilD.setAttribute('d', `M216 ${yc.toFixed(1)} Q232 ${(yc - curva).toFixed(1)} 248 ${yc.toFixed(1)}`);

    // sobrancelhas relaxam enquanto puxa
    const sb = palpebra * 3;
    e.sobE.setAttribute('transform', `translate(0 ${sb.toFixed(2)})`);
    e.sobD.setAttribute('transform', `translate(0 ${sb.toFixed(2)})`);

    // bochechas estufadas
    const bs = 1 + v.bochecha * 0.45;
    const bo = 0.28 + v.bochecha * 0.35;
    for (const [el, cx] of [[e.bocE, 158], [e.bocD, 242]]) {
      el.setAttribute('transform', `translate(${cx} 262) scale(${bs.toFixed(3)}) translate(${-cx} -262)`);
      el.setAttribute('opacity', bo.toFixed(3));
    }

    // LED do pod
    e.ledBrilho.setAttribute('opacity', v.led.toFixed(3));
    e.led.setAttribute('fill', v.led > 0.3 ? '#fff' : '#2a2540');

    // cajado balança, orbe pulsa e cresce com a carga, olhos brilham no máximo
    if (e.cajado) {
      const balanco = Math.sin(this.tempo * 0.9) * 1.5;
      e.cajado.setAttribute('transform', `rotate(${balanco.toFixed(2)} 66 480)`);
      const pulso = 0.5 + Math.sin(this.tempo * 3) * 0.5;
      e.orbeBrilho.setAttribute('opacity', (0.25 + pulso * 0.1 + v.magia * 0.65).toFixed(3));
      const r = 1 + v.magia * 0.15;
      e.orbeBrilho.setAttribute('transform', `translate(66 -46) scale(${r.toFixed(3)}) translate(-66 46)`);
    }
    if (e.olhoME) {
      const brilho = Math.max(0, (v.magia - 0.75) * 4);
      e.olhoME.setAttribute('opacity', brilho.toFixed(3));
      e.olhoMD.setAttribute('opacity', brilho.toFixed(3));
    }
  }
}

/* ==========================================================
   Som sintetizado (Web Audio): chiado da puxada e sopro.
   Sem arquivos de áudio. Desligado por padrão.
   ========================================================== */
class SomVapor {
  constructor() { this.ligado = false; }

  _iniciar() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const n = this.ctx.sampleRate * 2;
    this.ruido = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = this.ruido.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }

  _fonte(freq, q) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.ruido;
    src.loop = true;
    const filtro = this.ctx.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = freq;
    filtro.Q.value = q;
    const ganho = this.ctx.createGain();
    ganho.gain.value = 0;
    src.connect(filtro).connect(ganho).connect(this.ctx.destination);
    src.start();
    return { src, filtro, ganho };
  }

  puxar() {
    if (!this.ligado) return;
    this._iniciar();
    const t = this.ctx.currentTime;
    this.puxada = this._fonte(5200, 1.4);
    this.puxada.ganho.gain.linearRampToValueAtTime(0.07, t + 0.25);
    this.puxada.filtro.frequency.linearRampToValueAtTime(7000, t + 4);
  }

  pararPuxar() {
    if (!this.puxada) return;
    const t = this.ctx.currentTime, p = this.puxada;
    p.ganho.gain.cancelScheduledValues(t);
    p.ganho.gain.setValueAtTime(p.ganho.gain.value, t);
    p.ganho.gain.linearRampToValueAtTime(0, t + 0.12);
    p.src.stop(t + 0.15);
    this.puxada = null;
  }

  soltar(duracao, forca) {
    if (!this.ligado) return;
    this._iniciar();
    const t = this.ctx.currentTime;
    const s = this._fonte(900, 0.7);
    s.ganho.gain.linearRampToValueAtTime(0.12 + forca * 0.12, t + 0.15);
    s.ganho.gain.linearRampToValueAtTime(0, t + duracao);
    s.filtro.frequency.linearRampToValueAtTime(400, t + duracao);
    s.src.stop(t + duracao + 0.1);
  }
}
