# Graph Report - photography-portfolio  (2026-09-19)

## Corpus Check
- Corpus is ~19,720 words - fits in a single context window. You may not need a graph.

## Summary
- 229 nodes · 314 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.87)
- Token cost: 450 input · 250 output

## Community Hubs (Navigation)
- Admin Panel & Section Editors
- Express Server & API Routes
- Portfolio Frontend & Components
- Root Project & Vite Build Config
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
- Community 15
- Community 16

## God Nodes (most connected - your core abstractions)
1. `react` - 22 edges
2. `API_BASE` - 12 edges
3. `escapeHtml()` - 6 edges
4. `updatePortfolioCache()` - 5 edges
5. `usePortfolioData()` - 5 edges
6. `lucide-react` - 5 edges
7. `scripts` - 5 edges
8. `AdminDashboard()` - 4 edges
9. `renderGallery()` - 4 edges
10. `setCategory()` - 4 edges

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
Cohesion: 0.13
Nodes (19): react, AdminDashboard(), NAV_ITEMS, AdminLogin(), CategoriesEditor(), ClientsEditor(), EMPTY_MILESTONE, MilestonesEditor() (+11 more)

### Community 1 - "Express Server & API Routes"
Cohesion: 0.07
Nodes (21): app, authRoutes, cors, express, mongoose, portfolioRoutes, uploadRoutes, jwt (+13 more)

### Community 2 - "Portfolio Frontend & Components"
Cohesion: 0.09
Nodes (22): devDependencies, vite, @vitejs/plugin-react, bcryptjs, cors, dotenv, express, express-rate-limit (+14 more)

### Community 3 - "Root Project & Vite Build Config"
Cohesion: 0.13
Nodes (12): lucide-react, react-router-dom, AdminApp(), App(), ClientsCloud(), ConnectSection(), Footer(), Hero() (+4 more)

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
- **122 isolated node(s):** `NAV_ITEMS`, `EMPTY_MILESTONE`, `allowedOrigins`, `app`, `authRoutes` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 142 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Admin Panel & Section Editors` to `Portfolio Frontend & Components`, `Root Project & Vite Build Config`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Runtime Dependencies` to `Portfolio Frontend & Components`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `NAV_ITEMS`, `EMPTY_MILESTONE`, `allowedOrigins` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Panel & Section Editors` be split into smaller, more focused modules?**
  _Cohesion score 0.12612612612612611 - nodes in this community are weakly interconnected._
- **Should `Express Server & API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Portfolio Frontend & Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Root Project & Vite Build Config` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._