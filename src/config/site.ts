/**
 * Configurações centrais do site.
 * Altere horários, links de redes sociais, contato e vídeos aqui —
 * todo o site é atualizado automaticamente.
 */

export const siteConfig = {
  name: "Born Church",
  tagline: "Levando pessoas a conhecerem Jesus.",
  highlight: "O novo começa agora",

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
    times: ["10h00", "18h30 às 21h00"],
    description:
      "Nosso principal encontro da semana: louvor, palavra e comunhão para toda a família.",
  },
  {
    day: "Quarta-feira",
    title: "Quarta Profética",
    times: ["20h00"],
    description:
      "Uma noite de oração, palavra profética e fé para receber direção de Deus e renovar as forças.",
  },
  {
    day: "Quinta-feira",
    title: "Set Prayer",
    times: ["22h00"],
    description:
      "Um set de oração na madrugada da fé: intercessão, adoração e busca pela presença de Deus.",
  },
  {
    day: "Sexta-feira",
    title: "Torre de Oração",
    times: ["20h00"],
    description:
      "Nossa torre de intercessão pela igreja, pelas famílias e pela cidade de Pinhais.",
  },
  {
    day: "Sábado",
    title: "Purpose",
    times: ["19h30"],
    description:
      "Encontro de jovens: louvor, palavra e amizade para viver o propósito de Deus.",
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

/** Mapa dos ministérios */
export const ministries = [
  {
    id: "jovens",
    name: "Born Youth",
    summary: "Jovens vivendo uma fé real, com encontros, louvor e discipulado.",
    when: "Sábados, 19h30",
  },
  {
    id: "criancas",
    name: "Born Kids",
    summary: "Ensino bíblico lúdico e seguro para crianças durante os cultos.",
    when: "Domingos, 10h e 18h30",
  },
  {
    id: "louvor",
    name: "Louvor e Adoração",
    summary: "Banda, vocal e técnica conduzindo a igreja à presença de Deus.",
    when: "Ensaios às sextas",
  },
  {
    id: "midia",
    name: "Mídia e Comunicação",
    summary: "Transmissão, fotografia, projeção, social media e iluminação.",
    when: "Escala por culto",
  },
  {
    id: "acao-social",
    name: "Ação Social",
    summary: "Cestas básicas, visitas e projetos que servem a cidade de Pinhais.",
    when: "Mensal",
  },
  {
    id: "acolhimento",
    name: "Acolhimento",
    summary: "Recepção, boas-vindas e cuidado com quem chega pela primeira vez.",
    when: "Todos os cultos",
  },
] as const;

/** Próximo evento — usado na contagem regressiva */
export const nextEvent = {
  title: "Série Detox — Domingo",
  date: "2026-08-16T13:00:00.000Z", // 10h (horário de Brasília)
  location: "Templo Born Church — Pinhais",
} as const;

/** Versículo do dia — muda automaticamente a cada dia */
export const verses = [
  { text: "Se alguém está em Cristo, é nova criação. As coisas antigas já passaram.", ref: "2 Coríntios 5:17" },
  { text: "Posso todas as coisas naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" },
  { text: "Buscai primeiro o Reino de Deus e a sua justiça.", ref: "Mateus 6:33" },
  { text: "Eis que faço uma coisa nova; agora mesmo vai surgir.", ref: "Isaías 43:19" },
  { text: "Tudo coopera para o bem daqueles que amam a Deus.", ref: "Romanos 8:28" },
  { text: "Não temas, porque eu sou contigo.", ref: "Isaías 41:10" },
  { text: "A tua palavra é lâmpada para os meus pés.", ref: "Salmos 119:105" },
  { text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmos 46:1" },
  { text: "Confia no Senhor de todo o teu coração.", ref: "Provérbios 3:5" },
  { text: "Servi ao Senhor com alegria.", ref: "Salmos 100:2" },
  { text: "O amor jamais acaba.", ref: "1 Coríntios 13:8" },
  { text: "Vinde a mim, todos os que estais cansados e sobrecarregados.", ref: "Mateus 11:28" },
  { text: "Grandes coisas fez o Senhor por nós, por isso estamos alegres.", ref: "Salmos 126:3" },
] as const;

export const navItems = [
  { label: "Início", to: "/" },
  { label: "Sobre", to: "/sobre" },
  { label: "Cultos", to: "/cultos" },
  { label: "Ministérios", to: "/ministerios" },
  { label: "Mensagens", to: "/mensagens" },
  { label: "Próximo Passo", to: "/proximo-passo" },
  { label: "Servir", to: "/servir" },
  { label: "Conte-nos", to: "/conte-nos" },
  { label: "Ofertas", to: "/ofertas" },
  { label: "Novo aqui?", to: "/novo-aqui" },
  { label: "Contato", to: "/contato" },
] as const;

