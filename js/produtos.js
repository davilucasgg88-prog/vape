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
  maxParcelas: 6,
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
  { id: 'pod',          nome: 'Pods recarregáveis' },
  { id: 'juice',        nome: 'Juices & Salts' },
  { id: 'acessorio',    nome: 'Acessórios' },
];

/* tipo: 'descartavel' | 'pod' | 'juice' | 'acessorio' (define o desenho do produto) */
const PRODUTOS = [
  { id: 'cloud-8k',   nome: 'Vapora Cloud 8K',     cat: 'descartavel', preco: 89.9,  de: 109.9, puffs: 8000,  nic: '50mg', selo: 'Mais vendido', nota: 4.9, avaliacoes: 1284, estoque: 42,
    sabores: ['grape-ice', 'mint', 'watermelon', 'blueberry', 'mango'], desc: 'Descartável com bobina mesh dupla, tela de bateria e fluxo de ar ajustável. Nuvem densa do primeiro ao último puff.' },
  { id: 'nebula-15k', nome: 'Vapora Nebula 15K',   cat: 'descartavel', preco: 129.9, de: 149.9, puffs: 15000, nic: '50mg', selo: 'Novo', nota: 4.8, avaliacoes: 642, estoque: 30,
    sabores: ['strawberry', 'grape-ice', 'mint', 'cola'], desc: 'Modo Boost para nuvens maiores, display com nível de juice e bateria recarregável USB-C.' },
  { id: 'storm-30k',  nome: 'Vapora Storm 30K',    cat: 'descartavel', preco: 179.9, de: null,  puffs: 30000, nic: '50mg', selo: 'Premium', nota: 4.9, avaliacoes: 318, estoque: 12,
    sabores: ['blueberry', 'watermelon', 'mango', 'tobacco'], desc: 'O maior da linha: 30 mil puffs, dois sabores no mesmo aparelho e tela HD com animações.' },
  { id: 'mini-3k',    nome: 'Vapora Mini 3K',      cat: 'descartavel', preco: 49.9,  de: 59.9,  puffs: 3000,  nic: '20mg', selo: null, nota: 4.6, avaliacoes: 905, estoque: 80,
    sabores: ['mint', 'watermelon', 'strawberry'], desc: 'Compacto, cabe no bolso da calça. Ideal para quem quer leveza e discrição.' },
  { id: 'orbit',      nome: 'Pod Kit Orbit',       cat: 'pod',         preco: 219.9, de: 259.9, puffs: null,  nic: 'livre', selo: 'Recarregável', nota: 4.8, avaliacoes: 412, estoque: 18,
    sabores: ['grape-ice', 'blueberry', 'tobacco'], desc: 'Pod recarregável de 1000mAh com cartuchos de 2ml, ativação por puxada ou botão e potência de 5 a 25W.' },
  { id: 'pulse-pro',  nome: 'Pod Kit Pulse Pro',   cat: 'pod',         preco: 289.9, de: null,  puffs: null,  nic: 'livre', selo: 'Top', nota: 4.9, avaliacoes: 201, estoque: 9,
    sabores: ['mango', 'cola', 'mint'], desc: 'Corpo em alumínio, tela colorida, bateria de 1500mAh e carregamento rápido de 25 minutos.' },
  { id: 'nano',       nome: 'Pod Kit Nano',        cat: 'pod',         preco: 149.9, de: 169.9, puffs: null,  nic: 'livre', selo: null, nota: 4.5, avaliacoes: 377, estoque: 25,
    sabores: ['strawberry', 'watermelon'], desc: 'O pod mais leve da Vapora: 28g, autonomia para o dia todo e cartucho transparente.' },
  { id: 'salt-mint',  nome: 'Juice Salt Ice Mint 30ml',  cat: 'juice', preco: 59.9, de: null, puffs: null, nic: '35mg', selo: null, nota: 4.7, avaliacoes: 520, estoque: 60,
    sabores: ['mint'], desc: 'Nic salt de absorção suave, gelado na medida. Para pods recarregáveis.' },
  { id: 'salt-berry', nome: 'Juice Salt Strawberry Kiwi 30ml', cat: 'juice', preco: 59.9, de: 69.9, puffs: null, nic: '35mg', selo: null, nota: 4.8, avaliacoes: 488, estoque: 54,
    sabores: ['strawberry'], desc: 'Morango maduro com kiwi cítrico. Doce sem enjoar.' },
  { id: 'salt-grape', nome: 'Juice Salt Grape Ice 30ml', cat: 'juice', preco: 59.9, de: null, puffs: null, nic: '20mg', selo: 'Novo', nota: 4.6, avaliacoes: 133, estoque: 40,
    sabores: ['grape-ice'], desc: 'Uva roxa intensa com final gelado.' },
  { id: 'cartucho',   nome: 'Cartucho Orbit (2 un.)', cat: 'acessorio', preco: 39.9, de: null, puffs: null, nic: null, selo: null, nota: 4.7, avaliacoes: 260, estoque: 100,
    sabores: [], desc: 'Par de cartuchos 2ml com bobina mesh 0.8Ω para o Pod Kit Orbit.' },
  { id: 'case',       nome: 'Case Silicone Glow',  cat: 'acessorio', preco: 29.9, de: 39.9, puffs: null, nic: null, selo: null, nota: 4.4, avaliacoes: 98, estoque: 70,
    sabores: [], desc: 'Capa de silicone que brilha no escuro, com cordão removível.' },
];

/* Comentários de exemplo — troque pelos reais dos seus clientes */
const COMENTARIOS = [
  { nome: 'Rafa M.',   cidade: 'São Paulo',      nota: 5, texto: 'O Cloud 8K de Grape Ice é absurdo, durou mais de um mês. Chegou em 2 dias.' },
  { nome: 'Bia S.',    cidade: 'Rio de Janeiro', nota: 5, texto: 'Atendimento pelo WhatsApp super rápido e o pod Orbit é lindo demais.' },
  { nome: 'Lucas T.',  cidade: 'Curitiba',       nota: 4, texto: 'Nebula 15K com o modo Boost faz nuvem gigante. Só queria mais cores.' },
  { nome: 'Camila R.', cidade: 'Belo Horizonte', nota: 5, texto: 'Embalagem discreta, tudo lacrado e original. Já é minha terceira compra.' },
  { nome: 'Pedro H.',  cidade: 'Porto Alegre',   nota: 5, texto: 'Montei meu pod personalizado e ficou exatamente como no site.' },
];
