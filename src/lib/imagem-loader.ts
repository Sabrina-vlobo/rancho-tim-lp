// Loader do next/image para o site estático.
// No build, scripts/pos-build.mjs cria, para cada foto em /_next/static/media,
// arquivos WebP nas larguras de `deviceSizes` (next.config.ts):
//   hero-rancho.abc123.jpg -> hero-rancho.abc123.w1280.webp
// Aqui só trocamos o nome do arquivo pela versão da largura pedida.
// No `npm run dev` esses arquivos não existem, então usamos a foto original.

type Props = { src: string; width: number; quality?: number };

export default function imagemLoader({ src, width }: Props) {
  if (process.env.NODE_ENV === "development") return src;
  if (!/^\/_next\/static\/media\/.+\.(jpe?g|png)$/i.test(src)) return src;
  return src.replace(/\.(jpe?g|png)$/i, `.w${width}.webp`);
}
