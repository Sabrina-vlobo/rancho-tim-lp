import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Botao } from "./ui";
import { cta, hero, links } from "@/lib/site";
import { avisarSobreFoto } from "@/lib/rolagem";
import aerea from "@/images/hero-rancho.jpg";

gsap.registerPlugin(ScrollTrigger);

const atraso = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// Divide o texto em palavras, cada uma dentro de uma "janela" que esconde a
// palavra enquanto ela sobe.
function Palavras({ texto }: { texto: string }) {
  return texto.split(" ").map((palavra, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
      <span data-palavra className="inline-block">
        {palavra}
        {" "}
      </span>
    </span>
  ));
}

// Hero com a foto aérea em tela cheia. Ao rolar, a seção fica parada e a foto
// encolhe até uma moldura no meio da tela, com o título da próxima seção
// ("Do jeito que você quiser") aparecendo em volta dela.
// Com "reduzir movimento" ligado, o hero fica estático e a próxima seção
// mostra o título dela normalmente.
export function Hero() {
  const secao = useRef<HTMLElement>(null);
  const moldura = useRef<HTMLDivElement>(null);
  const foto = useRef<HTMLDivElement>(null);
  const veu = useRef<HTMLDivElement>(null);
  const textos = useRef<HTMLDivElement>(null);
  const vaga = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ultimo: boolean | undefined;
    const sobreFoto = (v: boolean) => {
      if (v === ultimo) return;
      ultimo = v;
      avisarSobreFoto(v);
    };
    const alturaHeader = () =>
      document.querySelector<HTMLElement>("[data-header]")?.offsetHeight ?? 72;

    const mm = gsap.matchMedia();
    mm.add(
      {
        animar: "(prefers-reduced-motion: no-preference)",
        reduzir: "(prefers-reduced-motion: reduce)",
        celular: "(max-width: 767px)",
      },
      (ctx) => {
        const { animar, celular } = ctx.conditions as { animar: boolean; celular: boolean };
        ultimo = undefined;

        if (!animar) {
          // Sem animação: o header só troca quando o hero sai de baixo dele
          ScrollTrigger.create({
            trigger: secao.current,
            start: "top top",
            end: () => `bottom top+=${alturaHeader()}`,
            onUpdate: (s) => sobreFoto(s.progress < 1),
            onRefresh: (s) => sobreFoto(s.progress < 1),
          });
          return;
        }

        // Posição da moldura final, lida da "vaga" reservada no layout
        const geo = () => {
          const s = secao.current!.getBoundingClientRect();
          const v = vaga.current!.getBoundingClientRect();
          const cx = v.left - s.left + v.width / 2;
          const cy = v.top - s.top + v.height / 2;
          // A foto encolhe em volta do centro da moldura; a escala precisa
          // cobrir a moldura inteira mesmo quando ela não está no meio da tela
          const escala =
            Math.max(
              v.width / 2 / Math.min(cx, s.width - cx),
              v.height / 2 / Math.min(cy, s.height - cy),
            ) * 1.04;
          return {
            topo: v.top - s.top,
            esq: v.left - s.left,
            dir: s.right - v.right,
            base: s.bottom - v.bottom,
            escala,
            origem: `${cx}px ${cy}px`,
          };
        };

        // No celular a foto começa ocupando a tela toda, sem borda; os cantos
        // arredondados aparecem conforme ela encolhe
        const margem = celular ? 0 : 8;
        const raio0 = celular ? 0 : 24;
        const raio1 = celular ? 18 : 22;
        const inicio = `inset(${margem}px ${margem}px ${margem}px ${margem}px round ${raio0}px)`;
        const palavras = titulo.current!.querySelectorAll("[data-palavra]");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: secao.current,
            start: "top top",
            // No celular o trecho parado é mais curto: a pessoa chega rápido
            // ao conteúdo e não sente que a página "travou"
            end: celular ? "+=70%" : "+=110%",
            scrub: celular ? 0.3 : 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (s) => sobreFoto(s.progress < 0.22),
            onRefresh: (s) => sobreFoto(s.progress < 0.22),
          },
        });

        tl.to(textos.current, { autoAlpha: 0, y: -40, duration: 0.25, ease: "power1.in" }, 0)
          .to(veu.current, { opacity: 0, duration: 0.45 }, 0)
          .fromTo(
            moldura.current,
            { clipPath: inicio },
            {
              clipPath: () => {
                const g = geo();
                return `inset(${g.topo}px ${g.dir}px ${g.base}px ${g.esq}px round ${raio1}px)`;
              },
              duration: 1,
              ease: "power2.inOut",
            },
            0,
          )
          .fromTo(
            foto.current,
            { scale: 1, transformOrigin: () => geo().origem },
            {
              scale: () => geo().escala,
              transformOrigin: () => geo().origem,
              duration: 1,
              ease: "power2.inOut",
            },
            0,
          )
          .fromTo(
            palavras,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.3, stagger: 0.05, ease: "power3.out" },
            0.5,
          );
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={secao}
      id="topo"
      className="relative h-svh min-h-[560px] overflow-hidden bg-fundo"
    >
      {/* Título que aparece em volta da moldura (só com animação) */}
      <div
        ref={titulo}
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-5 pt-16 text-titulo motion-reduce:hidden lg:flex-row lg:gap-8 lg:px-8 lg:pt-[84px] xl:gap-14 xl:px-12"
      >
        <p className="titulo text-center text-[clamp(2.1rem,9.6vw,3.6rem)] leading-[1] lg:flex-1 lg:text-right lg:text-[clamp(2.75rem,4.4vw,5.25rem)]">
          <Palavras texto="Do jeito" />
        </p>
        <div
          ref={vaga}
          className="h-[min(48svh,460px)] w-[min(80vw,420px)] shrink-0 lg:h-[min(54svh,560px)] lg:w-[min(32vw,520px)]"
        />
        <p className="titulo text-center text-[clamp(2.1rem,9.6vw,3.6rem)] leading-[1] lg:flex-1 lg:text-left lg:text-[clamp(2.75rem,4.4vw,5.25rem)]">
          <Palavras texto="que você" />
          <br className="max-lg:hidden" />
          <Palavras texto="quiser" />
        </p>
      </div>

      {/* Foto: começa como o painel arredondado de sempre e encolhe até a vaga */}
      <div
        ref={moldura}
        className="absolute inset-0 overflow-hidden bg-escuro-2 [clip-path:inset(0px_round_0px)] will-change-[clip-path] md:[clip-path:inset(8px_round_24px)]"
      >
        <div ref={foto} className="absolute inset-0 will-change-transform">
          <Image
            src={aerea}
            alt="Vista aérea do Rancho Tim ao pôr do sol, com a casa, a piscina e o campo ao fundo"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            className="hero-foto object-cover object-[50%_40%] md:object-[50%_54%]"
          />
        </div>
        <div
          ref={veu}
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.42)_0%,rgb(0_0_0/0)_22%,rgb(0_0_0/0)_40%,rgb(0_0_0/0.8)_100%)]"
        />
      </div>

      {/* Título e chamada do hero */}
      <div
        ref={textos}
        className="absolute inset-0 flex flex-col justify-end text-claro md:inset-2"
      >
        <div className="grid items-end gap-5 px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:gap-6 md:px-10 md:pb-12 lg:grid-cols-[1fr_380px] lg:gap-16 xl:px-[72px] xl:pb-16">
          <h1
            className="hero-in titulo text-[clamp(2.5rem,6.3vw,5.75rem)] leading-[0.98]"
            style={atraso(120)}
          >
            {hero.titulo[0]}
            <br />
            {hero.titulo[1]}
          </h1>
          <div className="hero-in lg:pb-2" style={atraso(210)}>
            <p className="max-w-[26em] text-[17px] leading-[1.5] text-claro/90 md:text-lg">
              {hero.subtitulo}
            </p>
            <Botao
              href={links.whatsapp}
              className="mt-5 w-full sm:w-auto md:mt-6"
              icone={<WhatsappLogo size={22} />}
            >
              {cta.completo}
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}
