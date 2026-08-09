/**
 * Configurações centrais do site.
 * Altere horários, links de redes sociais, contato e vídeos aqui —
 * todo o site é atualizado automaticamente.
 */

export const siteConfig = {
  name: "Born Church",
  tagline: "Levando pessoas a conhecerem Jesus.",
  social: {
    youtube: "https://youtube.com/@bornagainchurchpinhais?si=5ZCVWw90uLYIrB2K",
    instagram: "https://www.instagram.com/globalchurchpinhais/",
  },
  contact: {
    address: "Rua Rio Paraná, 754 — Weissópolis, Pinhais — PR, 83323-000",
    email: "bornchurch0@gmail.com",
    phone: "(41) 99196-4800",
    phoneHref: "tel:+5541991964800",
    whatsapp: "https://wa.me/5541991964800",
    mapsEmbed:
      "https://www.google.com/maps?q=Rua%20Rio%20Paran%C3%A1%2C%20754%20-%20Weiss%C3%B3polis%2C%20Pinhais%20-%20PR%2C%2083323-000&output=embed",
  },
  pix: {
    label: "PIX (CNPJ)",
    key: "48.891.677/0001-93",
  },
} as const;

/** Horários de culto — fácil de alterar */
export const services = [
  {
    day: "Domingo",
    title: "Culto de Celebração",
    times: ["10h00", "18h00"],
    description:
      "Nosso principal encontro da semana: louvor, palavra e comunhão para toda a família.",
  },
  {
    day: "Quarta-feira",
    title: "Culto de Oração e Fé",
    times: ["20h00"],
    description:
      "Uma noite dedicada à oração, ao ensino da Palavra e ao fortalecimento espiritual.",
  },
  {
    day: "Eventos Especiais",
    title: "Conferências e Encontros",
    times: ["Datas no Instagram"],
    description:
      "Conferências, batismos, encontros de jovens, mulheres e homens ao longo do ano.",
  },
] as const;

/** Vídeos do YouTube — cole apenas o ID do vídeo */
export const sermons = [
  { id: "", title: "Mensagem mais recente" },
  { id: "", title: "Série: Nascido de Novo" },
  { id: "", title: "Culto de Celebração" },
] as const;

/** Áreas e funções disponíveis para servir */
export const serveAreas = [
  {
    id: "midia",
    label: "Mídia",
    roles: [
      "Video maker",
      "Técnico de iluminação",
      "Técnico de transmissão",
      "Operador de projeção",
      "Fotografia",
      "Social media",
    ],
  },
  {
    id: "louvor",
    label: "Louvor",
    roles: [
      "Vocal",
      "Violão / Guitarra",
      "Baixo",
      "Bateria",
      "Teclado",
      "Técnico de som (mesa)",
      "Back vocal",
    ],
  },
  {
    id: "boas-vindas",
    label: "Boas-vindas",
    roles: [
      "Recepção na porta",
      "Acolhimento de visitantes",
      "Estacionamento",
      "Cafeteria",
      "Ofertas e ordem",
    ],
  },
  {
    id: "limpeza",
    label: "Limpeza",
    roles: [
      "Limpeza antes do culto",
      "Limpeza após o culto",
      "Organização do templo",
      "Manutenção",
    ],
  },
] as const;

export const navItems = [
  { label: "Início", to: "/" },
  { label: "Sobre", to: "/sobre" },
  { label: "Cultos", to: "/cultos" },
  { label: "Mensagens", to: "/mensagens" },
  { label: "Servir", to: "/servir" },
  { label: "Conte-nos", to: "/conte-nos" },
  { label: "Ofertas e Dízimos", to: "/ofertas" },
  { label: "Você é novo aqui?", to: "/novo-aqui" },
  { label: "Contato", to: "/contato" },
] as const;
