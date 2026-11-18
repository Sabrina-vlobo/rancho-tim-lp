import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal, container } from "./ui";
import { duvidas, links } from "@/lib/site";

// Coluna única e centralizada, como o "Useful information" do Vineyard
export function Duvidas() {
  return (
    <section id="duvidas" className="py-20 md:py-40">
      <div className={container}>
        <Reveal className="text-center">
          <h2 className="secao-titulo text-titulo">{duvidas.titulo}</h2>
        </Reveal>

        {/* <details name> fecha a pergunta anterior ao abrir outra, sem JavaScript */}
        <div className="mx-auto mt-10 max-w-[820px] border-t border-titulo md:mt-20">
          {duvidas.perguntas.map((item, i) => (
            <details
              key={item.pergunta}
              name="duvidas"
              open={i === 0}
              className="group border-b border-linha"
            >
              <summary className="titulo-p flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-xl leading-7 text-titulo transition-colors duration-150 hover:text-acento md:text-[22px] [&::-webkit-details-marker]:hidden">
                {item.pergunta}
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-linha transition-[rotate,background-color,border-color] duration-200 ease-strong group-open:rotate-45 group-open:border-titulo group-open:bg-titulo group-open:text-claro motion-reduce:transition-none"
                >
                  <Plus size={18} />
                </span>
              </summary>
              <p className="max-w-[40em] pr-14 pb-7 text-[17px] leading-[1.65] text-texto-suave md:text-lg">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-center text-lg text-texto-suave">
          Não achou sua dúvida?{" "}
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-acento underline decoration-acento/30 underline-offset-[6px] transition-[text-decoration-color] duration-150 hover:decoration-acento"
          >
            Manda no WhatsApp
          </a>{" "}
          que a gente responde.
        </p>
      </div>
    </section>
  );
}
