# Rancho Tim · site

Landing page do Rancho Tim, rancho para festas, fim de semana e day use em Ibiá - MG.

Next.js 16 (Pages Router) + Tailwind CSS v4 + TypeScript, com GSAP (animações ligadas à rolagem) e Lenis (rolagem suave). O site é **100% estático**: o build gera a pasta `out/`, que pode ser hospedada em qualquer lugar sem servidor.

| Onde | Para quê | Indexa no Google? |
| --- | --- | --- |
| Vercel | Link de teste, para aprovação do cliente | Não (bloqueado) |
| Cloudflare Pages | Site oficial | Sim |

---

## Rodar no computador

Precisa do Node 20.9 ou mais novo (o projeto usa o 22).

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:3000
```

Para ver exatamente o que vai para o ar:

```bash
npm run build      # gera out/ (site + fotos otimizadas + robots.txt)
npm start          # serve a pasta out/ em http://localhost:3000
```

> No `npm run dev` as fotos aparecem no tamanho original. As versões otimizadas só existem depois do `npm run build`.

---

## Onde mexer

| O que | Arquivo |
| --- | --- |
| Textos, WhatsApp, mensagem pronta, Instagram, endereço do mapa, título e descrição para o Google | `src/lib/site.ts` |
| Cores, fontes, animações e barra de rolagem | `src/styles/globals.css` |
| Seções (uma por arquivo) | `src/components/` |
| Fotos do site (já tratadas) | `src/images/` |
| Imagem do compartilhamento (WhatsApp, Instagram etc.), 1200×630 | `public/images/og.jpg` |
| Ícones (aba do navegador e atalho do celular) | `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png` |

Componentes em `src/components/`:

- `Header.tsx`: menu, logo e botão do WhatsApp; menu em tela cheia no celular
- `Hero.tsx`: foto aérea que encolhe na rolagem
- `Usos.tsx`: "Do jeito que você quiser" (foto fixa no desktop, carrossel no celular) + manifesto
- `Estrutura.tsx`: ambientes (salões, chalé, suítes, lazer) com troca no hover ou toque
- `ComoReservar.tsx`, `Duvidas.tsx`, `Final.tsx` (chamada final, mapa e rodapé)
- `Seo.tsx`: metatags, compartilhamento e dados estruturados para o Google
- `RolagemSuave.tsx`: liga a rolagem suave (Lenis) ao GSAP

### Trocar ou adicionar uma foto

1. Coloque a foto em `src/images/` (JPG, de preferência com 1600 a 2000 px de largura).
2. Importe no componente: `import foto from "@/images/nome.jpg";` e use com `<Image src={foto} ... />`.
3. Escreva um `alt` descrevendo a foto (acessibilidade e Google).

O build cria sozinho as versões WebP em 7 larguras (384 a 1920 px), e cada aparelho baixa só a que precisa.

### Mudar o endereço ou o pino do mapa

Em `src/lib/site.ts`, objeto `local`. Se o pino do Google cair no lugar errado, troque `consulta` pelas coordenadas do rancho (ex.: `"-19.4801,-46.5412"`).

---

## Publicar

### 1. Link de teste na Vercel (aprovação)

**Pelo GitHub (recomendado):**

1. Suba o projeto (a pasta `site/`) para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório.
3. Se o repositório tiver outras pastas, aponte o **Root Directory** para `site`.
4. O framework é detectado como Next.js. Não precisa mudar nada nem cadastrar variáveis.
5. **Deploy**. O link `*.vercel.app` é o link de aprovação.

**Pela linha de comando (sem GitHub):**

```bash
npx vercel          # na pasta site/, responde as perguntas
```

O que já está configurado para o teste:

- `vercel.json` envia o cabeçalho `X-Robots-Tag: noindex` em todas as páginas, e o `robots.txt` gerado bloqueia buscadores. A versão de aprovação nunca aparece no Google.
- A prévia do link no WhatsApp funciona: a imagem de compartilhamento usa o endereço da própria Vercel.

> A Vercel é só para teste. Para usá-la como site oficial, é preciso tirar o `X-Robots-Tag` do `vercel.json`.

### 2. Site oficial na Cloudflare Pages

**Pelo GitHub (recomendado):**

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
2. Configuração do build:

   | Campo | Valor |
   | --- | --- |
   | Framework preset | `Next.js (Static HTML Export)` |
   | Build command | `npm run build` |
   | Build output directory | `out` |
   | Root directory | `site` (se o repositório tiver outras pastas) |

3. Em **Environment variables (Production)**:

   | Variável | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://seu-dominio.com.br` (sem barra no fim) |
   | `NEXT_PUBLIC_INDEXAR` | `true` |

   A versão do Node vem do arquivo `.node-version` (22). Se o painel pedir, cadastre também `NODE_VERSION = 22`.

4. **Save and Deploy**.
5. Em **Custom domains**, ligue o domínio do rancho.

**Pela linha de comando:**

```bash
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br NEXT_PUBLIC_INDEXAR=true npm run build
npx wrangler pages deploy out --project-name rancho-tim
```

O que já está configurado para a Cloudflare:

- `public/_headers`: cache de 1 ano para JS, CSS, fontes e fotos (os nomes mudam a cada build), cabeçalhos de segurança e `noindex` nos endereços de prévia `*.pages.dev`.
- `out/404.html`: página "não encontrada" com a cara do site. A Cloudflare usa sozinha.
- `robots.txt` e `sitemap.xml` gerados com o domínio oficial.

### Como as variáveis mudam o site

| | Sem variáveis (Vercel) | Com variáveis (Cloudflare) |
| --- | --- | --- |
| `<meta name="robots">` | `noindex, nofollow` | `index, follow` |
| `robots.txt` | bloqueia tudo | libera e aponta o sitemap |
| `sitemap.xml` | não é gerado | gerado com o domínio |
| Link canônico | não tem | `https://seu-dominio.com.br/` |
| Imagem de compartilhamento | endereço da Vercel | endereço do domínio |

---

## Checklist antes de publicar

- [ ] Domínio definido e cadastrado em `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_INDEXAR=true` só na Cloudflare
- [ ] Pino do mapa conferido (abrir o site e checar se cai no rancho)
- [ ] Testar o link no WhatsApp: título, descrição e foto aparecem na prévia
- [ ] Depois de no ar: cadastrar o site no [Google Search Console](https://search.google.com/search-console) e enviar o `sitemap.xml`
- [ ] Criar ou atualizar o Perfil da Empresa no Google (Google Maps) com o link do site. É o que mais traz gente que busca "rancho em Ibiá"
- [ ] Conferir no [Rich Results Test](https://search.google.com/test/rich-results) se os dados estruturados foram lidos

---

## SEO e performance (o que já está feito)

**SEO**

- Título e descrição com as palavras que as pessoas buscam ("rancho para alugar em Ibiá - MG", festas, day use, piscina)
- Open Graph e Twitter Card (prévia com foto ao compartilhar)
- Dados estruturados schema.org: `LocalBusiness` + `EventVenue` (endereço, telefones, capacidade, comodidades, Instagram, pagamento) e `FAQPage` com as dúvidas
- `lang="pt-BR"`, link canônico, `robots.txt`, `sitemap.xml` e `theme-color`
- Todas as fotos com texto alternativo

**Performance**

- Site estático, sem servidor: o HTML já chega pronto
- Fotos em WebP com 7 larguras; no celular sai a de 828 px em vez da original
- A foto do hero é pré-carregada; as demais só carregam perto de aparecer
- Fontes com `font-display: swap` e só os caracteres usados
- Rolagem suave liga só depois que a página termina de carregar
- Mapa do Google carrega só quando chega perto da tela
- Com "reduzir movimento" ligado no aparelho, as animações viram transições simples

**Lighthouse** (build final, servido localmente):

| | Performance | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Celular | 93 | 100 | 100 | 100* |
| Desktop | 100 | 100 | 100 | 100* |

\* SEO 100 com as variáveis de publicação. No link de teste fica 66, porque o bloqueio do Google é proposital.

---

## Pendências de conteúdo

- Fotos que faltam: suítes, salões montados para festa e foto aérea em alta resolução (a atual tem 1044 px de largura)
- As fotos do chalé (`cozinha.jpg` e `chale.jpg`) são do lote antigo
