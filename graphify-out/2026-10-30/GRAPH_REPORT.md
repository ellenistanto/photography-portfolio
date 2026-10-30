# Graph Report - photography-portfolio  (2026-10-23)

## Corpus Check
- 47 files · ~25,634 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 262 nodes · 381 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f55a1db`
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
- VideosEditor.jsx
- Editorial Design System & Architecture
- Vercel Deployment Configuration
- Agent Automation & Graphify Rules
- Static Portfolio Seed Data
- SEO & Social Graph Metadata
- Typography Font Preloads
- Portfolio SEO & Open Graph
- dependencies

## God Nodes (most connected - your core abstractions)
1. `react` - 27 edges
2. `API_BASE` - 13 edges
3. `ErrorBoundary` - 9 edges
4. `useScrollReveal()` - 9 edges
5. `parseVideoSource()` - 8 edges
6. `lucide-react` - 7 edges
7. `escapeHtml()` - 6 edges
8. `scripts` - 5 edges
9. `usePortfolioData()` - 5 edges
10. `updatePortfolioCache()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `PortfolioPage()` --calls--> `usePortfolioData()`  [EXTRACTED]
  src/App.jsx → src/hooks/usePortfolioData.js
- `AdminDashboard()` --calls--> `fetchData()`  [EXTRACTED]
  src/admin/AdminDashboard.jsx → src/hooks/usePortfolioData.js
- `VideoModal()` --calls--> `parseVideoSource()`  [EXTRACTED]
  src/admin/sections/VideosEditor.jsx → src/utils/videoUtils.js
- `GalleryCard()` --calls--> `useScrollReveal()`  [EXTRACTED]
  src/components/MasonryGallery.jsx → src/hooks/useScrollReveal.js
- `OverviewCard()` --calls--> `useScrollReveal()`  [EXTRACTED]
  src/components/OverviewSection.jsx → src/hooks/useScrollReveal.js

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
Cohesion: 0.08
Nodes (22): lucide-react, react-router-dom, AdminApp, App(), LightboxModal, PortfolioPage(), ClientsCloud(), ConnectSection() (+14 more)

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

### Community 9 - "VideosEditor.jsx"
Cohesion: 0.27
Nodes (6): DEFAULT_CATEGORIES, VideoModal(), VideosEditor(), VideoModal, VideoModal(), parseVideoSource()

### Community 10 - "Editorial Design System & Architecture"
Cohesion: 0.50
Nodes (3): buildCommand, outputDirectory, rewrites

### Community 11 - "Vercel Deployment Configuration"
Cohesion: 0.67
Nodes (3): Private Admin Panel Concept, Portfolio Overview, Portfolio Tech Stack

### Community 17 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, mongodb (+2 more)

## Knowledge Gaps
- **126 isolated node(s):** `express`, `mongoose`, `cors`, `authRoutes`, `portfolioRoutes` (+121 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 157 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `VideosEditor.jsx`, `package.json`, `App.jsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `express`, `mongoose`, `cors` to the rest of the system?**
  _126 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.13445378151260504 - nodes in this community are weakly interconnected._
- **Should `portfolio.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08013937282229965 - nodes in this community are weakly interconnected._