import type { NextConfig } from "next";

// Site 100% estático: `npm run build` gera a pasta `out/`, que sobe igual
// na Cloudflare Pages e na Vercel, sem servidor.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  // Na Vercel, o endereço do link de teste (para a prévia no WhatsApp)
  env: {
    NEXT_PUBLIC_VERCEL_URL:
      process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || "",
  },
  images: {
    // Sem servidor não existe o otimizador do Next. As versões WebP de cada
    // foto são geradas no fim do build (scripts/pos-build.mjs) e o loader
    // abaixo aponta para elas.
    loader: "custom",
    loaderFile: "./src/lib/imagem-loader.ts",
    // Larguras geradas para cada foto (o navegador escolhe a menor que serve)
    deviceSizes: [384, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [],
  },
};

export default nextConfig;
