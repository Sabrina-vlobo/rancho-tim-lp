// Conteúdo e links do site em um lugar só.
// Fonte: claude/lp-estrutura-e-textos.md (v4) + hero da v2 no Figma.

const WHATSAPP_NUMERO = "5516991317191";

const MENSAGEM_PRONTA = [
  "Olá! Vi o site do Rancho Tim e quero consultar uma data.",
  "Data:",
  "Nº de pessoas:",
  "Tipo: fim de semana / festa / day use",
].join("\n");

// LOCALIZAÇÃO
// Endereço: Rodovia MG-187, km 57 (Rodovia Ibiá/Patrocínio).
// Se o pino do Google cair no lugar errado, troque `consulta` pelas coordenadas
// do rancho (ex.: "-19.4801,-46.5412").
// O mapa da última seção e o botão "Abrir no Google Maps" usam este valor.
export const local = {
  endereco: "Rodovia MG-187, km 57 · Rodovia Ibiá/Patrocínio",
  consulta: "Rodovia MG-187, km 57, Ibiá - MG",
  exata: true,
  zoom: 14,
  // Tipo do mapa: "m" = mapa comum, "h" = satélite com nomes de estradas,
  // "k" = só satélite. Relevo/topografia não existe no mapa incorporado
  // gratuito do Google.
  tipo: "m",
};

const consultaMapa = encodeURIComponent(local.consulta);

export const links = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM_PRONTA)}`,
  instagram: "https://instagram.com/ranchotim.oficial",
  maps: `https://www.google.com/maps/search/?api=1&query=${consultaMapa}`,
  mapaEmbed: `https://www.google.com/maps?q=${consultaMapa}&z=${local.zoom}&t=${local.tipo}&hl=pt-BR&output=embed`,
};

export const cta = {
  curto: "Consultar datas",
  completo: "Consultar datas no WhatsApp",
};

export const menu = [
  { rotulo: "Estrutura", href: "#estrutura" },
  { rotulo: "Como reservar", href: "#como-reservar" },
  { rotulo: "Dúvidas", href: "#duvidas" },
  { rotulo: "Localização", href: "#localizacao" },
];

export const hero = {
  titulo: ["O rancho inteiro", "é da sua turma."],
  subtitulo:
    "Piscina, fogão a lenha e espaço de sobra para festa ou descanso, a 7 km de Ibiá.",
};

export const usos = {
  titulo: "Do jeito que você quiser",
  festas: {
    titulo: "Festas e eventos",
    texto:
      "Aniversário, confraternização, casamento no campo. Dois salões, espaço para banda e lugar para mais de 1.000 pessoas.",
  },
  fimDeSemana: {
    titulo: "Fim de semana",
    texto:
      "Chega na sexta, vai embora no domingo. Três suítes, cozinha completa e piscina.",
  },
  dayUse: {
    titulo: "Day use",
    texto: "Só um dia de piscina, churrasco e rede? Também dá.",
  },
  manifesto: {
    linha1: "Sem vizinho pra reclamar do som.",
    linha2: "O pet vem junto e a faxina fica por nossa conta.",
    apoio: "7 km do trevo de Ibiá. Wi-Fi liberado. Pix ou dinheiro.",
  },
};

export const estrutura = {
  titulo: "Tudo o que tem no rancho",
  intro:
    "Espaço para mais de 1.000 pessoas em festas e eventos, e 3 suítes para quem vai dormir.",
  ambientes: [
    {
      titulo: "2 salões de festa",
      itens: [
        "Banheiros feminino e masculino, fogão a lenha, churrasqueira e espaço para banda de show. Cozinha com fogão de 6 bocas com forno e 2 geladeiras.",
      ],
    },
    {
      titulo: "Chalé rústico",
      itens: [
        "Cozinha equipada para 30 pessoas, fogão a lenha, fogão industrial, churrasqueira e ducha na área externa.",
      ],
    },
    {
      titulo: "3 suítes",
      itens: [
        "Suíte 1: 2 camas de solteiro",
        "Suíte 2: 1 cama de casal e 2 camas de solteiro",
        "Suíte 3: 1 cama de casal e 2 camas de solteiro",
        "Colchões extras: 2 de solteiro e 1 de casal",
      ],
    },
    {
      titulo: "Lazer",
      itens: [
        "Piscina de 28.000 litros, 2 duchas, playground infantil com areia, pergolado com redes, estacionamento amplo e Wi-Fi.",
      ],
    },
  ],
  linkInstagram: "Ver mais fotos no Instagram @ranchotim.oficial",
};

export const reserva = {
  titulo: "Reservar é simples",
  texto: "Tudo pelo WhatsApp, em poucas mensagens.",
  passos: [
    {
      titulo: "Chama no WhatsApp",
      texto:
        "Conta a data, quantas pessoas e se é fim de semana, festa ou day use.",
    },
    { titulo: "A gente confirma", texto: "Disponibilidade e valor na hora." },
    { titulo: "Garante com o sinal", texto: "Pagamento por Pix ou dinheiro." },
    {
      titulo: "Combina o horário",
      texto: "Entrada e saída combinadas direto com o locador.",
    },
  ],
};

export const duvidas = {
  titulo: "Dúvidas frequentes",
  texto: "Não achou sua dúvida? Manda no WhatsApp que a gente responde.",
  perguntas: [
    {
      pergunta: "Quanto custa?",
      resposta:
        "O valor depende da data, do tipo de uso e do número de pessoas. Chama no WhatsApp que a gente passa na hora.",
    },
    {
      pergunta: "Posso levar meu pet?",
      resposta: "Pode! O Rancho Tim aceita pets.",
    },
    {
      pergunta: "Pode som alto?",
      resposta:
        "Pode. O rancho fica fora da cidade, então dá pra curtir à vontade.",
    },
    {
      pergunta: "Preciso limpar na saída?",
      resposta: "Não. É só recolher o lixo.",
    },
    {
      pergunta: "Quantas pessoas cabem?",
      resposta:
        "Mais de 1.000 pessoas em festas e eventos. Para dormir são 3 suítes e colchões extras; consulta a capacidade pelo WhatsApp.",
    },
    {
      pergunta: "Qual o horário de entrada e saída?",
      resposta: "É combinado com o locador no momento da reserva.",
    },
    {
      pergunta: "Como garanto a data?",
      resposta: "Com o pagamento do sinal, por Pix ou dinheiro.",
    },
  ],
};

export const final = {
  titulo: "Bora marcar sua data?",
  texto:
    "A 7 km do trevo de Ibiá - MG. Perto o bastante para ir ao mercado, longe o bastante para o som não incomodar ninguém.",
  botaoMapa: "Abrir no Google Maps",
};

export const rodape = {
  endereco: "Rodovia MG-187, km 57 · Rodovia Ibiá/Patrocínio · Ibiá - MG",
  contatos: [
    {
      rotulo: "WhatsApp",
      valor: "(16) 99131-7191",
      detalhe: "Ítalo",
      href: links.whatsapp,
    },
    {
      rotulo: "Telefone",
      valor: "(34) 98855-6343",
      detalhe: "Vânia",
      href: "tel:+5534988556343",
    },
    {
      rotulo: "Instagram",
      valor: "@ranchotim.oficial",
      href: links.instagram,
    },
    { rotulo: "Pagamento", valor: "Pix ou dinheiro" },
  ],
};

// PUBLICAÇÃO
// O endereço e a indexação vêm de variáveis de ambiente (ver README):
//   NEXT_PUBLIC_SITE_URL = https://seu-dominio.com.br
//   NEXT_PUBLIC_INDEXAR  = true   (só na publicação oficial)
// Sem elas (link de teste da Vercel), o site sai com "noindex": o Google
// não indexa a versão de aprovação.
const urlVercel = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "";

export const publicacao = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || urlVercel).replace(/\/$/, ""),
  indexar:
    process.env.NEXT_PUBLIC_INDEXAR === "true" && !!process.env.NEXT_PUBLIC_SITE_URL,
};

export const seo = {
  titulo: "Rancho Tim | Rancho para alugar em Ibiá - MG",
  descricao:
    "Rancho para festas, fim de semana e day use a 7 km de Ibiá - MG. Piscina, 2 salões, fogão a lenha e 3 suítes. Aceita pet e som liberado. Consulte datas no WhatsApp.",
  // Imagem que aparece quando o link é compartilhado (WhatsApp, Instagram...)
  imagem: "/images/og.jpg",
  imagemAlt: "Vista aérea do Rancho Tim ao pôr do sol, em Ibiá - MG",
  corTema: "#233a2d",
};
