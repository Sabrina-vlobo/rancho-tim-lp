// Roda depois do `next build` (veja "build" no package.json).
// 1. Gera as versões WebP de cada foto nas larguras do next.config.ts
// 2. Escreve robots.txt e sitemap.xml de acordo com as variáveis de ambiente
//
// Variáveis (ver README):
//   NEXT_PUBLIC_SITE_URL  endereço final, ex.: https://ranchotim.com.br
//   NEXT_PUBLIC_INDEXAR   "true" só na publicação oficial (Cloudflare Pages)

import { readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("out");
const MEDIA = path.join(OUT, "_next", "static", "media");
const LARGURAS = [384, 640, 828, 1080, 1280, 1600, 1920]; // = deviceSizes
const QUALIDADE = 76;

async function otimizarImagens() {
  let arquivos = [];
  try {
    arquivos = (await readdir(MEDIA)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  } catch {
    console.log("pos-build: nenhuma imagem em", MEDIA);
    return;
  }

  let antes = 0;
  let depois = 0;
  for (const arquivo of arquivos) {
    const origem = path.join(MEDIA, arquivo);
    antes += (await stat(origem)).size;
    const { width: original = 0 } = await sharp(origem).metadata();

    await Promise.all(
      LARGURAS.map(async (largura) => {
        const destino = origem.replace(/\.(jpe?g|png)$/i, `.w${largura}.webp`);
        // Nunca aumenta a foto: acima da largura original, repete a original
        const info = await sharp(origem)
          .rotate()
          .resize({ width: Math.min(largura, original), withoutEnlargement: true })
          .webp({ quality: QUALIDADE, effort: 5 })
          .toFile(destino);
        if (largura === 1280) depois += info.size;
      }),
    );
  }
  const kb = (n) => `${Math.round(n / 1024)} KB`;
  console.log(
    `pos-build: ${arquivos.length} fotos em ${LARGURAS.length} larguras ` +
      `(originais ${kb(antes)} -> WebP 1280px ${kb(depois)})`,
  );
}

async function robotsESitemap() {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const indexar = process.env.NEXT_PUBLIC_INDEXAR === "true" && url !== "";

  const robots = indexar
    ? `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`
    : `# Versão de teste: fora do Google\nUser-agent: *\nDisallow: /\n`;
  await writeFile(path.join(OUT, "robots.txt"), robots);

  if (indexar) {
    const hoje = new Date().toISOString().slice(0, 10);
    const sitemap =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <url><loc>${url}/</loc><lastmod>${hoje}</lastmod></url>\n` +
      `</urlset>\n`;
    await writeFile(path.join(OUT, "sitemap.xml"), sitemap);
  }
  console.log(`pos-build: robots.txt ${indexar ? `liberado (${url})` : "bloqueando buscadores (teste)"}`);
}

await otimizarImagens();
await robotsESitemap();
