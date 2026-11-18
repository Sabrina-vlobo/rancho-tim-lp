import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { InstagramLogo, List, WhatsappLogo, X } from "@phosphor-icons/react/dist/ssr";
import { Botao, Marca, irParaSecao, rolarPara } from "./ui";
import { cta, links, menu, rodape } from "@/lib/site";
import { EVENTO_TOPO, rolagem } from "@/lib/rolagem";

// Header fixo: menu à esquerda, logo no centro, CTA à direita.
// Em cima da foto do hero ele é transparente com texto claro; quando a foto
// sai de baixo dele, ganha fundo claro e texto escuro.
// Abaixo de 1280px os links vão para um menu em tela cheia (botão à esquerda).
export function Header() {
  const [sobreFoto, setSobreFoto] = useState(true);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ouvir = (e: Event) => setSobreFoto((e as CustomEvent<boolean>).detail);
    window.addEventListener(EVENTO_TOPO, ouvir);
    return () => window.removeEventListener(EVENTO_TOPO, ouvir);
  }, []);

  // Menu aberto: trava a rolagem, fecha no Esc, mantém o foco dentro do menu
  useEffect(() => {
    if (!aberto) return;
    const html = document.documentElement;
    rolagem.lenis?.stop();
    html.style.overflow = "hidden";

    const focaveis = () =>
      [
        botaoMenu.current,
        ...(painel.current?.querySelectorAll<HTMLElement>("a[href]") ?? []),
      ].filter(Boolean) as HTMLElement[];
    focaveis()[1]?.focus();

    const teclado = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
      if (e.key !== "Tab") return;
      const lista = focaveis();
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    // Se a tela crescer até o layout com links, o menu fecha sozinho
    const largura = window.matchMedia("(min-width: 1280px)");
    const fecharSeLargo = () => largura.matches && setAberto(false);

    document.addEventListener("keydown", teclado);
    largura.addEventListener("change", fecharSeLargo);
    return () => {
      document.removeEventListener("keydown", teclado);
      largura.removeEventListener("change", fecharSeLargo);
      html.style.overflow = "";
      rolagem.lenis?.start();
      botaoMenu.current?.focus({ preventScroll: true });
    };
  }, [aberto]);

  const irDoMenu = (e: MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.getAttribute("href")?.replace("#", "");
    if (!id) return;
    e.preventDefault();
    setAberto(false);
    // espera o menu destravar a rolagem antes de rolar
    window.setTimeout(() => rolarPara(id), 60);
  };

  const claro = sobreFoto || aberto;

  return (
    <header
      data-header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-300 ease-strong",
        claro
          ? "text-claro"
          : "bg-fundo text-titulo shadow-[0_1px_0_var(--color-linha)]",
      ].join(" ")}
    >
      {/* Em cima da foto do hero o conteúdo desce e se afasta das laterais,
          para não ficar colado nas bordas da moldura */}
      <div
        className={[
          "relative z-10 grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[84px]",
          "transition-[translate,padding] duration-300 ease-strong motion-reduce:transition-none",
          claro && !aberto
            ? "translate-y-1.5 px-4 md:translate-y-3 md:px-12 xl:px-[96px]"
            : "px-3 md:px-8 xl:px-[72px]",
        ].join(" ")}
      >
        {/* Esquerda: botão do menu (até 1279px) ou links (1280px+) */}
        <div className="flex items-center">
          <button
            ref={botaoMenu}
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-tela-cheia"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="grid size-11 place-items-center rounded-full transition-[background-color,scale] duration-150 ease-strong hover:bg-current/10 active:scale-[0.94] xl:hidden"
          >
            {aberto ? <X size={26} /> : <List size={26} />}
          </button>

          <nav aria-label="Seções" className="hidden items-center gap-9 xl:flex">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={irParaSecao}
                className="rolo text-[15px] font-medium"
              >
                <span>{item.rotulo}</span>
                <span aria-hidden="true">{item.rotulo}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Centro: logo */}
        <a
          href="#topo"
          onClick={aberto ? irDoMenu : irParaSecao}
          aria-label="Rancho Tim, início"
          className="justify-self-center rounded-sm"
        >
          <Marca claro={claro} />
        </a>

        {/* Direita: CTA (texto no tablet/desktop, ícone no celular) */}
        <div className="flex justify-end">
          <Botao
            href={links.whatsapp}
            estilo={claro ? "claro" : "primario"}
            tamanho="sm"
            className="max-md:hidden"
            icone={<WhatsappLogo size={20} />}
          >
            {cta.curto}
          </Botao>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={cta.completo}
            className={[
              "grid size-11 place-items-center rounded-full transition-[background-color,color,scale] duration-200 ease-strong active:scale-[0.94] md:hidden",
              claro ? "bg-claro text-escuro" : "bg-acento text-claro",
            ].join(" ")}
          >
            <WhatsappLogo size={22} />
          </a>
        </div>
      </div>

      {/* Menu em tela cheia (celular e tablet) */}
      <div
        ref={painel}
        id="menu-tela-cheia"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!aberto}
        data-aberto={aberto || undefined}
        className="menu-tela fixed inset-0 flex flex-col overflow-y-auto bg-escuro-2 px-5 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] text-claro md:px-8 md:pt-32 xl:hidden"
      >
        <nav aria-label="Seções">
          <ul className="border-t border-claro/15">
            {menu.map((item, i) => (
              <li
                key={item.href}
                className="menu-item border-b border-claro/15"
                style={{ "--i": i } as CSSProperties}
              >
                <a
                  href={item.href}
                  onClick={irDoMenu}
                  className="titulo flex min-h-[68px] items-center text-[clamp(2rem,8vw,3rem)] leading-none"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="menu-item mt-auto pt-10"
          style={{ "--i": menu.length } as CSSProperties}
        >
          <Botao
            href={links.whatsapp}
            className="w-full md:w-auto"
            icone={<WhatsappLogo size={22} />}
          >
            {cta.completo}
          </Botao>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[15px] text-claro/80">
            <span>{rodape.endereco}</span>
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-claro"
            >
              <InstagramLogo size={22} />
              @ranchotim.oficial
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
