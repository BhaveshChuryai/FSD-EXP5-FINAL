# AGENTS.md — Development Guidelines for AI Agents

Welcome to **Plottage Hub** (FSD Experiment 5 Final). This document serves as the primary technical reference and operating guide for AI coding agents (such as Antigravity, Devin, Claude Code, Copilot, Cursor) and human contributors collaborating on this repository.

---

## 1. Project Overview

**Plottage Hub** is a next-generation land discovery and real estate platform focused on premium land parcels across Maharashtra (agricultural, residential, commercial, industrial, and eco-retreats).

- **Type**: Single-Page Application (SPA)
- **Primary Domain**: Real Estate / PropTech / Land Investment
- **Visual Aesthetic**: Luxury Dark Editorial (Cormorant Garamond + Inter, Gold & Obsidian palette, glassmorphism, fluid micro-interactions, 3D Canvas visualizers)

---

## 2. Technology Stack

| Layer | Technologies / Libraries |
| :--- | :--- |
| **Runtime & Core** | React 19 (`react`, `react-dom`), JavaScript (ESNext) |
| **Build & Bundler** | Vite 8 (`vite`, `@vitejs/plugin-react`) |
| **Routing** | React Router v7 (`react-router-dom`) with code-splitting via `React.lazy` |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| **3D & Graphics** | Three.js (`three`), React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Animations** | Framer Motion (`framer-motion`) |
| **Icons & Feedback** | Lucide React (`lucide-react`), React Hot Toast (`react-hot-toast`) |
| **Styling** | Vanilla CSS with Design System Tokens (`tokens.css`, `index.css`) |
| **Linter** | Oxlint (`oxlint`) |

---

## 3. Directory Layout

```
fsd/
├── .github/                 # Workflows & templates (if applicable)
├── public/                  # Public static assets & favicon
│   └── favicon.svg
├── src/
│   ├── assets/              # Static media assets & images
│   ├── components/          # Reusable presentation and layout components
│   │   ├── admin/           # Admin dashboard widgets & controls
│   │   ├── auth/            # Authentication forms & modal dialogs
│   │   ├── community/       # Community forum feeds & discussion cards
│   │   ├── dashboard/       # User portfolio & saved land parcels
│   │   ├── home/            # Landing page sections (Hero, WhySection, LeadForm, etc.)
│   │   ├── layout/          # Navbar, Footer, and structural containers
│   │   ├── partner/         # Landowner & broker onboarding elements
│   │   ├── property/        # Land cards, filters, 3D viewer, specs
│   │   └── ui/              # Atom components (buttons, loaders, badges)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Top-level route views (Lazy loaded in App.jsx)
│   │   ├── Home.jsx
│   │   ├── ExploreLand.jsx
│   │   ├── PropertyDetail.jsx
│   │   ├── PartnerWithUs.jsx
│   │   ├── Community.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/            # API integration & mock data providers
│   ├── store/               # Redux Toolkit store & slices
│   │   ├── slices/          # authSlice, propertySlice, uiSlice
│   │   └── store.js         # Configured Redux store
│   ├── styles/              # Design system tokens and global styling
│   │   └── tokens.css       # Color variables, typography scales, shadows
│   ├── utils/               # Formatters, calculators, validators
│   ├── App.css              # App shell layout styling
│   ├── App.jsx              # Main routing configuration
│   ├── index.css            # Base typography, utilities, and resets
│   └── main.jsx             # React entry point with Redux Provider & Router
├── .gitignore               # Ignored files & folders
├── .oxlintrc.json           # Oxlint configuration
├── AGENTS.md                # AI Agent guidelines & context (this file)
├── index.html               # Main HTML entry with Google Fonts & SEO meta
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite build configuration
```

---

## 4. Key Developer & Agent Commands

All commands should be executed from the project root (`d:/fsd`):

```bash
# Install dependencies
npm install

# Start local development server (HMR enabled)
npm run dev

# Build for production into dist/
npm run build

# Preview production build locally
npm run preview

# Run Oxlint static analysis
npm run lint
```

---

## 5. Coding Conventions for AI Agents

### 5.1 CSS & Styling
- **No Tailwind CSS**: The project uses custom Vanilla CSS scoped alongside components (`ComponentName.css`) combined with CSS custom properties from `src/styles/tokens.css`.
- **Palette**: Use design tokens such as `--color-gold`, `--color-bg-dark`, `--color-surface`, `--color-text-primary`, `--color-border-subtle`, etc.
- **Glassmorphism**: Utilize `backdrop-filter: blur(...)` with subtle translucent dark backgrounds (`rgba(255, 255, 255, 0.04)`).
- **Responsive Design**: Ensure mobile-first or thoroughly tested responsive breakpoints (`@media (max-width: 768px)` and `@media (max-width: 1024px)`).

### 5.2 React & Architecture
- **React 19 Compatibility**: Leverage standard functional components and hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`).
- **Lazy Loading**: Route pages in `App.jsx` must be lazy-loaded using `React.lazy()` and wrapped in `<Suspense fallback={<PageLoader />}>`.
- **Redux State**: Use `useSelector` and `useDispatch` to interact with Redux slices (`authSlice`, `propertySlice`, `uiSlice`). Keep local UI toggles (e.g., dropdowns) in component state unless global persistence is required.
- **Animations**: Use `framer-motion` for page entrances, stagger reveals, and interactive micro-animations. Ensure `viewport={{ once: true }}` where appropriate to avoid performance degradation.
- **3D Canvas**: Wrap Three.js / R3F Canvas components inside suspenseful boundaries and protect against WebGL context loss.

### 5.3 File & Component Naming
- Components: PascalCase (e.g., `FeaturedProperties.jsx`, `PropertyCard.jsx`).
- Associated CSS: Matching PascalCase (e.g., `FeaturedProperties.css`).
- Redux Slices: camelCase with `Slice` suffix (e.g., `propertySlice.js`).
- Hooks: camelCase with `use` prefix (e.g., `useProperties.js`).

---

## 6. Safety & Verification Rules

1. **Keep `.gitignore` Updated**: Never commit `node_modules/`, `dist/`, `.env*`, or temporary OS/editor files.
2. **Preserve Existing Features**: Do not replace or delete working pages or components without direct user instructions.
3. **Commit Cleanly**: Write meaningful, imperative commit messages (e.g., `feat: add land valuation calculator`, `fix: resolve mobile navbar collapse`).
