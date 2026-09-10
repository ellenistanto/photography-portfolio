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
}, {
  timestamps: true,
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
