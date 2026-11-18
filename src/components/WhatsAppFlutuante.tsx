import { useEffect, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { cta, links } from "@/lib/site";

// Aparece depois que o hero (e o botão dele) sai da tela,
// e some de novo na chamada final, que já tem o mesmo botão.
export function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("topo");
    const fim = document.getElementById("localizacao");
    if (!hero || !fim) return;
    const naTela = new Set<Element>([hero]);
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) naTela.add(e.target);
        else naTela.delete(e.target);
      }
      setVisivel(naTela.size === 0);
    });
    io.observe(hero);
    io.observe(fim);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={cta.completo}
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className={[
        "fixed right-5 bottom-5 z-40 hidden size-16 md:grid place-items-center rounded-full bg-acento text-claro shadow-[0_8px_24px_rgb(0_0_0/0.22)] md:right-8 md:bottom-8",
        "transition-[opacity,scale,background-color] duration-200 ease-strong hover:bg-acento-hover active:scale-[0.97]",
        "motion-reduce:transition-[opacity,background-color]",
        visivel
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0 motion-reduce:scale-100",
      ].join(" ")}
    >
      <WhatsappLogo size={30} />
    </a>
  );
}
