import Head from "next/head";
import { House, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Botao, Marca } from "@/components/ui";
import { cta, links } from "@/lib/site";

export default function NaoEncontrada() {
  return (
    <>
      <Head>
        <title>Página não encontrada | Rancho Tim</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="grid min-h-svh place-items-center bg-escuro-2 px-5 text-center text-claro">
        <div>
          <div className="flex justify-center">
            <Marca claro />
          </div>
          <h1 className="titulo mt-12 text-[clamp(2.5rem,7vw,5rem)] leading-none">
            Essa página não existe.
          </h1>
          <p className="mx-auto mt-6 max-w-[26em] text-lg text-claro/85">
            Mas o rancho existe, e a sua data pode estar livre.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Botao href="/" estilo="contorno" icone={<House size={22} />}>
              Voltar ao início
            </Botao>
            <Botao href={links.whatsapp} icone={<WhatsappLogo size={22} />}>
              {cta.completo}
            </Botao>
          </div>
        </div>
      </main>
    </>
  );
}
