/**
 * ====================================================================
 * PORTFOLIO DATA CONFIGURATION (REACT)
 * ====================================================================
 * Seluruh data awal disetel kosong agar dapat dikonfigurasi penuh
 * dari awal melalui Panel Admin CMS (/admin).
 * ====================================================================
 */

export const PORTFOLIO_DATA = {
  // Informasi Profil Fotografer
  profile: {
    name: "",
    tagline: "",
    shortBio: "",
    aboutHeadline: "",
    aboutLong: [],
    location: "",
    email: "",
    whatsapp: "",
    instagram: "",
    youtube: "",
    behance: "",
    heroImage: "",
  },

  // Statistik / Key Numbers
  showStats: false,
  stats: [],

  // Klien & Rekan Kolaborasi
  clients: [],

  // Perjalanan Karir / Milestones
  milestones: [],

  // Kategori Galeri
  categories: [],

  // Overview / Selected Works
  overview: {
    enabled: false,
    title: "",
    subtitle: "",
    photoIds: []
  },

  // Projects / Stories / Series
  projects: [],

  // Video / Motion Works
  videos: [],

  // Galeri Foto
  photos: []
};
