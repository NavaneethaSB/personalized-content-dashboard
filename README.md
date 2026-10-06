# PulseHub — Personalized Content Dashboard
> **SDE Intern Frontend Development Assignment Solution**  
> Built with Next.js (App Router), React 19, TypeScript, Redux Toolkit, Tailwind CSS, Framer Motion, Vitest, and Playwright.

---

## 📌 Executive Summary & Architecture

**PulseHub** is a high-performance, accessible, and reactive frontend dashboard designed for real-time multi-source content aggregation. It brings together breaking news, cinematic recommendations, and viral community discussions into a customizable single-page experience.

### 🏛 Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              PulseHub UI                               │
├─────────────────┬──────────────────────────────────────────────────────┤
│  Navigation     │  Header (Debounced Search, Theme, Profile, Settings) │
│  Sidebar        ├──────────────────────────────────────────────────────┤
│  • My Feed      │  Live Update Banner (SSE Real-Time Stream)           │
│  • Trending     ├──────────────────────────────────────────────────────┤
│  • Favorites    │  Filter Bar (Streams: News, Recs, Social | Topics)   │
│  • Analytics    ├──────────────────────────────────────────────────────┤
│  • Preferences  │  Feed List / Drag-and-Drop Reorderable Cards (DND)   │
└─────────────────┴──────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │                Redux Toolkit Global Store                │
       │  • feedSlice (items, filters, search, drag-and-drop)     │
       │  • preferencesSlice (categories, sources, theme, i18n)   │
       │  • favoritesSlice (saved items, search, export)          │
       │  • trendingSlice (top news, movies, social threads)      │
       │  • authSlice (mock user session, profile customization)  │
       └────────────────────────────┬─────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        Local Storage Cache                Internal API Handlers
     (Offline-First Persistence)          (SSE & Public Gateways)
                                           • /api/news (HackerNews / NewsAPI)
                                           • /api/recommendations (TVMaze / TMDB)
                                           • /api/social (Reddit / Mastodon)
                                           • /api/trending (Multi-Source Ranking)
                                           • /api/stream (Server-Sent Events)
```

---

## ✨ Core Features & Requirements Implementation

### 1. Personalized Content Feed
- **Configurable Preferences**: Select favorite topics from **Technology**, **Sports**, **Finance**, **Science**, **Entertainment**, and **Health**.
- **Multi-Source Fetching**:
  - **News API**: Latest global headlines with live HackerNews integration and optional NewsAPI key support.
  - **Recommendations API**: TV & cinema recommendations with live TVMaze integration and optional TMDB key support.
  - **Social Media API**: Community discussions with live Reddit JSON integration and high-fidelity fallback.
- **Interactive Content Cards**:
  - High-resolution thumbnails, media badges, source avatars, verified checkmarks.
  - Read times, Star ratings (`8.8 / 10`), tags, engagement counters (likes, comments, views).
  - Quick action buttons: **Read Story / Watch Preview / View Discussion**, **Favorite Bookmark**, **Share URL**, and interactive like button.
- **Full Article Modal**: In-depth reader modal with complete writeups, rich metadata, and source links.
- **Infinite Scrolling & Numbered Pagination**: Toggle between infinite scroll (Intersection Observer) and numbered pagination controls in user settings.

### 2. User Dashboard Layout
- **Responsive Layout**: Collapsible left sidebar for desktop and mobile slide-out drawer for small screens.
- **Top Header**: Global debounced search bar with keyboard shortcut (`/`), dark mode toggle, preferences button, and user profile drawer.
- **Sections**:
  1. **My Feed**: Unified stream with multi-source filtering and topic pills.
  2. **Trending**: Curated leaderboards for Top News, Must-Watch Movies/Shows, and Viral Discussions.
  3. **Favorites**: Offline-accessible bookmarked items with in-library search, category filtering, and JSON export.
  4. **Analytics**: Visual telemetry including category breakdown charts, engagement counters, and reading habits.

### 3. Search & Performance
- **Debounced Search**: Optimized with a custom `useDebounce` hook (350ms delay) to prevent UI lag while typing.
- **Keyboard Navigation**: Press `/` or `Ctrl+K` from anywhere to focus the search input.
- **Immediate Feedback**: Instant clearing, match highlighting, and empty state suggestions.

### 4. Advanced UI/UX
- **Drag-and-Drop Reordering**: Built with **Framer Motion** (`Reorder.Group` & `Reorder.Item`). Reorder cards smoothly with elevation shadows and persistence, plus a one-click "Reset Order" option.
- **Dark Mode**: Seamless toggle between Dark, Light, and System themes using CSS custom properties (`:root`, `.dark`) and Tailwind CSS.
- **Motion & Micro-Interactions**: Smooth layout transitions, animated badges, card hover lift, and skeleton loaders.

### 5. State Management & Offline Persistence
- **Redux Toolkit**: Modular slices (`preferencesSlice`, `feedSlice`, `favoritesSlice`, `trendingSlice`, `authSlice`) with typed hooks (`useAppDispatch`, `useAppSelector`).
- **Persistence**: Preferences, bookmarks, and user profiles are saved to `localStorage` and automatically hydrated on app load.

### 6. Bonus Features Included
- **Mock Authentication & Profile Customization**: Edit display name, email, bio, and choose avatar presets with persistent state.
- **Real-Time Data Streaming (SSE)**: Server-Sent Events (`/api/stream`) broadcasting periodic breaking updates with an active pulse indicator and "New posts available" banner.
- **Internationalization (i18n)**: Instant switching between **English**, **Español**, **Français**, **Deutsch**, and **हिन्दी (Hindi)**.

---

## 🧪 Testing Suite

PulseHub includes comprehensive Unit, Integration, and End-to-End (E2E) tests:

```bash
# Run Unit & Integration Tests (Vitest)
npm run test

# Run Vitest in watch mode
npm run test:watch

# Run End-to-End Tests (Playwright)
npm run test:e2e
```

### Test Coverage Highlights
- `preferencesSlice.test.ts`: Category selection limits, source toggles, theme changes.
- `favoritesSlice.test.ts`: Bookmarking logic, removal, clearing, and duplicates prevention.
- `feedSlice.test.ts`: Search filtering, source filtering, drag-and-drop reordering, SSE item injection.
- `useDebounce.test.ts`: Timer advancement and debounce accuracy.
- `ContentCard.test.tsx`: Component DOM rendering, bookmark trigger, like counter interaction, modal dispatch.
- `FeedIntegration.test.tsx`: Integration test verifying feed stream, source tabs, empty states, and network error handling.
- `e2e/dashboard.spec.ts`: Full browser user flow tests (search, favorites, modal reading, theme toggle, drag and drop).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x, 20.x, or 22+
- npm (or yarn / pnpm)

### Installation
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd personalized-content-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 🔑 API Configuration (Optional)

The application works **100% out-of-the-box** without any API keys, connecting to live public APIs (TVMaze, Hacker News, Reddit) with graceful fallbacks.

If you wish to test with your personal API keys:
1. Open the **Preferences (Settings)** modal in the dashboard.
2. Enter your **NewsAPI Key** and **TMDB API Key** under *Custom API Keys*.
3. Click **Apply Keys**.

---

## 📂 Project Structure

```
personalized-content-dashboard/
├── e2e/                             # Playwright E2E tests
│   └── dashboard.spec.ts
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/                     # Internal API routes & SSE stream
│   │   │   ├── news/route.ts
│   │   │   ├── recommendations/route.ts
│   │   │   ├── social/route.ts
│   │   │   ├── stream/route.ts
│   │   │   └── trending/route.ts
│   │   ├── globals.css              # Tailwind CSS & Theme variables
│   │   ├── layout.tsx               # Root layout & StoreProvider
│   │   └── page.tsx                 # Main dashboard orchestrator
│   ├── components/
│   │   ├── common/                  # Reusable UI (Modal, Badge, Skeleton, ThemeToggle)
│   │   ├── feed/                    # ContentCard, FeedList, FilterBar, LiveBanner, ArticleModal
│   │   ├── trending/                # TrendingSection with category radars
│   │   ├── favorites/               # FavoritesSection with export & filter
│   │   ├── analytics/               # Visual metrics & category charts
│   │   ├── settings/                # Preferences modal
│   │   ├── profile/                 # Profile & authentication modal
│   │   └── layout/                  # Sidebar, Header, MobileNav
│   ├── hooks/                       # useDebounce, useLiveStream
│   ├── lib/                         # mockData, apiClients, i18n, utils
│   ├── store/                       # Redux Toolkit store, hooks, slices
│   │   └── slices/
│   │       ├── preferencesSlice.ts
│   │       ├── feedSlice.ts
│   │       ├── favoritesSlice.ts
│   │       ├── trendingSlice.ts
│   │       └── authSlice.ts
│   ├── types/                       # TypeScript models
│   └── __tests__/                   # Vitest unit & integration tests
├── vitest.config.ts                 # Vitest test configuration
├── vitest.setup.ts                  # Vitest DOM polyfills
├── playwright.config.ts             # Playwright E2E configuration
└── package.json
```

---

## 🏆 Evaluation Criteria Checklist

- [x] **Personalized Content Feed**: User preferences persisted in localStorage & Redux; multi-source data fetching (News, Recommendations, Social).
- [x] **Interactive Content Cards**: Images, headlines, descriptions, ratings, CTAs, favorites bookmarking, full reader modal.
- [x] **Pagination & Infinite Scroll**: User-selectable infinite scroll or numbered pagination.
- [x] **Dashboard Layout**: Responsive desktop sidebar + mobile drawer, header with debounced search, account profile, and theme toggle.
- [x] **Sections**: My Feed, Trending Radar, Offline Favorites, Analytics Insights.
- [x] **Debounced Search**: Keyboard accessible (`/`), smooth 350ms debounce with instant clearing.
- [x] **Drag-and-Drop Organization**: Framer Motion reordering with persistence and reset button.
- [x] **Dark Mode**: CSS custom properties + Tailwind dark mode.
- [x] **State Management**: Redux Toolkit slices, async thunks, typed hooks, localStorage synchronization.
- [x] **Testing**: 24 Unit & Integration tests (Vitest) + Playwright E2E test suite.
- [x] **Bonus Features**: Mock user authentication, profile customization, Server-Sent Events (SSE) real-time stream, 5-language internationalization.
