# VAPORA — loja de pods e vapes

Loja online estática (HTML, CSS e JavaScript puro), sem dependências e sem build.
O destaque é o **personagem animado** no topo: ele levanta o pod, puxa (o LED acende, os olhos fecham e o peito enche), abaixa o braço, segura com as bochechas estufadas e solta a fumaça pela boca.

## O personagem
- **Segure o botão "SEGURE"** (ou a barra de espaço) para puxar; quanto mais tempo, maior a nuvem
- Puxadas com mais de ~2,5s soltam **anéis de fumaça** antes da nuvem
- A fumaça é desenhada em `<canvas>` com partículas (empuxo, turbulência e crescimento) e ganha **a cor do sabor** escolhido
- Os olhos seguem o cursor, ele pisca e respira sozinho, e faz puffs de demonstração quando ninguém mexe
- Som de puxada e de sopro gerado na hora (Web Audio), ligado no botão de alto-falante
- Placar de puffs e da maior nuvem salvo no navegador

## Loja
- Verificação de idade (18+) na entrada e avisos sobre nicotina
- Catálogo com filtro por categoria, busca (por nome ou sabor) e ordenação
- Cards com inclinação 3D; desenhos dos produtos gerados em SVG na cor de cada sabor
- Detalhe do produto (modal) com escolha de sabor e quantidade
- **Monte seu pod**: cor do corpo, sabor, nicotina e nome gravado, com prévia que gira ao arrastar
- Carrinho lateral com barra de frete grátis, parcelamento, Pix e persistência no navegador
- Finalização do pedido pelo WhatsApp com o resumo completo
- Avaliações, FAQ, newsletter e layout responsivo

## Como usar
Abra `index.html` no navegador ou sirva a pasta:

```bash
python3 -m http.server 8000
```

## Personalizar
Edite `js/produtos.js`:
- `LOJA.whatsapp` (DDI+DDD+número), `LOJA.frete`, `LOJA.freteGratisAcima`, `LOJA.maxParcelas`
- `SABORES` — nome e cores (pintam a fumaça, o pod do personagem e os produtos)
- `CATEGORIAS` e `PRODUTOS`
- `COMENTARIOS` — os atuais são exemplos; troque pelos reais

Arquivos:
- `js/personagem.js` — animação do personagem e o som
- `js/fumaca.js` — motor de partículas da fumaça
- `js/app.js` — loja (catálogo, carrinho, monte seu pod etc.)
- `css/style.css` — cores no topo (`--roxo`, `--ciano`, `--rosa`)

> Confira a legislação da sua região antes de vender. No Brasil, a Anvisa (RDC 855/2024) proíbe a fabricação, importação, comercialização, distribuição e propaganda de cigarros eletrônicos.
