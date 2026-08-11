/**
 * Fotos reais da Born Church.
 * Para trocar: envie a nova imagem e substitua o pointer .asset.json.
 */

import p1 from "@/assets/FB_IMG_1786286659387.jpg.asset.json";
import p2 from "@/assets/FB_IMG_1786286673368.jpg.asset.json";
import p3 from "@/assets/FB_IMG_1786286722389.jpg.asset.json";
import p4 from "@/assets/FB_IMG_1786286732843.jpg.asset.json";
import p5 from "@/assets/FB_IMG_1786286769771.jpg.asset.json";
import p6 from "@/assets/FB_IMG_1786286772066.jpg.asset.json";
import p7 from "@/assets/FB_IMG_1786287674453.jpg.asset.json";
import p8 from "@/assets/FB_IMG_1786287686376.jpg.asset.json";
import p10 from "@/assets/FB_IMG_1786287713935.jpg.asset.json";
import p11 from "@/assets/FB_IMG_1786287752458.jpg.asset.json";
import p12 from "@/assets/FB_IMG_1786287767591.jpg.asset.json";
import lider from "@/assets/louvor-lider.jpg.asset.json";

export type Photo = { src: string; alt: string };

export const photos = {
  serieDetox: { src: p1.url, alt: "Arte da Série Detox da Born Church" },
  oracaoMulher: { src: p2.url, alt: "Mulher em oração durante o culto" },
  imposicaoMaos: { src: p3.url, alt: "Momento de oração com imposição de mãos" },
  louvorHomem: { src: p4.url, alt: "Ministro de louvor com a mão levantada" },
  louvorMulher: { src: p5.url, alt: "Cantora ministrando louvor no culto" },
  adoracao: { src: p6.url, alt: "Homem em adoração com a mão no peito" },
  familia: { src: p7.url, alt: "Pai e filho de mãos dadas na igreja" },
  palavra: { src: p8.url, alt: "Pastora ministrando a Palavra no palco" },
  celebracao: { src: lider.url, alt: "Líder ministrando com a mão levantada no culto" },
  comunhao: { src: p10.url, alt: "Comunhão entre irmãos após o culto" },
  ministracao: { src: p11.url, alt: "Pastor ministrando no púlpito" },
  criancas: { src: p12.url, alt: "Crianças da Born Kids no culto" },
} satisfies Record<string, Photo>;

/** Slideshow do Hero */
export const heroPhotos: Photo[] = [
  photos.celebracao,
  photos.louvorMulher,
  photos.ministracao,
  photos.adoracao,
  photos.palavra,
];

/** Galeria da comunidade */
export const galleryPhotos: Photo[] = [
  photos.louvorHomem,
  photos.criancas,
  photos.imposicaoMaos,
  photos.comunhao,
  photos.oracaoMulher,
  photos.familia,
];
