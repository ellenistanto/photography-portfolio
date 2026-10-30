/**
 * ====================================================================
 * PORTFOLIO DATA CONFIGURATION
 * ====================================================================
 * Seluruh data awal disetel kosong agar dapat dikonfigurasi penuh
 * dari awal melalui Panel Admin CMS (/admin).
 * ====================================================================
 */

const PORTFOLIO_DATA = {
  // Informasi Fotografer
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
    photo: "",
    avatar: "",
    heroImage: "",
  },

  // Statistik / Numbers
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

  // Projects
  projects: [],

  // Videos
  videos: [],

  // Daftar Foto
  photos: []
};
