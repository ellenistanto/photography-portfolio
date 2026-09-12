/**
 * ====================================================================
 * PORTFOLIO DATA CONFIGURATION
 * ====================================================================
 * Anda dapat dengan mudah mengubah semua data di file ini:
 * - Mengubah nama, bio, dan kontak WhatsApp / Instagram.
 * - Mengganti foto dengan file lokal (misal: 'assets/images/foto1.jpg')
 *   atau link gambar online lainnya.
 * - Menambah atau menghapus item foto di masing-masing kategori.
 * ====================================================================
 */

const PORTFOLIO_DATA = {
  // Informasi Fotografer
  profile: {
    name: "Ellen Istanto",
    tagline: "Concerts, Portraits, Travel, and Human moments in between.",
    shortBio: "I’m Ellen Istanto, a photographer based in Indonesia. Drawn to moments charged with emotion, I work between motion and stillness — on stage, in portraits, and through travel narratives.",
    aboutLong: [
      "Photography, for me, is an intimate way of bearing witness to life’s fleeting poetry. Over the past seven years, I’ve found myself backstage amidst the raw frenzy of live concerts, in quiet studios capturing honest portraits, and traveling across vibrant landscapes searching for the human pulse.",
      "Every frame is a dialogue between light, timing, and vulnerability. Whether documenting an arena screaming the lyrics of an anthem or a quiet gaze under the Jakarta dusk, my work strives to preserve the feeling as much as the sight."
    ],
    location: "Yogyakarta, Indonesia",
    email: "ellengifaistanto@gmail.com",
    whatsapp: "6289523148500", // Ganti dengan nomor WhatsApp aktif (gunakan kode negara tanpa +)
    instagram: "https://instagram.com/ellenistanto",
    youtube: "https://youtube.com",
    behance: "https://behance.net",
    photo: "",
    avatar: "",
    heroImage: "",
  },

  // Statistik / Numbers
  stats: [
    { number: 7, suffix: "+", label: "Years Behind The Lens" },
    { number: 19, suffix: "+", label: "Creative & Brand Partners" },
    { number: 171, suffix: "+", label: "Live Stages Documented" },
    { number: 850, suffix: "+", label: "Captured Moments" }
  ],

  // Klien & Rekan Kolaborasi
  clients: [
    "HINDIA",
    ".FEAST",
    "LOMBA SIHIR",
    "BERNADYA",
    "IDGITAF",
    "THE SIGIT",
    "ISMAYA LIVE",
    "SOUNDSFAIR",
    "JOYLAND FEST",
    "UNIQLO",
    "NIKE INDONESIA",
    "VANS",
    "SUN EATERS"
  ],

  // Perjalanan Karir / Milestones
  milestones: [
    {
      year: "2013",
      title: "First Shutter Click",
      description: "Picked up a second-hand camera and fell in love with capturing everyday light and shadows."
    },
    {
      year: "2014",
      title: "Underground & School Gigs",
      description: "Stepped into small sweaty gig venues, documenting local indie bands in high-contrast monochrome."
    },
    {
      year: "2017",
      title: "First Official Tour",
      description: "Traveled as the dedicated tour documentarian for independent rock bands across Java and Bali."
    },
    {
      year: "2018",
      title: "Festival & Arena Stages",
      description: "Graduated to national festival stages, capturing high-octane stadium moments for leading Indonesian artists."
    },
    {
      year: "2022",
      title: "Editorial & Brand Narratives",
      description: "Expanded into commercial campaigns, human interest portraiture, and visual identity projects for lifestyle brands."
    },
    {
      year: "Now & Beyond",
      title: "Endless Horizons",
      description: "Continuing to chase unseen moments, authentic human connections, and timeless visual narratives."
    }
  ],

  // Kategori Galeri
  categories: [
    { id: "all", name: "All Works" },
    { id: "concerts", name: "Music & Concert" },
    { id: "portraits", name: "Portraits" },
    { id: "people-places", name: "People & Places" },
    { id: "brands", name: "Brands & Products" }
  ],

  // Daftar Foto
  photos: []
};
