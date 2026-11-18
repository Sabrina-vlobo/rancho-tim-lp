import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { rolagem } from "@/lib/rolagem";

/* ---------- Rolar até a seção sem colocar #seção na URL ---------- */

// Rola até a seção. A altura do header fixo é descontada pelo
// scroll-padding-top do globals.css (o Lenis também respeita esse valor).
export function rolarPara(id: string) {
  const alvo = document.getElementById(id);
  if (!alvo) return false;
  const lenis = rolagem.lenis;

  if (id === "topo") {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
  } else if (lenis) {
    lenis.scrollTo(alvo);
  } else {
    alvo.scrollIntoView({ block: "start" });
  }

  // Leva o foco junto, para quem navega pelo teclado ou leitor de tela
  alvo.setAttribute("tabindex", "-1");
  alvo.focus({ preventScroll: true });
  return true;
}

export function irParaSecao(evento: MouseEvent<HTMLAnchorElement>) {
  const id = evento.currentTarget.getAttribute("href")?.replace("#", "");
  if (!id || !document.getElementById(id)) return; // sem o alvo, o link funciona normal
  evento.preventDefault();
  rolarPara(id);
}

/* ---------- Botão ---------- */

const estilos = {
  primario:
    "bg-acento text-claro hover:bg-acento-hover",
  claro: "bg-claro text-escuro hover:bg-white",
  escuro: "bg-escuro text-claro hover:bg-escuro-2",
  contorno:
    "border-[1.5px] border-claro/70 text-claro hover:bg-claro/10",
};

type BotaoProps = {
  href: string;
  estilo?: keyof typeof estilos;
  tamanho?: "md" | "sm";
  icone?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Botao({
  href,
  estilo = "primario",
  tamanho = "md",
  icone,
  children,
  className = "",
}: BotaoProps) {
  const externo = href.startsWith("http");
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={[
        "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap",
        "transition-[scale,background-color] duration-150 ease-strong active:scale-[0.97]",
        tamanho === "md" ? "h-[58px] px-7 text-[17px]" : "h-12 px-5 text-[15px]",
        estilos[estilo],
        className,
      ].join(" ")}
    >
      {icone}
      {children}
    </a>
  );
}

/* ---------- Selo (logo) ---------- */

export function Selo({ className = "" }: { className?: string }) {
  // O traço usa a cor do texto; o sol usa o acento do tema.
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" className={className}>
      <circle cx="22" cy="22" r="20.17" stroke="currentColor" strokeWidth="1.83" />
      <path d="M13.2 29.33a8.8 8.8 0 0 1 17.6 0H13.2Z" fill="var(--sol)" />
      <path
        d="M9.53 27.13 22 16.13l12.47 11"
        stroke="currentColor"
        strokeWidth="2.93"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.07 30.8h27.86" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" />
    </svg>
  );
}

export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 whitespace-nowrap md:gap-3 ${
        claro
          ? "text-claro [--sol:var(--color-acento-claro)]"
          : "text-titulo [--sol:#b5532e]"
      }`}
    >
      <Selo className="size-9 md:size-11" />
      <span className="font-marca text-lg font-semibold tracking-[0.08em] md:text-[22px]">
        RANCHO TIM
      </span>
    </span>
  );
}

/* ---------- Revelação no scroll ---------- */

export function Reveal({
  children,
  atraso = 0,
  className = "",
}: {
  children: ReactNode;
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.dataset.inview = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{ "--d": `${atraso}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ---------- Container padrão ---------- */

export const container = "mx-auto w-full max-w-[1440px] px-5 md:px-12 xl:px-24";
