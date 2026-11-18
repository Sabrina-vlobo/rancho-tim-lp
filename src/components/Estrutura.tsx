import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, Bed } from "@phosphor-icons/react/dist/ssr";
import { Reveal, container } from "./ui";
import { estrutura, links } from "@/lib/site";
import salao from "@/images/salao-eventos.jpg";
import pista from "@/images/pista-de-danca.jpg";
import cozinha from "@/images/cozinha.jpg";
import chale from "@/images/chale.jpg";
import piscina from "@/images/piscina.jpg";
import playground from "@/images/playground-areia.jpg";

type Foto = { foto: StaticImageData; alt: string };

// Resumo de uma linha e fotos de cada ambiente, na mesma ordem de site.ts
const extras: { resumo: string; fotos: Foto[] }[] = [
  {
    resumo: "Para mais de 1.000 pessoas",
    fotos: [
      { foto: salao, alt: "Salão de eventos montado com mesas e cadeiras brancas, aberto para a piscina" },
      { foto: pista, alt: "Salão de festas com pista de dança iluminada, palco e caixas de som" },
    ],
  },
  {
    resumo: "Cozinha equipada para 30 pessoas",
    fotos: [
      { foto: cozinha, alt: "Cozinha do chalé com fogão a lenha, churrasqueira e azulejos decorados" },
      { foto: chale, alt: "Chalé rústico do Rancho Tim, com varanda e mesa de madeira" },
    ],
  },
  { resumo: "8 camas e colchões extras", fotos: [] },
  {
    resumo: "Piscina de 28.000 litros",
    fotos: [
      { foto: piscina, alt: "Piscina do Rancho Tim com palmeiras e a casa ao fundo" },
      { foto: playground, alt: "Playground infantil com areia, balanço, gangorra e gira-gira" },
    ],
  },
];

// "Suíte 2: 1 cama de casal e 2 camas de solteiro" -> ["Suíte 2", "1 cama de casal e 2 camas de solteiro"]
const dividir = (item: string) => {
  const [nome, ...resto] = item.split(":");
  return [nome.trim(), resto.join(":").trim()] as const;
};

function Suites({ itens }: { itens: string[] }) {
  return (
    <div className="moldura flex flex-col bg-salvia p-4 sm:p-6 lg:h-full lg:p-8">
      <ul className="grid flex-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {itens.slice(0, 3).map((item) => {
          const [nome, camas] = dividir(item);
          const casal = /casal/.test(camas);
          return (
            <li key={item} className="flex flex-col rounded-[14px] bg-fundo p-5 sm:min-h-[240px] sm:p-6">
              <span className="titulo-p text-[22px] text-titulo lg:text-[26px]">{nome}</span>
              <span aria-hidden="true" className="mt-4 flex items-end gap-2 text-titulo sm:mt-auto">
                {casal && <Bed weight="duotone" className="size-[52px] lg:size-[76px]" />}
                <Bed weight="light" className="size-10 lg:size-[58px]" />
                <Bed weight="light" className="size-10 lg:size-[58px]" />
              </span>
              <span className="mt-3 text-[16px] leading-snug text-texto-suave first-letter:uppercase lg:text-[17px]">{camas}</span>
            </li>
          );
        })}
      </ul>
      {itens[3] && (
        <p className="mt-5 text-[16px] text-titulo sm:mt-6">
          <strong className="font-semibold">{dividir(itens[3])[0]}:</strong> {dividir(itens[3])[1]}
        </p>
      )}
    </div>
  );
}

// Abas de ambientes: no desktop a lista fica à esquerda e o ambiente
// escolhido (fotos + detalhes) à direita; no celular as abas viram uma
// fileira rolável em cima.
export function Estrutura() {
  const [ativo, setAtivo] = useState(0);
  const abas = useRef<(HTMLButtonElement | null)[]>([]);
  const espera = useRef<number | undefined>(undefined);

  // Com mouse, passar por cima já troca o ambiente. A pequena espera evita
  // trocas à toa quando o cursor só cruza a lista a caminho de outro lugar.
  const aoEntrar = (i: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(espera.current);
    espera.current = window.setTimeout(() => setAtivo(i), 90);
  };
  const aoSair = () => window.clearTimeout(espera.current);
  useEffect(() => () => window.clearTimeout(espera.current), []);
  const ambientes = estrutura.ambientes;
  const atual = ambientes[ativo];
  const extra = extras[ativo];

  // Setas do teclado trocam de aba (padrão de abas acessíveis)
  const teclado = (e: KeyboardEvent<HTMLButtonElement>) => {
    const passo = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let alvo: number | undefined;
    if (passo) alvo = (ativo + passo + ambientes.length) % ambientes.length;
    if (e.key === "Home") alvo = 0;
    if (e.key === "End") alvo = ambientes.length - 1;
    if (alvo === undefined) return;
    e.preventDefault();
    setAtivo(alvo);
    abas.current[alvo]?.focus();
  };

  return (
    <section id="estrutura" className="border-t border-linha py-20 md:py-40">
      <div className={container}>
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 className="secao-titulo text-titulo">{estrutura.titulo}</h2>
          <p className="mx-auto mt-6 max-w-[34em] text-lg leading-[1.6] text-texto-suave md:text-xl">
            {estrutura.intro}
          </p>
        </Reveal>

        <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:gap-24">
          {/* Abas */}
          <div
            role="tablist"
            aria-label="Ambientes do rancho"
            aria-orientation="vertical"
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:block lg:border-t lg:border-titulo"
          >
            {ambientes.map((amb, i) => {
              const sel = i === ativo;
              return (
                <button
                  key={amb.titulo}
                  ref={(el) => {
                    abas.current[i] = el;
                  }}
                  role="tab"
                  id={`aba-${i}`}
                  aria-selected={sel}
                  aria-controls="painel-ambiente"
                  tabIndex={sel ? 0 : -1}
                  onClick={() => setAtivo(i)}
                  onPointerEnter={aoEntrar(i)}
                  onPointerLeave={aoSair}
                  onKeyDown={teclado}
                  className={[
                    "group text-left transition-[background-color,color,border-color,opacity,scale] duration-200 ease-strong active:scale-[0.98] lg:active:scale-100",
                    // celular: grade 2x2 de botões com título e resumo
                    "flex min-h-[76px] flex-col justify-center rounded-[14px] border px-4 py-3",
                    sel ? "border-titulo bg-titulo text-claro" : "border-linha bg-fundo text-titulo",
                    // desktop: linhas grandes
                    "lg:min-h-0 lg:w-full lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:rounded-none lg:border-0 lg:border-b lg:border-linha lg:bg-transparent lg:px-0 lg:py-7 lg:text-titulo",
                    sel ? "" : "lg:[&_.aba-nome]:text-titulo/60",
                  ].join(" ")}
                >
                  <span className="lg:block">
                    <span className="aba-nome block text-[16px] leading-tight font-semibold transition-colors duration-200 lg:titulo lg:text-[clamp(1.75rem,2.6vw,2.4rem)] lg:leading-[1.05]">
                      {amb.titulo}
                    </span>
                    <span
                      className={`mt-1 block text-[13px] leading-snug lg:mt-2 lg:text-[17px] lg:font-medium lg:text-texto-suave ${
                        sel ? "text-claro/80" : "text-texto-suave"
                      }`}
                    >
                      {extras[i].resumo}
                    </span>
                  </span>
                  <ArrowRight
                    size={24}
                    aria-hidden="true"
                    className={`hidden shrink-0 transition-[opacity,translate] duration-300 ease-strong lg:block ${
                      sel ? "opacity-100" : "-translate-x-2 opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Ambiente escolhido */}
          <div
            id="painel-ambiente"
            role="tabpanel"
            aria-labelledby={`aba-${ativo}`}
            tabIndex={0}
            className="mt-6 rounded-sm lg:mt-0"
          >
            {/* Desktop: as fotos de todos os ambientes ficam empilhadas e a do
                escolhido aparece por cima da anterior (sem tela vazia no meio) */}
            <div className="relative hidden lg:block lg:h-[min(62svh,560px)]">
              {ambientes.map((amb, i) => (
                <div
                  key={amb.titulo}
                  data-ativo={i === ativo || undefined}
                  aria-hidden={i !== ativo}
                  className="camada-ambiente absolute inset-0"
                >
                  {extras[i].fotos.length > 0 ? (
                    <div className="grid h-full grid-cols-[1.45fr_1fr] gap-4">
                      {extras[i].fotos.map((f, j) => (
                        <div key={f.alt} className="moldura relative h-full">
                          <Image
                            src={f.foto}
                            alt={i === ativo ? f.alt : ""}
                            fill
                            sizes={j === 0 ? "(min-width: 1024px) 34vw, 0px" : "(min-width: 1024px) 23vw, 0px"}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Suites itens={amb.itens} />
                  )}
                </div>
              ))}
            </div>

            {/* Celular e tablet: só o ambiente escolhido, com fade suave */}
            <div key={ativo} className="painel-ambiente lg:hidden">
              {extra.fotos.length > 0 ? (
                <div className="trilho -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:-mx-12 md:scroll-px-12 md:px-12">
                  {extra.fotos.map((f) => (
                    <div
                      key={f.alt}
                      className="moldura relative aspect-[4/3] w-[86%] shrink-0 snap-start sm:w-[62%]"
                    >
                      <Image
                        src={f.foto}
                        alt={f.alt}
                        fill
                        sizes="(min-width: 1024px) 0px, (min-width: 640px) 62vw, 86vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Suites itens={atual.itens} />
              )}
            </div>

            <div key={`texto-${ativo}`} className="painel-texto mt-5 md:mt-9">
              {/* o nome e o resumo já aparecem no botão escolhido */}
              <h3 className="sr-only">{atual.titulo}</h3>
              {extra.fotos.length > 0 && (
                <p className="max-w-[38em] text-[17px] leading-[1.6] text-texto-suave md:text-lg">
                  {atual.itens[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center md:mt-20">
          <a
            href={links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group py-2 text-center text-[17px] leading-7 font-semibold text-acento"
          >
            <span className="underline decoration-acento/30 underline-offset-[6px] transition-[text-decoration-color] duration-150 group-hover:decoration-acento">
              {estrutura.linkInstagram}
            </span>
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="ml-1.5 inline align-[-3px] transition-transform duration-200 ease-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
