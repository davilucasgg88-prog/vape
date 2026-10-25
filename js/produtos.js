/* ==========================================================
   VAPORA — configuração da loja e catálogo
   Edite este arquivo para trocar produtos, preços e contato.
   ========================================================== */

const LOJA = {
  nome: 'VAPORA',
  whatsapp: '5511999999999', // DDI + DDD + número, só dígitos
  moeda: 'BRL',
  idioma: 'pt-BR',
  frete: 19.9,
  freteGratisAcima: 299,
  maxParcelas: 3,
  descontoPix: 0.06, // 6% de desconto no Pix
};

/* Sabores: a cor pinta a fumaça do personagem e o pod */
const SABORES = {
  'grape-ice':   { nome: 'Grape Ice',        cor: '#a855f7', cor2: '#6d28d9' },
  'mint':        { nome: 'Ice Mint',         cor: '#2dd4bf', cor2: '#0f766e' },
  'watermelon':  { nome: 'Watermelon',       cor: '#fb7185', cor2: '#be123c' },
  'blueberry':   { nome: 'Blueberry Ice',    cor: '#60a5fa', cor2: '#1d4ed8' },
  'mango':       { nome: 'Mango Peach',      cor: '#fbbf24', cor2: '#d97706' },
  'strawberry':  { nome: 'Strawberry Kiwi',  cor: '#f472b6', cor2: '#9d174d' },
  'cola':        { nome: 'Cola Lime',        cor: '#a3e635', cor2: '#4d7c0f' },
  'tobacco':     { nome: 'Gold Tobacco',     cor: '#d6b98c', cor2: '#7c5a2c' },
};

const CATEGORIAS = [
  { id: 'todos',        nome: 'Todos' },
  { id: 'descartavel',  nome: 'Descartáveis' },
  { id: 'pod',          nome: 'Pod recarregável' },
  { id: 'refil',        nome: 'Refis' },
];

/* cat: 'descartavel' | 'pod' | 'refil' | 'juice' | 'acessorio'
   modelo: desenho do aparelho ('lifepod-bateria', 'lifepod-refil', 'ignite-v55', 'ignite-p100', 'ignite-v400')
   cor / cor2: cores do desenho e do card
   preco: preço no cartão (o Pix sai com LOJA.descontoPix de desconto). Use null para "sob consulta".
   de: preço antigo riscado (opcional)
   img: opcional — caminho da foto do produto, ex.: img: 'img/v400.png'. Sem img, aparece o desenho.
   sabores: ids de SABORES (opcional; adicione os sabores que você tem em estoque) */
const PRODUTOS = [
  { id: 'v400', nome: 'Pod Descartável V-Mix V400 - Ignite', marca: 'Ignite', cat: 'descartavel', modelo: 'ignite-v400', img: 'img/ignite-v400.jpg',
    cor: '#d9585a', cor2: '#8f1f22', preco: null, de: null, puffs: 40000, nic: null, selo: 'Lançamento', nota: 5, avaliacoes: 0, estoque: 20,
    sabores: [], desc: 'Descartável Ignite V-Mix V400 com 40.000 puffs e tela que mostra o nível de bateria e de líquido.' },
  { id: 'p100', nome: 'Pod Descartável P100 Pro - Ignite', marca: 'Ignite', cat: 'descartavel', modelo: 'ignite-p100', img: 'img/ignite-p100.png',
    cor: '#b98b64', cor2: '#7a5636', preco: 129.0, de: 154.0, puffs: 10000, nic: null, selo: null, nota: 5, avaliacoes: 0, estoque: 20,
    sabores: [], desc: 'Descartável Ignite P100 Pro com 10.000 puffs.' },
  { id: 'v55', nome: 'Pod Descartável V55 Ultra Thin - Ignite', marca: 'Ignite', cat: 'descartavel', modelo: 'ignite-v55', img: 'img/ignite-v55.png',
    cor: '#7c6cf0', cor2: '#2a2540', preco: 94.0, de: null, puffs: 5500, nic: null, selo: 'Ultra fino', nota: 5, avaliacoes: 0, estoque: 20,
    sabores: [], desc: 'Descartável Ignite V55 Ultra Thin, fino e leve, com 5.500 puffs.' },
  { id: 'lifepod-refil', nome: 'Refil Life Pod Eco - 8000 puffs', marca: 'Life Pod', cat: 'refil', modelo: 'lifepod-refil', img: 'img/lifepod-refil.png',
    cor: '#6f9fe6', cor2: '#3c6fbf', preco: 65.0, de: 89.0, puffs: 8000, nic: '5%', selo: null, nota: 5, avaliacoes: 0, estoque: 20,
    sabores: [], desc: 'Refil para o Life Pod Eco com 8.000 puffs. Encaixa no carregador do Pod Eco.' },
  { id: 'lifepod-bateria', nome: 'Carregador do Pod Eco - Life Pod', marca: 'Life Pod', cat: 'pod', modelo: 'lifepod-bateria', img: 'img/lifepod-carregador.png',
    cor: '#f0a050', cor2: '#1d1d22', preco: 45.0, de: null, puffs: null, nic: null, selo: 'Recarregável', nota: 5, avaliacoes: 0, estoque: 20,
    sabores: [], desc: 'Bateria recarregável do Life Pod Eco, com cordão. Use com os refis Life Pod Eco.' },
];

/* Comentários de exemplo — troque pelos reais dos seus clientes */
const COMENTARIOS = [
  { nome: 'Rafa M.',   cidade: 'São Paulo',      nota: 5, texto: 'O V400 dura muito, e a tela mostrando a bateria ajuda demais. Chegou em 2 dias.' },
  { nome: 'Bia S.',    cidade: 'Rio de Janeiro', nota: 5, texto: 'Comprei o carregador do Life Pod Eco e já peguei os refis. Atendimento rápido no WhatsApp.' },
  { nome: 'Lucas T.',  cidade: 'Curitiba',       nota: 4, texto: 'O V55 é fininho mesmo, cabe em qualquer bolso.' },
  { nome: 'Camila R.', cidade: 'Belo Horizonte', nota: 5, texto: 'Embalagem discreta, tudo lacrado e original. Já é minha terceira compra.' },
  { nome: 'Pedro H.',  cidade: 'Porto Alegre',   nota: 5, texto: 'P100 Pro com preço bom e entrega rápida.' },
];
