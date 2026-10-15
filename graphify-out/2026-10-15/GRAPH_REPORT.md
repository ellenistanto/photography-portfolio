# Graph Report - photography-portfolio  (2026-10-08)

## Corpus Check
- 45 files · ~24,835 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 250 nodes · 354 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5576b70a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AdminDashboard.jsx
- portfolio.js
- Portfolio Frontend & Components
- App.jsx
- server/package.json
- server/index.js
- Authentication & Vercel Serverless API
- Portfolio.js
- Frontend Runtime Dependencies
- Editorial Design System & Architecture
- Vercel Deployment Configuration
- Agent Automation & Graphify Rules
- Static Portfolio Seed Data
- SEO & Social Graph Metadata
- Typography Font Preloads
- Portfolio SEO & Open Graph
- VideosEditor.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 25 edges
2. `API_BASE` - 13 edges
3. `parseVideoSource()` - 8 edges
4. `lucide-react` - 7 edges
5. `escapeHtml()` - 6 edges
6. `scripts` - 5 edges
7. `usePortfolioData()` - 5 edges
8. `updatePortfolioCache()` - 5 edges
9. `renderGallery()` - 4 edges
10. `setCategory()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `PortfolioPage()` --calls--> `usePortfolioData()`  [EXTRACTED]
  src/App.jsx → src/hooks/usePortfolioData.js
- `VideoModal()` --calls--> `parseVideoSource()`  [EXTRACTED]
  src/admin/sections/VideosEditor.jsx → src/utils/videoUtils.js
- `VideoModal()` --calls--> `parseVideoSource()`  [EXTRACTED]
  src/components/VideoModal.jsx → src/utils/videoUtils.js
- `VideoCard()` --calls--> `parseVideoSource()`  [EXTRACTED]
  src/components/VideoSection.jsx → src/utils/videoUtils.js
- `Graphify Knowledge Graph Rule` --conceptually_related_to--> `Graphify Pipeline Workflow`  [INFERRED]
  .agents/rules/graphify.md → .agents/workflows/graphify.md

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "AdminDashboard.jsx"
Cohesion: 0.13
Nodes (17): react, AdminApp(), AdminDashboard(), NAV_ITEMS, AdminLogin(), CategoriesEditor(), ClientsEditor(), EMPTY_MILESTONE (+9 more)

### Community 1 - "portfolio.js"
Cohesion: 0.06
Nodes (21): app, authRoutes, cors, express, mongoose, portfolioRoutes, uploadRoutes, jwt (+13 more)

### Community 2 - "Portfolio Frontend & Components"
Cohesion: 0.09
Nodes (22): devDependencies, vite, @vitejs/plugin-react, bcryptjs, cors, dotenv, express, express-rate-limit (+14 more)

### Community 3 - "App.jsx"
Cohesion: 0.11
Nodes (15): lucide-react, react-router-dom, AdminApp, App(), LightboxModal, PortfolioPage(), ClientsCloud(), ConnectSection() (+7 more)

### Community 4 - "server/package.json"
Cohesion: 0.06
Nodes (32): mongodb, author, dependencies, bcryptjs, cors, dotenv, express, express-rate-limit (+24 more)

### Community 5 - "server/index.js"
Cohesion: 0.10
Nodes (15): allowedOrigins, app, authRoutes, cors, express, mongoose, path, portfolioRoutes (+7 more)

### Community 6 - "Authentication & Vercel Serverless API"
Cohesion: 0.21
Nodes (14): animateCounters(), checkHashRoute(), escapeHtml(), handleSwipe(), nextPhoto(), openLightbox(), prevPhoto(), renderClients() (+6 more)

### Community 7 - "Portfolio.js"
Cohesion: 0.12
Nodes (14): CategorySchema, MilestoneSchema, mongoose, OverviewSchema, PhotoSchema, PortfolioSchema, ProfileSchema, ProjectPhotoSchema (+6 more)

### Community 8 - "Frontend Runtime Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, lucide-react (+5 more)

### Community 10 - "Editorial Design System & Architecture"
Cohesion: 0.50
Nodes (3): buildCommand, outputDirectory, rewrites

### Community 11 - "Vercel Deployment Configuration"
Cohesion: 0.67
Nodes (3): Private Admin Panel Concept, Portfolio Overview, Portfolio Tech Stack

### Community 17 - "VideosEditor.jsx"
Cohesion: 0.22
Nodes (8): DEFAULT_CATEGORIES, VideoModal(), VideosEditor(), VideoModal, VideoModal(), VideoCard(), VideoSection(), parseVideoSource()

## Knowledge Gaps
- **124 isolated node(s):** `express`, `mongoose`, `cors`, `authRoutes`, `portfolioRoutes` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 151 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AdminDashboard.jsx` to `VideosEditor.jsx`, `Portfolio Frontend & Components`, `App.jsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Runtime Dependencies` to `Portfolio Frontend & Components`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `express`, `mongoose`, `cors` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AdminDashboard.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Should `portfolio.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Portfolio Frontend & Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._