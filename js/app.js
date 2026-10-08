/* ==========================================================
   VAPORA — lógica da loja
   ========================================================== */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const dinheiro = (v) => v.toLocaleString(LOJA.idioma, { style: 'currency', currency: LOJA.moeda });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const ler = (k, padrao) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? padrao; } catch (e) { return padrao; } };
  const nomeCat = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nome || id;

  /* ---------- Desenho dos produtos (SVG gerado) ---------- */
  let uid = 0;
  function desenhoProduto(tipo, c1, c2, extra = {}) {
    const g = 'gp' + (++uid);
    const defs = `<defs>
      <linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".6" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      <linearGradient id="${g}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <radialGradient id="${g}s"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    </defs>`;
    const sombra = `<ellipse cx="100" cy="246" rx="58" ry="9" fill="url(#${g}s)"/>`;
    const nome = extra.nome ? `<text x="100" y="${tipo === 'pod' ? 196 : 200}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="11" font-weight="700" fill="#fff" opacity=".9" letter-spacing="1">${esc(extra.nome.toUpperCase())}</text>` : '';
    let corpo = '';
    if (tipo === 'descartavel') {
      corpo = `
        <path d="M84 52 L88 22 Q100 12 112 22 L116 52 Z" fill="#15131d"/>
        <rect x="68" y="46" width="64" height="192" rx="26" fill="url(#${g})"/>
        <rect x="76" y="54" width="10" height="170" rx="5" fill="url(#${g}b)"/>
        <rect x="84" y="78" width="32" height="40" rx="8" fill="#0b0a10" opacity=".85"/>
        <rect x="90" y="86" width="20" height="5" rx="2" fill="${c1}"/>
        <rect x="90" y="95" width="14" height="5" rx="2" fill="#fff" opacity=".7"/>
        <rect x="90" y="104" width="17" height="5" rx="2" fill="#fff" opacity=".4"/>
        <text x="100" y="160" text-anchor="middle" transform="rotate(-90 100 160)" font-family="Space Grotesk,sans-serif" font-size="15" font-weight="700" fill="#fff" opacity=".85" letter-spacing="3">VAPORA</text>
        <rect x="68" y="214" width="64" height="24" rx="12" fill="#000" opacity=".22"/>`;
    } else if (tipo === 'pod') {
      corpo = `
        <rect x="74" y="34" width="52" height="66" rx="14" fill="#fff" opacity=".18" stroke="#fff" stroke-opacity=".35"/>
        <rect x="80" y="62" width="40" height="32" rx="9" fill="${extra.liquido || c1}" opacity=".75"/>
        <path d="M88 36 L91 14 Q100 7 109 14 L112 36 Z" fill="#15131d"/>
        <rect x="56" y="92" width="88" height="146" rx="30" fill="url(#${g})"/>
        <rect x="64" y="100" width="12" height="124" rx="6" fill="url(#${g}b)"/>
        <rect x="80" y="122" width="40" height="26" rx="6" fill="#0b0a10" opacity=".85"/>
        <text x="100" y="140" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="12" font-weight="700" fill="${c1}">25W</text>
        <circle cx="100" cy="170" r="9" fill="#000" opacity=".3"/><circle cx="100" cy="170" r="5" fill="#fff" opacity=".6"/>`;
    } else if (tipo === 'juice') {
      corpo = `
        <rect x="86" y="30" width="28" height="22" rx="4" fill="#15131d"/>
        <path d="M80 50 h40 v20 q20 6 20 26 v128 q0 14 -14 14 h-52 q-14 0 -14 -14 v-128 q0 -20 20 -26 z" fill="${c1}" opacity=".35" stroke="#fff" stroke-opacity=".3"/>
        <rect x="62" y="110" width="76" height="92" rx="6" fill="url(#${g})"/>
        <text x="100" y="140" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="12" font-weight="700" fill="#fff" letter-spacing="2">VAPORA</text>
        <text x="100" y="164" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#fff" opacity=".85">NIC SALT</text>
        <text x="100" y="186" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="#fff" opacity=".7">30ml</text>
        <rect x="68" y="76" width="8" height="140" rx="4" fill="url(#${g}b)"/>`;
    } else if (extra.id === 'case') {
      corpo = `
        <rect x="64" y="40" width="72" height="198" rx="30" fill="none" stroke="${c1}" stroke-width="12"/>
        <rect x="64" y="40" width="72" height="198" rx="30" fill="${c1}" opacity=".12"/>
        <path d="M100 40 C80 10 140 0 128 24" stroke="${c2}" stroke-width="5" fill="none"/>
        <circle cx="100" cy="190" r="10" fill="${c1}" opacity=".6"/>`;
    } else {
      corpo = [70, 112].map((x) => `
        <path d="M${x + 6} 60 L${x + 9} 40 Q${x + 18} 33 ${x + 27} 40 L${x + 30} 60 Z" fill="#15131d"/>
        <rect x="${x}" y="58" width="36" height="160" rx="12" fill="#fff" opacity=".16" stroke="#fff" stroke-opacity=".35"/>
        <rect x="${x + 5}" y="120" width="26" height="92" rx="8" fill="${c1}" opacity=".7"/>
        <rect x="${x + 13}" y="70" width="10" height="60" rx="5" fill="#999" opacity=".5"/>`).join('');
    }
    return `<svg viewBox="0 0 200 260" aria-hidden="true">${defs}${sombra}${corpo}${nome}</svg>`;
  }

  const corDoProduto = (p, sabor) => {
    const s = SABORES[sabor || p.sabores[0]];
    return s ? [s.cor, s.cor2] : ['#8b5cf6', '#22d3ee'];
  };

  /* ---------- Verificação de idade ---------- */
  const idade = $('#idade');
  if (!ler('vapora_18', false)) {
    idade.hidden = false;
    document.body.classList.add('travado');
  }
  $('#idade-sim').onclick = () => {
    guardar('vapora_18', true);
    idade.classList.add('saindo');
    document.body.classList.remove('travado');
    setTimeout(() => (idade.hidden = true), 400);
  };
  $('#idade-nao').onclick = () => { $('#idade-negado').hidden = false; };

  /* ---------- Toasts ---------- */
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    $('#toasts').append(t);
    setTimeout(() => t.classList.add('saindo'), 2400);
    setTimeout(() => t.remove(), 2900);
  }

  /* ---------- Personagem + fumaça ---------- */
  const fumaca = new Fumaca($('#fumaca'));
  const som = new SomVapor();
  let saborAtual = 'grape-ice';
  let puffs = ler('vapora_puffs', 0);
  let recorde = ler('vapora_recorde', 0);
  $('#placar').textContent = puffs;
  $('#recorde').textContent = recorde;

  const anelCarga = $('#puff-carga');
  const CIRC = 2 * Math.PI * 54;
  anelCarga.style.strokeDasharray = CIRC;
  anelCarga.style.strokeDashoffset = CIRC;

  const personagem = new Personagem($('#personagem'), fumaca, {
    cor: SABORES[saborAtual].cor,
    som,
    aoCarregar: (c) => {
      anelCarga.style.strokeDashoffset = CIRC * (1 - c);
      $('#puff').classList.toggle('cheio', c > 0.62);
    },
    aoSoltar: (c) => {
      puffs++;
      const pct = Math.round(c * 100);
      if (pct > recorde) {
        recorde = pct;
        if (usuarioInteragiu && pct >= 40) toast(`Novo recorde: nuvem de ${pct}%! ☁️`);
      }
      $('#placar').textContent = puffs;
      $('#recorde').textContent = recorde;
      guardar('vapora_puffs', puffs);
      guardar('vapora_recorde', recorde);
    },
  });

  window.vapora = { personagem, fumaca }; // útil para depurar no console

  function aplicarSabor(id) {
    saborAtual = id;
    const s = SABORES[id];
    document.documentElement.style.setProperty('--pod-1', s.cor);
    document.documentElement.style.setProperty('--pod-2', s.cor2);
    document.documentElement.style.setProperty('--sabor', s.cor);
    personagem.setCor(s.cor);
    $$('#chips-sabor .chip').forEach((c) => c.setAttribute('aria-checked', c.dataset.sabor === id));
  }

  $('#chips-sabor').innerHTML = Object.entries(SABORES).map(([id, s]) =>
    `<button class="chip" role="radio" data-sabor="${id}" style="--c:${s.cor}" title="${s.nome}"><i></i><span>${s.nome}</span></button>`).join('');
  $('#chips-sabor').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (b) aplicarSabor(b.dataset.sabor);
  });
  aplicarSabor(saborAtual);

  // segurar o botão / espaço
  let usuarioInteragiu = false;
  let ultimaInteracao = performance.now();
  const puffBtn = $('#puff');
  const iniciar = () => { usuarioInteragiu = true; ultimaInteracao = performance.now(); personagem.comecar(); puffBtn.classList.add('ativo'); };
  const parar = () => { ultimaInteracao = performance.now(); personagem.terminar(); puffBtn.classList.remove('ativo'); };
  puffBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); puffBtn.setPointerCapture(e.pointerId); iniciar(); });
  puffBtn.addEventListener('pointerup', parar);
  puffBtn.addEventListener('pointercancel', parar);
  puffBtn.addEventListener('contextmenu', (e) => e.preventDefault());
  let espacoPreso = false;
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || e.repeat || espacoPreso) return;
    if (/INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY/.test(document.activeElement.tagName) && document.activeElement !== puffBtn) return;
    const hero = $('#inicio').getBoundingClientRect();
    if (hero.bottom < 100) return; // só quando o personagem está visível
    e.preventDefault();
    espacoPreso = true;
    iniciar();
  });
  window.addEventListener('keyup', (e) => {
    if (e.code !== 'Space' || !espacoPreso) return;
    espacoPreso = false;
    parar();
  });

  // demonstração automática quando ninguém está mexendo
  const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saboresIds = Object.keys(SABORES);
  setTimeout(() => personagem.automatico(2.2), 1200);
  setInterval(() => {
    if (reduzMovimento || document.hidden || personagem.ocupado) return;
    if (performance.now() - ultimaInteracao < 7000) return;
    if ($('#inicio').getBoundingClientRect().bottom < 0) return;
    if (!usuarioInteragiu) aplicarSabor(saboresIds[(saboresIds.indexOf(saborAtual) + 1) % saboresIds.length]);
    personagem.automatico(1 + Math.random() * 2.6);
  }, 6500);

  // vapor leve seguindo o cursor no hero
  let rastro = 0;
  $('#inicio').addEventListener('pointermove', (e) => {
    if (reduzMovimento || ++rastro % 3) return;
    const r = fumaca.canvas.getBoundingClientRect();
    fumaca.emitir(e.clientX - r.left, e.clientY - r.top, { qtd: 1, cor: SABORES[saborAtual].cor, vx: 0, vy: -20, espalha: 14, tamanho: 6, cresce: 22, vida: 1.6, opacidade: 0.25, empuxo: 10 });
  });

  // som
  $('#som').onclick = () => {
    som.ligado = !som.ligado;
    $('#som').setAttribute('aria-pressed', som.ligado);
    toast(som.ligado ? 'Som ligado 🔊' : 'Som desligado');
  };

  /* ---------- Faixa de sabores ---------- */
  const itensFaixa = Object.values(SABORES).map((s) => `<span style="--c:${s.cor}">${s.nome}</span>`).join('<b>✦</b>');
  $('#faixa').innerHTML = `<div>${itensFaixa}<b>✦</b></div><div>${itensFaixa}<b>✦</b></div>`;

  /* ---------- Catálogo ---------- */
  let filtro = 'todos', ordem = 'relevancia', busca = '';
  $('#filtros').innerHTML = CATEGORIAS.map((c) => {
    const n = c.id === 'todos' ? PRODUTOS.length : PRODUTOS.filter((p) => p.cat === c.id).length;
    return `<button class="filtro" role="tab" data-cat="${c.id}" aria-selected="${c.id === filtro}">${c.nome}<small>${n}</small></button>`;
  }).join('');
  $('#filtros').addEventListener('click', (e) => {
    const b = e.target.closest('.filtro');
    if (!b) return;
    filtro = b.dataset.cat;
    $$('.filtro').forEach((f) => f.setAttribute('aria-selected', f === b));
    renderGrade();
  });
  $('#ordenar').onchange = (e) => { ordem = e.target.value; renderGrade(); };
  let buscaTimer;
  $('#busca').addEventListener('input', (e) => {
    clearTimeout(buscaTimer);
    buscaTimer = setTimeout(() => {
      busca = e.target.value.trim().toLowerCase();
      renderGrade();
      if (busca) $('#produtos').scrollIntoView({ behavior: 'smooth' });
    }, 200);
  });

  const estrelas = (n) => '★★★★★'.slice(0, Math.round(n)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(n));
  const parcela = (v) => `${LOJA.maxParcelas}x de ${dinheiro(v / LOJA.maxParcelas)}`;

  function renderGrade() {
    let lista = PRODUTOS.filter((p) => filtro === 'todos' || p.cat === filtro);
    if (busca) {
      lista = lista.filter((p) => {
        const texto = [p.nome, p.desc, nomeCat(p.cat), ...p.sabores.map((s) => SABORES[s].nome)].join(' ').toLowerCase();
        return texto.includes(busca);
      });
    }
    const ord = {
      menor: (a, b) => a.preco - b.preco,
      maior: (a, b) => b.preco - a.preco,
      puffs: (a, b) => (b.puffs || 0) - (a.puffs || 0),
      nota: (a, b) => b.nota - a.nota,
    }[ordem];
    if (ord) lista = [...lista].sort(ord);

    $('#vazio').hidden = lista.length > 0;
    $('#grade').innerHTML = lista.map((p, i) => {
      const [c1, c2] = corDoProduto(p);
      const desconto = p.de ? Math.round((1 - p.preco / p.de) * 100) : 0;
      return `
      <article class="card" data-id="${p.id}" style="--c:${c1};--i:${i}">
        <div class="card__img">
          ${p.selo ? `<span class="selo">${p.selo}</span>` : ''}
          ${desconto ? `<span class="selo selo--off">-${desconto}%</span>` : ''}
          <div class="card__desenho">${desenhoProduto(p.cat === 'acessorio' ? 'acessorio' : p.cat, c1, c2, { id: p.id })}</div>
          ${p.sabores.length ? `<div class="card__sabores">${p.sabores.map((s) => `<i style="--c:${SABORES[s].cor}" title="${SABORES[s].nome}"></i>`).join('')}</div>` : ''}
        </div>
        <div class="card__corpo">
          <small class="card__cat">${nomeCat(p.cat)}${p.puffs ? ` · ${p.puffs.toLocaleString(LOJA.idioma)} puffs` : ''}</small>
          <h3>${esc(p.nome)}</h3>
          <div class="estrelas"><span>${estrelas(p.nota)}</span> ${p.nota} <small>(${p.avaliacoes})</small></div>
          <div class="precos">${p.de ? `<s>${dinheiro(p.de)}</s>` : ''}<strong>${dinheiro(p.preco)}</strong><small>${parcela(p.preco)}</small></div>
          <div class="card__acoes">
            <button class="btn btn--fantasma btn--peq" data-ver>Detalhes</button>
            <button class="btn btn--primario btn--peq" data-add>Adicionar</button>
          </div>
        </div>
      </article>`;
    }).join('');
  }
  renderGrade();

  $('#grade').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const p = PRODUTOS.find((x) => x.id === card.dataset.id);
    if (e.target.closest('[data-add]')) {
      if (p.sabores.length > 1) return abrirModal(p);
      adicionar(p, p.sabores[0] || null, 1, e.target);
    } else {
      abrirModal(p);
    }
  });

  // inclinação 3D nos cards
  $('#grade').addEventListener('pointermove', (e) => {
    const card = e.target.closest('.card');
    if (!card || e.pointerType !== 'mouse') return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
    card.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
    card.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
  });
  $('#grade').addEventListener('pointerout', (e) => {
    const card = e.target.closest('.card');
    if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
  });

  /* ---------- Modal de produto ---------- */
  const modal = $('#modal');
  let modalProduto = null, modalSabor = null, modalQtd = 1, focoAntes = null;

  function abrirModal(p) {
    focoAntes = document.activeElement;
    modalProduto = p;
    modalSabor = p.sabores[0] || null;
    modalQtd = 1;
    $('#modal-cat').textContent = nomeCat(p.cat);
    $('#modal-nome').textContent = p.nome;
    $('#modal-nota').innerHTML = `<span>${estrelas(p.nota)}</span> ${p.nota} · ${p.avaliacoes} avaliações`;
    $('#modal-desc').textContent = p.desc;
    const specs = [
      p.puffs && ['Puffs', p.puffs.toLocaleString(LOJA.idioma)],
      p.nic && ['Nicotina', p.nic],
      ['Estoque', p.estoque > 10 ? 'Disponível' : `Últimas ${p.estoque} unidades`],
      ['Envio', 'Embalagem discreta'],
    ].filter(Boolean);
    $('#modal-specs').innerHTML = specs.map(([k, v]) => `<li><small>${k}</small><b>${v}</b></li>`).join('');
    $('#modal-sabores-bloco').hidden = !p.sabores.length;
    $('#modal-sabores').innerHTML = p.sabores.map((s) =>
      `<button class="chip" role="radio" data-sabor="${s}" style="--c:${SABORES[s].cor}"><i></i><span>${SABORES[s].nome}</span></button>`).join('');
    $('#modal-preco').innerHTML = `${p.de ? `<s>${dinheiro(p.de)}</s>` : ''}<strong>${dinheiro(p.preco)}</strong><small>${parcela(p.preco)}</small>`;
    atualizarModal();
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('aberto'));
    document.body.classList.add('travado');
    $('#modal-add').focus();
  }

  function atualizarModal() {
    const p = modalProduto;
    const [c1, c2] = corDoProduto(p, modalSabor);
    $('#modal-imagem').style.setProperty('--c', c1);
    $('#modal-imagem').innerHTML = desenhoProduto(p.cat === 'acessorio' ? 'acessorio' : p.cat, c1, c2, { id: p.id });
    $$('#modal-sabores .chip').forEach((c) => c.setAttribute('aria-checked', c.dataset.sabor === modalSabor));
    $('#qtd').textContent = modalQtd;
  }

  function fecharModal() {
    modal.classList.remove('aberto');
    document.body.classList.remove('travado');
    setTimeout(() => (modal.hidden = true), 250);
    focoAntes && focoAntes.focus();
  }

  $('#modal-sabores').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    modalSabor = b.dataset.sabor;
    atualizarModal();
  });
  $('#qtd-menos').onclick = () => { modalQtd = Math.max(1, modalQtd - 1); atualizarModal(); };
  $('#qtd-mais').onclick = () => { modalQtd = Math.min(modalProduto.estoque, modalQtd + 1); atualizarModal(); };
  $('#modal-add').onclick = () => { adicionar(modalProduto, modalSabor, modalQtd); fecharModal(); };
  $('#modal-fechar').onclick = fecharModal;
  modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

  /* ---------- Carrinho ---------- */
  let carrinho = ler('vapora_carrinho', []);

  function adicionar(p, sabor, qtd = 1, origem) {
    const [c1, c2] = corDoProduto(p, sabor);
    const item = {
      chave: p.id + '|' + (sabor || ''),
      id: p.id, nome: p.nome, preco: p.preco, qtd,
      sabor: sabor ? SABORES[sabor].nome : null,
      desenho: { tipo: p.cat === 'acessorio' ? 'acessorio' : p.cat, c1, c2, id: p.id },
    };
    juntar(item);
    voarParaCarrinho(origem, c1);
    toast(`${p.nome}${item.sabor ? ' · ' + item.sabor : ''} adicionado`);
  }

  function juntar(item) {
    const existente = carrinho.find((i) => i.chave === item.chave);
    if (existente) existente.qtd += item.qtd;
    else carrinho.push(item);
    salvarCarrinho();
  }

  function voarParaCarrinho(origem, cor) {
    if (!origem || reduzMovimento) return;
    const a = origem.getBoundingClientRect(), b = $('#abrir-carrinho').getBoundingClientRect();
    const bolha = document.createElement('div');
    bolha.className = 'bolha';
    bolha.style.background = cor;
    bolha.style.left = a.left + a.width / 2 + 'px';
    bolha.style.top = a.top + a.height / 2 + 'px';
    document.body.append(bolha);
    bolha.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(${b.left - a.left - a.width / 2 + b.width / 2}px, ${b.top - a.top - a.height / 2 + b.height / 2}px) translate(-50%,-50%) scale(.3)`, opacity: 0.6 },
    ], { duration: 700, easing: 'cubic-bezier(.5,-.3,.7,1)' }).onfinish = () => {
      bolha.remove();
      $('#abrir-carrinho').animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 300 });
    };
  }

  function salvarCarrinho() {
    guardar('vapora_carrinho', carrinho);
    renderCarrinho();
  }

  function totais() {
    const subtotal = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
    const frete = subtotal === 0 || subtotal >= LOJA.freteGratisAcima ? 0 : LOJA.frete;
    return { subtotal, frete, total: subtotal + frete };
  }

  function renderCarrinho() {
    const n = carrinho.reduce((s, i) => s + i.qtd, 0);
    $('#contador').textContent = n;
    $('#contador').classList.toggle('visivel', n > 0);
    const { subtotal, frete, total } = totais();
    const vazio = carrinho.length === 0;
    $('#carrinho-vazio').hidden = !vazio;
    $('#carrinho-fim').hidden = vazio;
    $('#itens').innerHTML = carrinho.map((i, idx) => `
      <li class="item">
        <div class="item__img" style="--c:${i.desenho.c1}">${desenhoProduto(i.desenho.tipo, i.desenho.c1, i.desenho.c2, { id: i.desenho.id, nome: i.desenho.nome })}</div>
        <div class="item__info">
          <b>${esc(i.nome)}</b>
          ${i.sabor ? `<small>${esc(i.sabor)}</small>` : ''}
          ${i.extra ? `<small>${esc(i.extra)}</small>` : ''}
          <div class="qtd qtd--peq"><button data-menos="${idx}" aria-label="Diminuir">−</button><span>${i.qtd}</span><button data-mais="${idx}" aria-label="Aumentar">+</button></div>
        </div>
        <div class="item__preco"><b>${dinheiro(i.preco * i.qtd)}</b><button class="remover" data-remover="${idx}">Remover</button></div>
      </li>`).join('');
    const falta = LOJA.freteGratisAcima - subtotal;
    $('#frete-texto').innerHTML = falta > 0
      ? `Faltam <b>${dinheiro(falta)}</b> para o frete grátis`
      : '🎉 Você ganhou <b>frete grátis</b>!';
    $('#frete-progresso').style.width = Math.min(100, (subtotal / LOJA.freteGratisAcima) * 100) + '%';
    $('#subtotal').textContent = dinheiro(subtotal);
    $('#frete-valor').textContent = frete ? dinheiro(frete) : 'Grátis';
    $('#total').textContent = dinheiro(total);
    $('#parcelas').textContent = `ou ${parcela(total)} sem juros · ${dinheiro(total * 0.95)} no Pix`;
    linkWhats();
  }

  $('#itens').addEventListener('click', (e) => {
    const d = e.target.dataset;
    if (d.mais !== undefined) carrinho[d.mais].qtd++;
    else if (d.menos !== undefined) { carrinho[d.menos].qtd--; if (carrinho[d.menos].qtd < 1) carrinho.splice(d.menos, 1); }
    else if (d.remover !== undefined) carrinho.splice(d.remover, 1);
    else return;
    salvarCarrinho();
  });

  const gaveta = $('#carrinho'), veu = $('#veu');
  const abrirCarrinho = () => { gaveta.classList.add('aberto'); veu.classList.add('aberto'); gaveta.setAttribute('aria-hidden', 'false'); $('#fechar-carrinho').focus(); };
  const fecharCarrinho = () => { gaveta.classList.remove('aberto'); veu.classList.remove('aberto'); gaveta.setAttribute('aria-hidden', 'true'); };
  $('#abrir-carrinho').onclick = abrirCarrinho;
  $('#fechar-carrinho').onclick = fecharCarrinho;
  veu.onclick = fecharCarrinho;
  $$('[data-fechar]').forEach((b) => b.addEventListener('click', fecharCarrinho));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) fecharModal();
    fecharCarrinho();
  });

  function linkWhats() {
    const { subtotal, frete, total } = totais();
    const linhas = carrinho.map((i) => `• ${i.qtd}x ${i.nome}${i.sabor ? ` (${i.sabor})` : ''}${i.extra ? ` [${i.extra}]` : ''} — ${dinheiro(i.preco * i.qtd)}`);
    const msg = [
      `Olá! Quero fazer este pedido na ${LOJA.nome}:`, '', ...linhas, '',
      `Subtotal: ${dinheiro(subtotal)}`, `Frete: ${frete ? dinheiro(frete) : 'Grátis'}`, `*Total: ${dinheiro(total)}*`, '',
      'Confirmo que tenho 18 anos ou mais.',
    ].join('\n');
    $('#finalizar').href = `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(msg)}`;
  };
  $('#link-whats').href = `https://wa.me/${LOJA.whatsapp}`;
  $('#link-whats').target = '_blank';
  $('#frete-msg').textContent = `acima de ${dinheiro(LOJA.freteGratisAcima)}`;
  renderCarrinho();

  /* ---------- Monte seu pod ---------- */
  const CORES_CORPO = [
    { nome: 'Midnight', c1: '#2b2640', c2: '#0d0b14' },
    { nome: 'Neon Roxo', c1: '#8b5cf6', c2: '#4c1d95' },
    { nome: 'Ice', c1: '#67e8f9', c2: '#0e7490' },
    { nome: 'Rosé', c1: '#f9a8d4', c2: '#be185d' },
    { nome: 'Lima', c1: '#bef264', c2: '#4d7c0f' },
    { nome: 'Gold', c1: '#fcd34d', c2: '#a16207' },
    { nome: 'Chrome', c1: '#e5e7eb', c2: '#6b7280' },
  ];
  const NICOTINAS = [
    { nome: '0mg', extra: 0 }, { nome: '20mg', extra: 0 }, { nome: '35mg', extra: 0 }, { nome: '50mg', extra: 5 },
  ];
  const BASE_MONTE = 159.9, GRAVACAO = 15;
  const monte = { cor: 1, sabor: 'grape-ice', nic: 2, nome: '' };

  $('#monte-cores').innerHTML = CORES_CORPO.map((c, i) =>
    `<button class="amostra" data-i="${i}" style="--c1:${c.c1};--c2:${c.c2}" title="${c.nome}" aria-label="${c.nome}"></button>`).join('');
  $('#monte-sabores').innerHTML = Object.entries(SABORES).map(([id, s]) =>
    `<button class="chip" role="radio" data-sabor="${id}" style="--c:${s.cor}"><i></i><span>${s.nome}</span></button>`).join('');
  $('#monte-nic').innerHTML = NICOTINAS.map((n, i) => `<button data-i="${i}">${n.nome}${n.extra ? ` <small>+${dinheiro(n.extra)}</small>` : ''}</button>`).join('');

  function precoMonte() {
    return BASE_MONTE + NICOTINAS[monte.nic].extra + (monte.nome ? GRAVACAO : 0);
  }
  function renderMonte() {
    const c = CORES_CORPO[monte.cor];
    $('#monte-giro').innerHTML = desenhoProduto('pod', c.c1, c.c2, { liquido: SABORES[monte.sabor].cor, nome: monte.nome });
    $('#monte-preview').style.setProperty('--c', SABORES[monte.sabor].cor);
    $$('#monte-cores .amostra').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.i === monte.cor));
    $$('#monte-sabores .chip').forEach((b) => b.setAttribute('aria-checked', b.dataset.sabor === monte.sabor));
    $$('#monte-nic button').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.i === monte.nic));
    $('#monte-preco').textContent = dinheiro(precoMonte());
  }
  $('#monte-cores').onclick = (e) => { const b = e.target.closest('.amostra'); if (b) { monte.cor = +b.dataset.i; renderMonte(); } };
  $('#monte-sabores').onclick = (e) => { const b = e.target.closest('.chip'); if (b) { monte.sabor = b.dataset.sabor; renderMonte(); } };
  $('#monte-nic').onclick = (e) => { const b = e.target.closest('button'); if (b) { monte.nic = +b.dataset.i; renderMonte(); } };
  $('#monte-nome').oninput = (e) => { monte.nome = e.target.value.trim(); renderMonte(); };
  $('#monte-add').onclick = (e) => {
    const c = CORES_CORPO[monte.cor];
    const extra = [c.nome, NICOTINAS[monte.nic].nome, monte.nome && `gravação "${monte.nome}"`].filter(Boolean).join(' · ');
    juntar({
      chave: ['custom', monte.cor, monte.sabor, monte.nic, monte.nome].join('|'),
      id: 'custom', nome: 'Pod personalizado', preco: precoMonte(), qtd: 1,
      sabor: SABORES[monte.sabor].nome, extra,
      desenho: { tipo: 'pod', c1: c.c1, c2: c.c2, nome: monte.nome },
    });
    voarParaCarrinho(e.target, c.c1);
    toast('Pod personalizado adicionado');
  };
  renderMonte();

  // girar o pod arrastando
  const giro = $('#monte-giro');
  let angulo = 0, arrastando = false, inicioX = 0, anguloInicio = 0, velGiro = 0;
  giro.addEventListener('pointerdown', (e) => { arrastando = true; inicioX = e.clientX; anguloInicio = angulo; giro.setPointerCapture(e.pointerId); });
  giro.addEventListener('pointermove', (e) => { if (!arrastando) return; const novo = anguloInicio + (e.clientX - inicioX) * 0.6; velGiro = novo - angulo; angulo = novo; });
  const soltarGiro = () => { arrastando = false; };
  giro.addEventListener('pointerup', soltarGiro);
  giro.addEventListener('pointercancel', soltarGiro);
  (function girar(t) {
    if (!arrastando) {
      velGiro *= 0.94;
      angulo += velGiro;
      if (Math.abs(velGiro) < 0.05) angulo += (Math.sin(t / 1200) * 18 - angulo) * 0.03;
    }
    const a = Math.max(-70, Math.min(70, ((angulo % 360) + 540) % 360 - 180));
    giro.style.transform = `perspective(900px) rotateY(${a.toFixed(2)}deg) translateY(${(Math.sin(t / 700) * 6).toFixed(2)}px)`;
    requestAnimationFrame(girar);
  })(0);

  /* ---------- Grade de sabores ---------- */
  $('#sabores-grade').innerHTML = Object.entries(SABORES).map(([id, s]) => {
    const n = PRODUTOS.filter((p) => p.sabores.includes(id)).length;
    return `<button class="sabor revelar" data-sabor="${id}" style="--c:${s.cor};--c2:${s.cor2}">
      <span class="sabor__bolha"></span><b>${s.nome}</b><small>${n} produto${n === 1 ? '' : 's'}</small></button>`;
  }).join('');
  $('#sabores-grade').onclick = (e) => {
    const b = e.target.closest('.sabor');
    if (!b) return;
    const s = SABORES[b.dataset.sabor];
    $('#busca').value = s.nome;
    busca = s.nome.toLowerCase();
    filtro = 'todos';
    $$('.filtro').forEach((f) => f.setAttribute('aria-selected', f.dataset.cat === 'todos'));
    renderGrade();
    aplicarSabor(b.dataset.sabor);
    $('#produtos').scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- Avaliações ---------- */
  $('#carrossel').innerHTML = COMENTARIOS.map((c) => `
    <figure class="depoimento">
      <div class="estrelas"><span>${estrelas(c.nota)}</span></div>
      <blockquote>“${esc(c.texto)}”</blockquote>
      <figcaption><span class="avatar">${esc(c.nome[0])}</span><b>${esc(c.nome)}</b><small>${esc(c.cidade)}</small></figcaption>
    </figure>`).join('');
  const rolar = (dir) => { const c = $('#carrossel'); c.scrollBy({ left: dir * c.clientWidth * 0.8, behavior: 'smooth' }); };
  $('#av-ant').onclick = () => rolar(-1);
  $('#av-prox').onclick = () => rolar(1);

  /* ---------- Newsletter ---------- */
  $('#news-form').onsubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    toast('Cupom BEMVINDO10 enviado para seu e-mail ✉️');
  };

  /* ---------- Topo, menu, revelar, contadores ---------- */
  const topo = $('#topo');
  window.addEventListener('scroll', () => topo.classList.toggle('rolado', scrollY > 20), { passive: true });
  $('#hamburguer').onclick = () => {
    const aberto = $('#menu').classList.toggle('aberto');
    $('#hamburguer').setAttribute('aria-expanded', aberto);
  };
  $$('#menu a').forEach((a) => a.addEventListener('click', () => $('#menu').classList.remove('aberto')));

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visivel');
      observador.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  $$('.revelar').forEach((el) => observador.observe(el));

  const contadores = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, fim = +el.dataset.contar, suf = el.dataset.sufixo || '';
      const t0 = performance.now();
      (function passo(t) {
        const k = Math.min(1, (t - t0) / 1600);
        el.textContent = Math.round(fim * (1 - Math.pow(1 - k, 3))).toLocaleString(LOJA.idioma) + suf;
        if (k < 1) requestAnimationFrame(passo);
      })(t0);
      contadores.unobserve(el);
    });
  });
  $$('[data-contar]').forEach((el) => contadores.observe(el));
})();
