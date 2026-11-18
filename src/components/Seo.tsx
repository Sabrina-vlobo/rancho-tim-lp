import Head from "next/head";
import { duvidas, links, local, publicacao, rodape, seo } from "@/lib/site";

const absoluto = (caminho: string) => (publicacao.url ? `${publicacao.url}${caminho}` : caminho);

// Dados estruturados (schema.org): ajudam o Google a entender o que é o
// rancho, onde fica e como contatar. Só usa informações que já estão no site.
function dadosEstruturados() {
  const negocio = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EventVenue"],
    "@id": absoluto("/#rancho"),
    name: "Rancho Tim",
    description: seo.descricao,
    url: absoluto("/"),
    image: absoluto(seo.imagem),
    telephone: rodape.contatos
      .filter((c) => c.rotulo === "WhatsApp" || c.rotulo === "Telefone")
      .map((c) => `+55 ${c.valor.replace(/[()]/g, "")}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: local.endereco.replace(" · ", ", "),
      addressLocality: "Ibiá",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    hasMap: links.maps,
    sameAs: [links.instagram],
    paymentAccepted: "Pix, Dinheiro",
    maximumAttendeeCapacity: 1000,
    amenityFeature: [
      "Piscina",
      "2 salões de festa",
      "Chalé com fogão a lenha",
      "3 suítes",
      "Playground",
      "Estacionamento",
      "Wi-Fi",
      "Aceita pets",
    ].map((nome) => ({ "@type": "LocationFeatureSpecification", name: nome, value: true })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: duvidas.perguntas.map((p) => ({
      "@type": "Question",
      name: p.pergunta,
      acceptedAnswer: { "@type": "Answer", text: p.resposta },
    })),
  };

  return [negocio, faq];
}

export function Seo() {
  const imagem = absoluto(seo.imagem);
  return (
    <Head>
      <title>{seo.titulo}</title>
      <meta name="description" content={seo.descricao} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content={seo.corTema} />
      <meta name="format-detection" content="telephone=no" />

      {publicacao.indexar ? (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      ) : (
        <meta name="robots" content="noindex, nofollow" />
      )}
      {publicacao.url && <link rel="canonical" href={absoluto("/")} />}

      {/* Compartilhamento (WhatsApp, Instagram, Facebook, LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Rancho Tim" />
      <meta property="og:title" content={seo.titulo} />
      <meta property="og:description" content={seo.descricao} />
      {publicacao.url && <meta property="og:url" content={absoluto("/")} />}
      <meta property="og:image" content={imagem} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seo.imagemAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.titulo} />
      <meta name="twitter:description" content={seo.descricao} />
      <meta name="twitter:image" content={imagem} />

      {/* Local */}
      <meta name="geo.region" content="BR-MG" />
      <meta name="geo.placename" content="Ibiá" />

      <script
        type="application/ld+json"
        // conteúdo gerado aqui mesmo, a partir de site.ts
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados()) }}
      />
    </Head>
  );
}
