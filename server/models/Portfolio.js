const mongoose = require('mongoose');

// ── Photo Schema ──────────────────────────────────────────────────────────────
const PhotoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: { type: String, required: true },
  year: { type: String },
  client: { type: String },
  aspect: { type: String, enum: ['portrait', 'landscape', 'square'], default: 'landscape' },
  image: { type: String, required: true },
  thumb: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 },
  isOverview: { type: Boolean, default: false },
}, { _id: false });

// ── Overview Schema ───────────────────────────────────────────────────────────
const OverviewSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  title: { type: String, default: 'Selected Works' },
  subtitle: { type: String, default: 'Curated highlights & moments in between' },
  photoIds: [{ type: String }],
}, { _id: false });

// ── Stat Schema ───────────────────────────────────────────────────────────────
const StatSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  suffix: { type: String, default: '+' },
  label: { type: String, required: true },
}, { _id: false });

// ── Milestone Schema ──────────────────────────────────────────────────────────
const MilestoneSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
}, { _id: false });

// ── Category Schema ───────────────────────────────────────────────────────────
const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

// ── Profile Schema ────────────────────────────────────────────────────────────
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String },
  shortBio: { type: String },
  aboutLong: [{ type: String }],
  location: { type: String },
  email: { type: String },
  whatsapp: { type: String },
  instagram: { type: String },
  youtube: { type: String },
  behance: { type: String },
  photo: { type: String },
  avatar: { type: String },
  heroImage: { type: String },
}, { _id: false });

// ── Project Schemas ─────────────────────────────────────────────────────────
const ProjectPhotoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  caption: { type: String, default: '' },
  aspect: { type: String, enum: ['portrait', 'landscape', 'square'], default: 'landscape' },
  image: { type: String, required: true },
  thumb: { type: String },
  order: { type: Number, default: 0 },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'commercial' },
  categoryLabel: { type: String, default: 'Commercial' },
  client: { type: String, default: '' },
  year: { type: String, default: '' },
  location: { type: String, default: '' },
  coverImage: { type: String, required: true },
  summary: { type: String, default: '' },
  description: { type: String, default: '' },
  photos: [ProjectPhotoSchema],
  isFeatured: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

// ── Main Portfolio Schema ─────────────────────────────────────────────────────
const PortfolioSchema = new mongoose.Schema({
  // Singleton document — always one doc with this key
  _key: { type: String, default: 'main', unique: true },
  profile: { type: ProfileSchema, required: true },
  stats: [StatSchema],
  clients: [{ type: String }],
  milestones: [MilestoneSchema],
  categories: [CategorySchema],
  photos: [PhotoSchema],
  projects: [ProjectSchema],
  overview: {
    type: OverviewSchema,
    default: () => ({
      enabled: true,
      title: 'Selected Works',
      subtitle: 'Curated highlights & moments in between',
      photoIds: [],
    }),
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
