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
  stats: [],
  showStats: false,
  clients: [],
  milestones: [],
  categories: [],
  projects: [],
  videos: [],
  photos: [],
  overview: {
    enabled: false,
    title: "",
    subtitle: "",
    photoIds: []
  }
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
    console.log('✅ Seed data successfully inserted (empty template ready for admin input)!');
    console.log('\n🚀 Your portfolio database is ready!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
