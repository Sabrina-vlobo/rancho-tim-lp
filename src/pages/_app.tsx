import type { AppProps } from "next/app";
// Archivo (títulos e texto) e Oswald só no nome do logo
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/oswald";
import "lenis/dist/lenis.css";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
