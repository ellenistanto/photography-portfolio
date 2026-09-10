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
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
    heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80",
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
  photos: [
    { id: "c1", title: "Frenzy in Red Light", category: "concerts", categoryLabel: "Music & Concert", year: "2024", client: "Hindia Live Tour", aspect: "portrait", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80", description: "Front-row energy bathing in crimson stage lights during an emotional tour finale.", order: 0 },
    { id: "c2", title: "Guitar Solitude Under Spotlights", category: "concerts", categoryLabel: "Music & Concert", year: "2023", client: "Joyland Festival", aspect: "landscape", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=700&q=80", description: "Intimate silhouette cut against dramatic stage haze and stadium beams.", order: 1 },
    { id: "c3", title: "Chorus of Ten Thousand Hands", category: "concerts", categoryLabel: "Music & Concert", year: "2024", client: "Ismaya Live Festival", aspect: "landscape", image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=700&q=80", description: "Crowd hands rising together in unison against a golden stage flare.", order: 2 },
    { id: "c4", title: "The Lead Vocalist Whisper", category: "concerts", categoryLabel: "Music & Concert", year: "2023", client: ".Feast Tour", aspect: "portrait", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80", description: "Raw microphone intensity captured during an encore breakdown.", order: 3 },
    { id: "c5", title: "Smoky Stage & Bass Resonance", category: "concerts", categoryLabel: "Music & Concert", year: "2024", client: "The Sigit Showcase", aspect: "portrait", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80", description: "Monochrome stage energy with dynamic hair motion and strobe flashes.", order: 4 },
    { id: "c6", title: "Arena Fireworks & Crescendo", category: "concerts", categoryLabel: "Music & Concert", year: "2023", client: "Soundsfair Arena", aspect: "landscape", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80", description: "A spectacular explosion of pyrotechnics lighting up the night sky over the festival.", order: 5 },
    { id: "p1", title: "Gaze Beyond The Glass", category: "portraits", categoryLabel: "Portraits", year: "2024", client: "Editorial Profile", aspect: "portrait", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", description: "Subtle moody natural light accentuating contemplative facial expressions.", order: 6 },
    { id: "p2", title: "Backstage Calm Before The Storm", category: "portraits", categoryLabel: "Portraits", year: "2023", client: "Bernadya Press Kit", aspect: "landscape", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80", description: "Warm tungsten dressing room tones capturing a silent personal contemplation.", order: 7 },
    { id: "p3", title: "Golden Hour Glow", category: "portraits", categoryLabel: "Portraits", year: "2024", client: "Creative Series", aspect: "portrait", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", description: "Late afternoon rays creating cinematic film grain and halo reflections.", order: 8 },
    { id: "p4", title: "Shadows & Sculpted Features", category: "portraits", categoryLabel: "Portraits", year: "2023", client: "Studio Series", aspect: "portrait", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80", description: "High contrast Rembrandt lighting capturing character and texture.", order: 9 },
    { id: "p5", title: "The Musician's Hands", category: "portraits", categoryLabel: "Portraits", year: "2024", client: "Artist Dossier", aspect: "landscape", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80", description: "Quiet portrait focused on expressive stillness and authentic poise.", order: 10 },
    { id: "pl1", title: "Mist Over East Java Ridges", category: "people-places", categoryLabel: "People & Places", year: "2023", client: "Personal Exploration", aspect: "landscape", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80", description: "Layers of volcanic valleys awakening in morning twilight and fog.", order: 11 },
    { id: "pl2", title: "Jakarta Midnight Crossing", category: "people-places", categoryLabel: "People & Places", year: "2024", client: "Street Documentaries", aspect: "portrait", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80", description: "Neon reflections on wet asphalt as a solitary commuter navigates the metropolis.", order: 12 },
    { id: "pl3", title: "Coastal Solitude in Sumba", category: "people-places", categoryLabel: "People & Places", year: "2023", client: "Travel Narrative", aspect: "landscape", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80", description: "Tide whispering against pristine shorelines under a pastel sunset.", order: 13 },
    { id: "pl4", title: "Alleyway Vendors of Kyoto", category: "people-places", categoryLabel: "People & Places", year: "2024", client: "Documentary Tour", aspect: "portrait", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", description: "Warm lanterns glowing outside a tranquil wooden izakaya.", order: 14 },
    { id: "b1", title: "Streetwear Motion in Concrete", category: "brands", categoryLabel: "Brands & Products", year: "2024", client: "Vans x Local Collective", aspect: "portrait", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80", description: "Urban skate culture narrative highlighting textured denim and footwear.", order: 15 },
    { id: "b2", title: "Minimalist Footwear in Shadows", category: "brands", categoryLabel: "Brands & Products", year: "2023", client: "Nike Lookbook", aspect: "landscape", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80", description: "Vibrant scarlet silhouette spotlighted against a dramatic dark backdrop.", order: 16 },
    { id: "b3", title: "Timeless Horology Craft", category: "brands", categoryLabel: "Brands & Products", year: "2024", client: "Editorial Campaign", aspect: "portrait", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85", thumb: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", description: "Macro reflection catching metallic chamfers and brushed leather textures.", order: 17 },
    { id: "b4", title: "Modern Apparel Editorial", category: "brands", categoryLabel: "Brands & Products", year: "2023", client: "Uniqlo Autumn Lookbook", aspect: "landscape", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85", thumb: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80", description: "Clean aesthetic lines blending architectural backdrops with seasonal fashion.", order: 18 },
  ]
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
