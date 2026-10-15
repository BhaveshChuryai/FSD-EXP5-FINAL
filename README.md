# 🏛️ Plottage Hub — Discover Land. Unlock Possibilities.

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.13-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.2-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)

> **Full Stack Development Experiment 5 (Final)**  
> **Plottage Hub** is a luxury PropTech web application designed for discovering, evaluating, and transacting high-value land opportunities across Maharashtra, India. Featuring 3D interactive terrain visualizers, dynamic search and filtering, real-time valuation tools, investor dashboards, and partner listing portals.

---

## ✨ Features

- **Luxury Editorial Design**: Tailored obsidian & warm gold aesthetic inspired by modern architectural journals, utilizing custom typography (`Cormorant Garamond` & `Inter`).
- **Interactive 3D Land Visualizer**: Powered by Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`) for spatial terrain and property boundary previews.
- **Advanced Land Discovery & Filters**: Filter parcels by zone (Agricultural, Commercial, Residential, Eco-Retreat, Industrial), acreage, price tier, and verified legal clearances (7/12 extract, NA conversion).
- **Property Detail Experience**: In-depth parcel specifications, soil quality metrics, road accessibility, investment ROI projections, and direct enquiry workflows.
- **Partner & Landowner Portal**: Streamlined onboarding flow for landowners and brokers to list land parcels with document verification status.
- **Investor & User Dashboard**: Track saved parcels, pending site visit schedules, offer histories, and market price trends.
- **Admin Control Panel**: Manage listings, approve incoming property applications, and analyze visitor lead conversions.
- **Community Forum**: Real estate discussion channels, zoning legal advice, and regional development insights.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [React Router v7](https://reactrouter.com/)
- **Bundler & Tooling**: [Vite 8](https://vitejs.dev/), [Oxlint](https://oxc.rs/)
- **3D & Interactive Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
- **Motion & UI**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [React Hot Toast](https://react-hot-toast.com/)
- **Styles**: Custom Vanilla CSS with Design System Tokens (`tokens.css`)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BhaveshChuryai/FSD-EXP5-FINAL.git
   cd FSD-EXP5-FINAL
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the local Vite development server with HMR |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory |
| `npm run preview` | Locally serves the production build for testing |
| `npm run lint` | Runs Oxlint to check code quality |

---

## 🗺️ Route Architecture

| Route | View Component | Description |
| :--- | :--- | :--- |
| `/` | `Home.jsx` | Editorial hero, value propositions, featured plots, lead capture |
| `/explore` | `ExploreLand.jsx` | Search, multifaceted filters, interactive land listing grid |
| `/property/:id` | `PropertyDetail.jsx` | Detailed property overview, soil/water data, inquiry form |
| `/partner` | `PartnerWithUs.jsx` | Landowner / institutional partner onboarding portal |
| `/community` | `Community.jsx` | Discussions, regulatory updates, and investor community |
| `/dashboard` | `Dashboard.jsx` | User portal for saved parcels, scheduled visits, inquiries |
| `/admin` | `AdminDashboard.jsx` | Admin oversight for listing approvals & analytics |
| `/login` | `Login.jsx` | Account authentication |
| `/register` | `Register.jsx` | New investor & partner registration |

---

## 🤖 AI Agent Guidelines

For developers or automated agents contributing to this codebase, please refer to [AGENTS.md](./AGENTS.md) for coding conventions, design system tokens, and architecture guidelines.

---

## 📄 License

This project was developed for academic and demonstration purposes as part of the Full Stack Development (FSD) curriculum.
