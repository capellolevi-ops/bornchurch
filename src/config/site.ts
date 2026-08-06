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
    address: "Av. Principal, 1000 — Centro, Sua Cidade — UF",
    email: "globalchurch@gmail.com",
    mapsEmbed:
      "https://www.google.com/maps?q=igreja&output=embed",
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

export const navItems = [
  { label: "Início", to: "/" },
  { label: "Sobre", to: "/sobre" },
  { label: "Cultos", to: "/cultos" },
  { label: "Mensagens", to: "/mensagens" },
  { label: "Conte-nos", to: "/conte-nos" },
  { label: "Ofertas e Dízimos", to: "/ofertas" },
  { label: "Você é novo aqui?", to: "/novo-aqui" },
  { label: "Contato", to: "/contato" },
] as const;
