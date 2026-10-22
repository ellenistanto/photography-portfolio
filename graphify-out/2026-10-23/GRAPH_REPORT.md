# Graph Report - photography-portfolio  (2026-10-15)

## Corpus Check
- 46 files · ~25,293 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 255 nodes · 372 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84c034e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- portfolio.js
- package.json
- App.jsx
- server/package.json
- server/index.js
- Authentication & Vercel Serverless API
- Portfolio.js
- dependencies
- dependencies
- Editorial Design System & Architecture
- Vercel Deployment Configuration
- Agent Automation & Graphify Rules
- Static Portfolio Seed Data
- SEO & Social Graph Metadata
- Typography Font Preloads
- Portfolio SEO & Open Graph
- usePortfolioData

## God Nodes (most connected - your core abstractions)
1. `react` - 26 edges
2. `API_BASE` - 13 edges
3. `useScrollReveal()` - 9 edges
4. `parseVideoSource()` - 8 edges
5. `lucide-react` - 7 edges
6. `escapeHtml()` - 6 edges
7. `scripts` - 5 edges
8. `usePortfolioData()` - 5 edges
9. `updatePortfolioCache()` - 5 edges
10. `renderGallery()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AdminDashboard()` --calls--> `fetchData()`  [EXTRACTED]
  src/admin/AdminDashboard.jsx → src/hooks/usePortfolioData.js
- `VideoModal()` --calls--> `parseVideoSource()`  [EXTRACTED]
  src/admin/sections/VideosEditor.jsx → src/utils/videoUtils.js
- `GalleryCard()` --calls--> `useScrollReveal()`  [EXTRACTED]
  src/components/MasonryGallery.jsx → src/hooks/useScrollReveal.js
- `OverviewCard()` --calls--> `useScrollReveal()`  [EXTRACTED]
  src/components/OverviewSection.jsx → src/hooks/useScrollReveal.js
- `VideoModal()` --calls--> `parseVideoSource()`  [EXTRACTED]
  src/components/VideoModal.jsx → src/utils/videoUtils.js

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "react"
Cohesion: 0.13
Nodes (16): react, AdminApp(), AdminDashboard(), NAV_ITEMS, AdminLogin(), CategoriesEditor(), ClientsEditor(), EMPTY_MILESTONE (+8 more)

### Community 1 - "portfolio.js"
Cohesion: 0.06
Nodes (21): app, authRoutes, cors, express, mongoose, portfolioRoutes, uploadRoutes, jwt (+13 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (23): devDependencies, vite, @vitejs/plugin-react, bcryptjs, cors, dotenv, express, express-rate-limit (+15 more)

### Community 3 - "App.jsx"
Cohesion: 0.09
Nodes (23): lucide-react, react-router-dom, DEFAULT_CATEGORIES, VideoModal(), VideosEditor(), AdminApp, App(), LightboxModal (+15 more)

### Community 4 - "server/package.json"
Cohesion: 0.09
Nodes (22): mongodb, author, description, bcryptjs, cors, dotenv, express, express-rate-limit (+14 more)

### Community 5 - "server/index.js"
Cohesion: 0.10
Nodes (15): allowedOrigins, app, authRoutes, cors, express, mongoose, path, portfolioRoutes (+7 more)

### Community 6 - "Authentication & Vercel Serverless API"
Cohesion: 0.21
Nodes (14): animateCounters(), checkHashRoute(), escapeHtml(), handleSwipe(), nextPhoto(), openLightbox(), prevPhoto(), renderClients() (+6 more)

### Community 7 - "Portfolio.js"
Cohesion: 0.12
Nodes (14): CategorySchema, MilestoneSchema, mongoose, OverviewSchema, PhotoSchema, PortfolioSchema, ProfileSchema, ProjectPhotoSchema (+6 more)

### Community 8 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, lenis (+6 more)

### Community 9 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, mongodb (+2 more)

### Community 10 - "Editorial Design System & Architecture"
Cohesion: 0.50
Nodes (3): buildCommand, outputDirectory, rewrites

### Community 11 - "Vercel Deployment Configuration"
Cohesion: 0.67
Nodes (3): Private Admin Panel Concept, Portfolio Overview, Portfolio Tech Stack

### Community 17 - "usePortfolioData"
Cohesion: 0.50
Nodes (5): PortfolioPage(), raf(), getInitialData(), usePortfolioData(), fetchData()

## Knowledge Gaps
- **125 isolated node(s):** `express`, `mongoose`, `cors`, `authRoutes`, `portfolioRoutes` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 150 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.jsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `express`, `mongoose`, `cors` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.13445378151260504 - nodes in this community are weakly interconnected._
- **Should `portfolio.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._