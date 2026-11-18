import { useEffect, useRef } from "react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Botao, Reveal, container } from "./ui";
import { cta, links, reserva } from "@/lib/site";

// Faixa verde-clara com os quatro passos ligados por uma linha.
// A linha se desenha quando a lista entra na tela (uma vez).
export function ComoReservar() {
  const lista = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.inview = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="como-reservar" className="bg-salvia py-20 md:py-40">
      <div className={container}>
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 className="secao-titulo text-titulo">{reserva.titulo}</h2>
          <p className="mt-6 text-lg leading-[1.6] text-texto-suave md:text-xl">{reserva.texto}</p>
        </Reveal>

        <ol
          ref={lista}
          className="passos relative mt-12 grid gap-8 md:mt-24 lg:grid-cols-4 lg:gap-10"
        >
          {reserva.passos.map((passo, i) => (
            <li
              key={passo.titulo}
              className="passo relative grid grid-cols-[48px_1fr] gap-x-5 lg:block"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="relative z-10 grid size-12 place-items-center rounded-full border-[1.5px] border-titulo bg-salvia text-[15px] font-semibold text-titulo tabular-nums"
              >
                {i + 1}
              </span>
              <div className="pt-2.5 lg:pt-7">
                <h3 className="titulo-p text-[22px] leading-tight text-titulo md:text-2xl">
                  {passo.titulo}
                </h3>
                <p className="mt-2.5 max-w-[24em] text-[17px] leading-[1.6] text-texto-suave">
                  {passo.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center md:mt-20">
          <Botao href={links.whatsapp} icone={<WhatsappLogo size={22} />}>
            {cta.completo}
          </Botao>
        </div>
      </div>
    </section>
  );
}
