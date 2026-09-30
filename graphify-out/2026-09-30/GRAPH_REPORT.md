# Graph Report - photography-portfolio  (2026-09-20)

## Corpus Check
- 41 files · ~19,809 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 231 nodes · 316 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `950d433d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Admin Panel & Section Editors
- Express Server & API Routes
- Portfolio Frontend & Components
- App.jsx
- Backend Server Configuration
- Vanilla Client Application Scripts
- Authentication & Vercel Serverless API
- Mongoose Schemas & Database Seeding
- Frontend Runtime Dependencies
- Backend Runtime Dependencies
- Editorial Design System & Architecture
- Vercel Deployment Configuration
- Agent Automation & Graphify Rules
- Static Portfolio Seed Data
- SEO & Social Graph Metadata
- Typography Font Preloads
- Portfolio SEO & Open Graph

## God Nodes (most connected - your core abstractions)
1. `react` - 22 edges
2. `API_BASE` - 12 edges
3. `escapeHtml()` - 6 edges
4. `lucide-react` - 5 edges
5. `scripts` - 5 edges
6. `usePortfolioData()` - 5 edges
7. `updatePortfolioCache()` - 5 edges
8. `renderGallery()` - 4 edges
9. `setCategory()` - 4 edges
10. `updateLightboxContent()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `PortfolioPage()` --calls--> `usePortfolioData()`  [EXTRACTED]
  src/App.jsx → src/hooks/usePortfolioData.js
- `Graphify Knowledge Graph Rule` --conceptually_related_to--> `Graphify Pipeline Workflow`  [INFERRED]
  .agents/rules/graphify.md → .agents/workflows/graphify.md
- `AdminDashboard()` --calls--> `updatePortfolioCache()`  [EXTRACTED]
  src/admin/AdminDashboard.jsx → src/hooks/usePortfolioData.js
- `AdminDashboard()` --calls--> `fetchData()`  [EXTRACTED]
  src/admin/AdminDashboard.jsx → src/hooks/usePortfolioData.js
- `OverviewEditor()` --calls--> `updatePortfolioCache()`  [EXTRACTED]
  src/admin/sections/OverviewEditor.jsx → src/hooks/usePortfolioData.js

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "Admin Panel & Section Editors"
Cohesion: 0.14
Nodes (16): react, AdminDashboard(), NAV_ITEMS, AdminLogin(), CategoriesEditor(), ClientsEditor(), EMPTY_MILESTONE, MilestonesEditor() (+8 more)

### Community 1 - "Express Server & API Routes"
Cohesion: 0.07
Nodes (21): app, authRoutes, cors, express, mongoose, portfolioRoutes, uploadRoutes, jwt (+13 more)

### Community 2 - "Portfolio Frontend & Components"
Cohesion: 0.09
Nodes (22): devDependencies, vite, @vitejs/plugin-react, bcryptjs, cors, dotenv, express, express-rate-limit (+14 more)

### Community 3 - "App.jsx"
Cohesion: 0.11
Nodes (15): lucide-react, react-router-dom, AdminApp(), App(), PortfolioPage(), ClientsCloud(), ConnectSection(), Footer() (+7 more)

### Community 4 - "Backend Server Configuration"
Cohesion: 0.09
Nodes (22): mongodb, author, description, bcryptjs, cors, dotenv, express, express-rate-limit (+14 more)

### Community 5 - "Vanilla Client Application Scripts"
Cohesion: 0.10
Nodes (15): allowedOrigins, app, authRoutes, cors, express, mongoose, path, portfolioRoutes (+7 more)

### Community 6 - "Authentication & Vercel Serverless API"
Cohesion: 0.21
Nodes (14): animateCounters(), checkHashRoute(), escapeHtml(), handleSwipe(), nextPhoto(), openLightbox(), prevPhoto(), renderClients() (+6 more)

### Community 7 - "Mongoose Schemas & Database Seeding"
Cohesion: 0.12
Nodes (13): CategorySchema, MilestoneSchema, mongoose, OverviewSchema, PhotoSchema, PortfolioSchema, ProfileSchema, ProjectPhotoSchema (+5 more)

### Community 8 - "Frontend Runtime Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, lucide-react (+5 more)

### Community 9 - "Backend Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, mongodb (+2 more)

### Community 10 - "Editorial Design System & Architecture"
Cohesion: 0.50
Nodes (3): buildCommand, outputDirectory, rewrites

### Community 11 - "Vercel Deployment Configuration"
Cohesion: 0.67
Nodes (3): Private Admin Panel Concept, Portfolio Overview, Portfolio Tech Stack

## Knowledge Gaps
- **122 isolated node(s):** `express`, `mongoose`, `cors`, `authRoutes`, `portfolioRoutes` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 144 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Admin Panel & Section Editors` to `Portfolio Frontend & Components`, `App.jsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Runtime Dependencies` to `Portfolio Frontend & Components`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `express`, `mongoose`, `cors` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Panel & Section Editors` be split into smaller, more focused modules?**
  _Cohesion score 0.1408199643493761 - nodes in this community are weakly interconnected._
- **Should `Express Server & API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Portfolio Frontend & Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._