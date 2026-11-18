import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";
import { rolagem } from "@/lib/rolagem";

gsap.registerPlugin(ScrollTrigger);

// Rolagem suave no mouse e no trackpad. No toque (celular) o Lenis deixa a
// rolagem nativa, com a inércia do próprio aparelho: é o que a pessoa espera.
export function useRolagemSuave() {
  useEffect(() => {
    // Barra de endereço do celular aparecendo e sumindo não recalcula tudo
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A rolagem suave só começa quando o navegador termina o trabalho do
    // carregamento: a página fica pronta para o toque mais cedo
    let lenis: Lenis | null = null;
    const tick = (tempo: number) => lenis?.raf(tempo * 1000);
    const iniciar = () => {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
      rolagem.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };
    const ocioso = window.requestIdleCallback
      ? window.requestIdleCallback(iniciar, { timeout: 1500 })
      : window.setTimeout(iniciar, 300);

    // Fontes e fotos mudam a altura das seções: recalcula as posições
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Recalcula também quando a largura útil muda (janela, zoom ou a barra
    // de rolagem aparecendo/sumindo), não só no evento de resize
    let largura = document.documentElement.clientWidth;
    let espera: number | undefined;
    const ro = new ResizeObserver(() => {
      const nova = document.documentElement.clientWidth;
      if (nova === largura) return;
      largura = nova;
      window.clearTimeout(espera);
      espera = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.documentElement);
    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

    return () => {
      ro.disconnect();
      window.clearTimeout(espera);
      if (window.cancelIdleCallback) window.cancelIdleCallback(ocioso);
      else window.clearTimeout(ocioso);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      rolagem.lenis = null;
    };
  }, []);
}
