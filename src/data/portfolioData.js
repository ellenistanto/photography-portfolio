/**
 * ====================================================================
 * PORTFOLIO DATA CONFIGURATION (REACT)
 * ====================================================================
 * Anda dapat dengan mudah mengubah semua data di file ini:
 * - Mengubah nama, bio, dan kontak WhatsApp / Instagram.
 * - Mengganti foto dengan file lokal (misal: '/assets/images/foto1.jpg')
 *   atau link gambar online lainnya.
 * - Menambah atau menghapus item foto di masing-masing kategori.
 * ====================================================================
 */

export const PORTFOLIO_DATA = {
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

  // Overview / Selected Works
  overview: {
    enabled: true,
    title: 'Selected Works',
    subtitle: 'Curated highlights & moments in between',
    photoIds: []
  },

  // Projects / Stories / Series (Dokumentasi lengkap per event / pameran / project)
  projects: [
    {
      id: "proj_giias_2024",
      slug: "giias-2024-auto-show",
      title: "GIIAS 2024 — Auto Show & Supercar Showcase",
      category: "brands",
      categoryLabel: "Commercial & Automotive",
      client: "GIIAS Auto Exhibition / Brand Partners",
      year: "2024",
      location: "ICE BSD City, Tangerang",
      coverImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85",
      summary: "Dokumentasi visual komprehensif pameran otomotif terbesar, menangkap siluet mobil konsep, tata cahaya panggung megah, dan detail lekukan desain presisi.",
      description: "Dokumentasi pameran otomotif berskala internasional menuntut kepekaan visual yang memadukan keindahan desain industri mobil dengan energi panggung pameran yang dinamis.\n\nPada proyek ini, fokus utama adalah menangkap interaksi antara pencahayaan panggung pameran dengan lekukan bodi mobil, pantulan cat metalik, serta atmosfer antusiasme pengunjung di sekitar booth brand premium. Setiap bidikan dikomposisikan secara presisi untuk menonjolkan karakter futuristik dan kemewahan setiap kendaraan—mulai dari mobil konsep elektrik generasi terbaru hingga deretan supercar eksotis.\n\nPendekatan fotografi menggabungkan wide-angle dramatis untuk merekam megahnya panggung peluncuran serta lensa makro dan telephoto untuk menyorot detail emblem, aerodinamika karbon, dan tekstur interior kokpit.",
      isFeatured: true,
      order: 0,
      photos: [
        {
          id: "pp_car_1",
          title: "Porsche 911 GT3 Silhouette",
          caption: "Sorotan lampu panggung mempertegas aerodinamika agresif dan siluet ikonik Porsche 911 GT3 di booth pameran utama.",
          aspect: "landscape",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
          thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
          order: 0
        },
        {
          id: "pp_car_2",
          title: "Metallic Curvature & Reflections",
          caption: "Permukaan bodi cat metalik memantulkan kemewahan tata pencahayaan pameran di Hall Utama ICE BSD.",
          aspect: "landscape",
          image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85",
          thumb: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
          order: 1
        },
        {
          id: "pp_car_3",
          title: "Heritage & Craftsmanship",
          caption: "Sudut vertikal menangkap estetika klasik dan detail pengerjaan tangan pada bodi mobil ikonik.",
          aspect: "portrait",
          image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=85",
          thumb: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
          order: 2
        },
        {
          id: "pp_car_4",
          title: "Front Facia & Matrix LED",
          caption: "Desain fascia agresif berpadu dengan teknologi lampu LED masa depan dalam sorotan spotlight.",
          aspect: "landscape",
          image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85",
          thumb: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
          order: 3
        },
        {
          id: "pp_car_5",
          title: "Luxury Cockpit Detail",
          caption: "Detail interior dengan ambient lighting digital menciptakan atmosfer kemewahan dan teknologi tinggi.",
          aspect: "square",
          image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85",
          thumb: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
          order: 4
        },
        {
          id: "pp_car_6",
          title: "Aerodynamic Stance & High Contrast",
          caption: "Garis bodi samping yang proporsional terekam dalam pencahayaan kontras tinggi di panggung peluncuran.",
          aspect: "landscape",
          image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1400&q=85",
          thumb: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
          order: 5
        }
      ]
    },
    {
      id: "proj_joyland_2023",
      slug: "joyland-festival-documentation",
      title: "Joyland Festival — Music & Cultural Narrative",
      category: "concerts",
      categoryLabel: "Music & Festivals",
      client: "Plainsong Live / Joyland Festival",
      year: "2023",
      location: "GBK Baseball Stadium, Jakarta",
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=85",
      summary: "Dokumentasi visual multi-panggung festival musik Joyland, merekam euforia penonton, sorotan lampu panggung outdoor, dan emosi musisi internasional.",
      description: "Mendokumentasikan festival musik berskala tiga hari di area outdoor menuntut fleksibilitas tinggi dan antisipasi cepat terhadap momen spontan.\n\nFokus dokumentasi ini terbagi antara kehangatan interaksi penonton di bawah langit senja, aksi energetik musisi di panggung Lily Pad dan Plainsong Stage, hingga detail visual instalasi seni yang tersebar di seluruh area festival.",
      isFeatured: true,
      order: 1,
      photos: [
        {
          id: "pp_joy_1",
          title: "Main Stage Midnight Euphoria",
          caption: "Lautan penonton bernyanyi bersama di bawah kilau ribuan lampu panggung utama.",
          aspect: "landscape",
          image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=85",
          thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
          order: 0
        },
        {
          id: "pp_joy_2",
          title: "Acoustic Sunset Resonance",
          caption: "Momen intim musisi solo di panggung samping saat matahari terbenam di balik stadion.",
          aspect: "portrait",
          image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
          thumb: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
          order: 1
        },
        {
          id: "pp_joy_3",
          title: "Crowd Energy in Monochrome",
          caption: "Kontras tinggi mengekspresikan intensitas dan sorak penonton di barisan terdepan.",
          aspect: "landscape",
          image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1400&q=85",
          thumb: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80",
          order: 2
        }
      ]
    }
  ],

  // Daftar Foto
  photos: []
};
