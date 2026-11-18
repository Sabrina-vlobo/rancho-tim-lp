import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal, container } from "./ui";
import { usos } from "@/lib/site";
import casamento from "@/images/casamento.jpg";
import piscina from "@/images/piscina.jpg";
import churrasqueira from "@/images/churrasqueira-salao.jpg";

type Uso = { titulo: string; texto: string; foto: StaticImageData; alt: string };

const lista: Uso[] = [
  {
    ...usos.festas,
    foto: casamento,
    alt: "Cerimônia de casamento ao ar livre no Rancho Tim, com convidados dos dois lados do corredor",
  },
  {
    ...usos.fimDeSemana,
    foto: piscina,
    alt: "Piscina do Rancho Tim com palmeiras e a casa ao fundo",
  },
  {
    ...usos.dayUse,
    foto: churrasqueira,
    alt: "Churrasqueira de tijolinho com bancada de granito",
  },
];

// Três usos do rancho. No desktop a foto fica parada à esquerda (na mesma
// moldura em que o hero terminou) e troca conforme cada uso passa pelo meio
// da tela. No celular cada uso traz a própria foto, em sequência.
export function Usos() {
  const { manifesto } = usos;
  const [ativo, setAtivo] = useState(0);
  const itens = useRef<(HTMLElement | null)[]>([]);

  // Carrossel do celular: qual card está à vista
  const trilho = useRef<HTMLOListElement>(null);
  const [noTrilho, setNoTrilho] = useState(0);
  const aoRolarTrilho = () => {
    const el = trilho.current;
    if (!el || !itens.current[1]) return;
    const passo = itens.current[1].offsetLeft - itens.current[0]!.offsetLeft;
    setNoTrilho(Math.min(lista.length - 1, Math.round(el.scrollLeft / passo)));
  };
  const irPara = (i: number) => {
    const el = trilho.current;
    const alvo = itens.current[i];
    if (!el || !alvo) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: alvo.offsetLeft - itens.current[0]!.offsetLeft, behavior: reduzir ? "auto" : "smooth" });
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtivo(Number((e.target as HTMLElement).dataset.indice));
        }
      },
      // conta como ativo o item que cruza a faixa do meio da tela
      { rootMargin: "-45% 0px -45% 0px" },
    );
    itens.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="usos-titulo" className="pb-20 md:pb-40">
      <div className={container}>
        {/* Com animação, este título aparece em volta da foto do hero;
            aqui ele fica para leitores de tela (e visível sem animação) */}
        <h2
          id="usos-titulo"
          className="secao-titulo pt-20 text-center text-titulo motion-safe:sr-only md:pt-40"
        >
          {usos.titulo}
        </h2>

        <div className="mt-10 grid gap-16 motion-safe:mt-2 lg:mt-16 lg:grid-cols-2 lg:gap-24 lg:motion-safe:mt-0">
          {/* Foto fixa (desktop) */}
          <div className="sticky top-[116px] hidden h-[calc(100svh-160px)] max-h-[820px] lg:block">
            <div className="moldura relative h-full">
              {lista.map((uso, i) => (
                <div
                  key={uso.titulo}
                  data-ativo={i === ativo || undefined}
                  className="uso-foto absolute inset-0"
                  aria-hidden={i !== ativo}
                >
                  <Image
                    src={uso.foto}
                    alt={uso.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 0px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Textos */}
          <ol
            ref={trilho}
            onScroll={aoRolarTrilho}
            aria-label="Formas de usar o rancho"
            className="trilho -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 md:-mx-12 md:scroll-px-12 md:px-12 lg:mx-0 lg:block lg:overflow-visible lg:px-0"
          >
            {lista.map((uso, i) => (
              <li
                key={uso.titulo}
                ref={(el) => {
                  itens.current[i] = el;
                }}
                data-indice={i}
                data-ativo={i === ativo || undefined}
                className="uso-item w-[84%] shrink-0 snap-start sm:w-[62%] lg:flex lg:min-h-[78svh] lg:w-auto lg:items-center"
              >
                <article className="w-full">
                  <div className="moldura relative mb-6 aspect-[4/5] lg:hidden">
                    <Image
                      src={uso.foto}
                      alt={uso.alt}
                      fill
                      sizes="(min-width: 1024px) 0px, (min-width: 640px) 62vw, 84vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="titulo text-[clamp(1.9rem,5vw,4.5rem)] leading-[0.98] text-titulo">
                    {uso.titulo}
                  </h3>
                  <p className="mt-3 max-w-[28em] text-[17px] leading-[1.6] text-texto-suave md:mt-5 md:text-xl">
                    {uso.texto}
                  </p>
                </article>
              </li>
            ))}
          </ol>

          {/* Pontinhos do carrossel (celular e tablet) */}
          <div className="-mt-8 flex justify-center gap-1 lg:hidden">
            {lista.map((uso, i) => (
              <button
                key={uso.titulo}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ver ${uso.titulo}`}
                aria-current={i === noTrilho || undefined}
                className="grid size-11 place-items-center"
              >
                <span
                  className={`block h-2 rounded-full transition-[width,background-color] duration-300 ease-strong ${
                    i === noTrilho ? "w-6 bg-titulo" : "w-2 bg-titulo/25"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Manifesto */}
        <Reveal className="mx-auto mt-20 max-w-[1100px] text-center md:mt-40">
          <p className="titulo text-[clamp(1.75rem,4.6vw,4rem)] leading-[1.06] text-titulo">
            <span className="block">{manifesto.linha1}</span>
            <span className="block text-acento">{manifesto.linha2}</span>
          </p>
          <p className="mt-7 text-lg font-medium text-texto-suave">{manifesto.apoio}</p>
        </Reveal>
      </div>
    </section>
  );
}
