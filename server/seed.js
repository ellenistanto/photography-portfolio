/**
 * seed.js — Populate MongoDB with initial data from portfolioData.js
 * 
 * Run once: node server/seed.js
 * (from the root of the project)
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Portfolio = require('./models/Portfolio');

// ── Seed Data (mirrored from src/data/portfolioData.js) ───────────────────────
const SEED_DATA = {
  profile: {
    name: "Ellen Istanto",
    tagline: "Concerts, Portraits, Travel, and Human moments in between.",
    shortBio: "I'm Ellen Istanto, a photographer based in Indonesia. Drawn to moments charged with emotion, I work between motion and stillness — on stage, in portraits, and through travel narratives.",
    aboutLong: [
      "Photography, for me, is an intimate way of bearing witness to life's fleeting poetry. Over the past seven years, I've found myself backstage amidst the raw frenzy of live concerts, in quiet studios capturing honest portraits, and traveling across vibrant landscapes searching for the human pulse.",
      "Every frame is a dialogue between light, timing, and vulnerability. Whether documenting an arena screaming the lyrics of an anthem or a quiet gaze under the Jakarta dusk, my work strives to preserve the feeling as much as the sight."
    ],
    location: "Yogyakarta, Indonesia",
    email: "ellengifaistanto@gmail.com",
    whatsapp: "6289523148500",
    instagram: "https://instagram.com/ellenistanto",
    youtube: "https://youtube.com",
    behance: "https://behance.net",
    photo: "",
    avatar: "",
    heroImage: "",
  },
  stats: [
    { number: 7, suffix: "+", label: "Years Behind The Lens" },
    { number: 19, suffix: "+", label: "Creative & Brand Partners" },
    { number: 171, suffix: "+", label: "Live Stages Documented" },
    { number: 850, suffix: "+", label: "Captured Moments" }
  ],
  clients: [
    "HINDIA", ".FEAST", "LOMBA SIHIR", "BERNADYA", "IDGITAF",
    "THE SIGIT", "ISMAYA LIVE", "SOUNDSFAIR", "JOYLAND FEST",
    "UNIQLO", "NIKE INDONESIA", "VANS", "SUN EATERS"
  ],
  milestones: [
    { year: "2013", title: "First Shutter Click", description: "Picked up a second-hand camera and fell in love with capturing everyday light and shadows." },
    { year: "2014", title: "Underground & School Gigs", description: "Stepped into small sweaty gig venues, documenting local indie bands in high-contrast monochrome." },
    { year: "2017", title: "First Official Tour", description: "Traveled as the dedicated tour documentarian for independent rock bands across Java and Bali." },
    { year: "2018", title: "Festival & Arena Stages", description: "Graduated to national festival stages, capturing high-octane stadium moments for leading Indonesian artists." },
    { year: "2022", title: "Editorial & Brand Narratives", description: "Expanded into commercial campaigns, human interest portraiture, and visual identity projects for lifestyle brands." },
    { year: "Now & Beyond", title: "Endless Horizons", description: "Continuing to chase unseen moments, authentic human connections, and timeless visual narratives." }
  ],
  categories: [
    { id: "all", name: "All Works" },
    { id: "concerts", name: "Music & Concert" },
    { id: "portraits", name: "Portraits" },
    { id: "people-places", name: "People & Places" },
    { id: "brands", name: "Brands & Products" }
  ],
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
      description: "Dokumentasi pameran otomotif berskala internasional menuntut kepekaan visual yang memadukan keindahan desain industri mobil dengan energi panggung pameran yang dinamis.\n\nPada proyek ini, fokus utama adalah menangkap interaksi antara pencahayaan panggung pameran dengan lekukan bodi mobil, pantulan cat metalik, serta atmosfer antusiasme pengunjung di sekitar booth brand premium.",
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
        }
      ]
    }
  ],
  photos: []
};

async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!');

    const existing = await Portfolio.findOne({ _key: 'main' });
    
    if (existing) {
      console.log('⚠️  Portfolio data already exists in database.');
      console.log('   To re-seed, delete the document and run again.');
      console.log('   Or use --force flag: node server/seed.js --force');
      
      if (process.argv.includes('--force')) {
        console.log('🔄 Force re-seeding...');
        await Portfolio.deleteOne({ _key: 'main' });
      } else {
        await mongoose.disconnect();
        process.exit(0);
      }
    }

    await Portfolio.create({ _key: 'main', ...SEED_DATA });
    console.log('✅ Seed data successfully inserted!');
    console.log(`   - ${SEED_DATA.photos.length} photos`);
    console.log(`   - ${SEED_DATA.clients.length} clients`);
    console.log(`   - ${SEED_DATA.milestones.length} milestones`);
    console.log('\n🚀 Your portfolio database is ready!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
