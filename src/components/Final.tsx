import { ArrowUpRight, MapPin, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Botao, Marca, Reveal, container, irParaSecao } from "./ui";
import { cta, final, links, local, menu, rodape } from "@/lib/site";

// Chamada final + mapa, no mesmo verde escuro do rodapé: os dois formam
// um bloco só, que fecha a página.
export function Final() {
  return (
    <section id="localizacao" className="bg-escuro-2 text-claro">
      <div className={`${container} pt-20 pb-16 md:pt-40 md:pb-24`}>
        <Reveal className="mx-auto max-w-[900px] text-center">
          <h2 className="titulo text-[clamp(2.75rem,7vw,6rem)] leading-[0.98]">{final.titulo}</h2>
          <p className="mx-auto mt-7 max-w-[30em] text-lg leading-[1.6] text-claro/85 md:text-xl">
            {final.texto}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Botao href={links.whatsapp} icone={<WhatsappLogo size={22} />}>
              {cta.completo}
            </Botao>
            <Botao href={links.maps} estilo="contorno" icone={<MapPin size={22} />}>
              {final.botaoMapa}
            </Botao>
          </div>
        </Reveal>

        <figure className="mt-12 md:mt-24">
          <div className="moldura bg-escuro">
            <iframe
              src={links.mapaEmbed}
              title="Mapa do Google com a localização do Rancho Tim"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[300px] w-full border-0 sm:h-[340px] lg:h-[400px]"
            />
          </div>
          <figcaption className="mt-4 flex items-start gap-2 text-[15px] text-claro/75">
            <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
            {local.exata ? local.endereco : `Mapa aproximado de ${local.consulta}.`}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Rodape() {
  return (
    <footer className="bg-escuro-2 text-claro">
      <div className={`${container} pb-10`}>
        <div className="grid gap-14 border-t border-claro/15 pt-16 md:pt-20 lg:grid-cols-[1fr_auto] lg:gap-24">
          {/* Atalhos grandes, como no rodapé do Vineyard */}
          <nav aria-label="Rodapé">
            <ul className="space-y-1">
              {menu.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={irParaSecao}
                    className="titulo inline-flex min-h-11 items-center text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.1] text-claro/90 transition-colors duration-150 hover:text-acento-claro"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <dl className="grid grid-cols-2 gap-x-12 gap-y-9 sm:grid-cols-4 lg:grid-cols-2 lg:gap-x-16">
            {rodape.contatos.map((contato) => (
              <div key={contato.rotulo}>
                <dt className="text-sm text-claro/65">{contato.rotulo}</dt>
                <dd className="mt-1.5 text-base font-semibold">
                  {contato.href ? (
                    <a
                      href={contato.href}
                      {...(contato.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex items-center gap-1 underline decoration-claro/0 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-claro/70"
                    >
                      {contato.valor}
                      {contato.href.startsWith("http") && (
                        <ArrowUpRight size={14} aria-hidden="true" className="opacity-60" />
                      )}
                    </a>
                  ) : (
                    contato.valor
                  )}
                </dd>
                {contato.detalhe && <dd className="mt-1 text-sm text-claro/65">{contato.detalhe}</dd>}
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-claro/15 pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-28">
          <Marca claro />
          <p className="text-sm text-claro/65">
            {rodape.endereco}
            <span className="mx-2" aria-hidden="true">·</span>© {new Date().getFullYear()} Rancho Tim
          </p>
        </div>
      </div>
    </footer>
  );
}
