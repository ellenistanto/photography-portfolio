# Graph Report - photography-portfolio  (2026-09-17)

## Corpus Check
- Corpus is ~27,245 words - fits in a single context window. You may not need a graph.

## Summary
- 242 nodes · 354 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- React Client & Routing
- Admin Portal & Editors
- Serverless API Gateway
- Root Build & Config
- Server Package Config
- Express Server Application
- Legacy Vanilla JS App
- MongoDB Portfolio Models
- Server Dependencies
- Serverless API Dependencies
- Editorial Design System
- Vercel Deployment Setup
- Module Type Definition
- Static Portfolio Data

## God Nodes (most connected - your core abstractions)
1. `react` - 27 edges
2. `API_BASE` - 14 edges
3. `lucide-react` - 13 edges
4. `escapeHtml()` - 6 edges
5. `usePortfolioData()` - 6 edges
6. `react-router-dom` - 5 edges
7. `scripts` - 5 edges
8. `updatePortfolioCache()` - 5 edges
9. `Design System Specification` - 5 edges
10. `renderGallery()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `PortfolioPage()` --calls--> `usePortfolioData()`  [EXTRACTED]
  src/App.jsx → src/hooks/usePortfolioData.js
- `ProjectDetailPageWrapper()` --calls--> `usePortfolioData()`  [EXTRACTED]
  src/App.jsx → src/hooks/usePortfolioData.js
- `AdminDashboard()` --calls--> `fetchData()`  [EXTRACTED]
  src/admin/AdminDashboard.jsx → src/hooks/usePortfolioData.js
- `AdminDashboard()` --calls--> `updatePortfolioCache()`  [EXTRACTED]
  src/admin/AdminDashboard.jsx → src/hooks/usePortfolioData.js
- `OverviewEditor()` --calls--> `updatePortfolioCache()`  [EXTRACTED]
  src/admin/sections/OverviewEditor.jsx → src/hooks/usePortfolioData.js

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "React Client & Routing"
Cohesion: 0.09
Nodes (21): index.html Web Entry Point, lucide-react, react-router-dom, AdminApp(), App(), PortfolioPage(), ProjectDetailPageWrapper(), ClientsCloud() (+13 more)

### Community 1 - "Admin Portal & Editors"
Cohesion: 0.13
Nodes (16): react, AdminDashboard(), NAV_ITEMS, AdminLogin(), CategoriesEditor(), ClientsEditor(), EMPTY_MILESTONE, MilestonesEditor() (+8 more)

### Community 2 - "Serverless API Gateway"
Cohesion: 0.07
Nodes (21): app, authRoutes, cors, express, mongoose, portfolioRoutes, uploadRoutes, jwt (+13 more)

### Community 3 - "Root Build & Config"
Cohesion: 0.09
Nodes (22): devDependencies, vite, @vitejs/plugin-react, bcryptjs, cors, dotenv, express, express-rate-limit (+14 more)

### Community 4 - "Server Package Config"
Cohesion: 0.09
Nodes (22): mongodb, author, description, bcryptjs, cors, dotenv, express, express-rate-limit (+14 more)

### Community 5 - "Express Server Application"
Cohesion: 0.10
Nodes (15): allowedOrigins, app, authRoutes, cors, express, mongoose, path, portfolioRoutes (+7 more)

### Community 6 - "Legacy Vanilla JS App"
Cohesion: 0.21
Nodes (14): animateCounters(), checkHashRoute(), escapeHtml(), handleSwipe(), nextPhoto(), openLightbox(), prevPhoto(), renderClients() (+6 more)

### Community 7 - "MongoDB Portfolio Models"
Cohesion: 0.12
Nodes (13): CategorySchema, MilestoneSchema, mongoose, OverviewSchema, PhotoSchema, PortfolioSchema, ProfileSchema, ProjectPhotoSchema (+5 more)

### Community 8 - "Server Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, lucide-react (+5 more)

### Community 9 - "Serverless API Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, jsonwebtoken, mongodb (+2 more)

### Community 10 - "Editorial Design System"
Cohesion: 0.33
Nodes (6): Muted Natural Color Palette, Editorial & Cinematic Core Aesthetic, Design System Specification, Asymmetric Grid & Editorial Layouts, Photography-First Philosophy, Editorial Typography System

### Community 11 - "Vercel Deployment Setup"
Cohesion: 0.50
Nodes (3): buildCommand, outputDirectory, rewrites

## Knowledge Gaps
- **121 isolated node(s):** `express`, `mongoose`, `cors`, `authRoutes`, `portfolioRoutes` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 144 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Admin Portal & Editors` to `React Client & Routing`, `Root Build & Config`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Server Dependencies` to `Root Build & Config`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `React Client & Routing` to `Admin Portal & Editors`, `Root Build & Config`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `express`, `mongoose`, `cors` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Client & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.0915915915915916 - nodes in this community are weakly interconnected._
- **Should `Admin Portal & Editors` be split into smaller, more focused modules?**
  _Cohesion score 0.12912912912912913 - nodes in this community are weakly interconnected._
- **Should `Serverless API Gateway` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._