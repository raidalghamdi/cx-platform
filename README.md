# CX Platform — منصة تجربة المستفيد

> An enterprise-grade, bilingual (Arabic / English with full RTL) Customer Experience Platform for Saudi government and large GCC organizations. Built to the official **DGA Saudi Digital Government Design System**, anchored to **DGA · EFQM · ISO 9001 · ISO 10002 · WCAG 2.2 AA · PDPL · NCA ECC**.

**Live demo:** Open the [CX Platform](https://www.perplexity.ai/computer/a/cx-platform-f3FIXXEVRrynzOM_Zmw4Iw)

---

## 🌟 Highlights

- 🇸🇦 **DGA-compliant** — Saudi green `#25935F`, Vision 2030 gold `#F8BD02`, IBM Plex Sans + IBM Plex Sans Arabic
- 🌐 **Fully bilingual** — Arabic (default) + English with complete RTL layout mirroring
- 👥 **6 role-based experiences** — Executive, Supervisor, Agent, Quality Officer, Beneficiary (المستفيد), Admin
- 🧩 **11 in-app modules** covering all 22 sections of the master CX Blueprint
- 📱 **Fully responsive** — mobile, tablet, desktop
- ✨ **Premium UI craft** — animated KPIs, sparklines, hero patterns, hover lift, designed empty states

---

## 🔐 Demo Credentials

All accounts use the password **`demo`**

| Role | Email | Lands on |
|---|---|---|
| Executive | `executive@cx.gov.sa` | Executive Scorecard |
| Supervisor | `supervisor@cx.gov.sa` | Executive Scorecard |
| Agent | `agent@cx.gov.sa` | Agent Inbox |
| Quality Officer | `quality@cx.gov.sa` | Complaints |
| Beneficiary | `customer@cx.gov.sa` | Beneficiary Portal |
| Admin | `admin@cx.gov.sa` | Admin Console |

The login page shows all six accounts as clickable cards — clicking any row auto-fills the form.

---

## 🧭 Modules

### Overview
- **About / Vision** (`/about`) — Strategic lenses, business outcomes, beneficiary outcomes, scope

### Operate
- **Executive Scorecard** (`/dashboard`) — CSAT, NPS, CES, FCR, SLA compliance, channel mix, complaint trends, sentiment themes
- **Service Journeys** (`/journeys`) — 5 editable bilingual journeys (Healthcare Appointment · Driver License Renewal · Business Registration · Complaint Resolution · School Enrollment) with stage grid, emotion curve, touchpoints, customer actions, opportunities, full CRUD
- **Complaints** (`/complaints`) — ISO 10002 lifecycle, SLA timers, detail Sheet with 5 tabs
- **Agent Inbox** (`/inbox`) — Omnichannel queue + conversation thread + Customer 360°
- **Voice of Customer** (`/voc`) — Surveys, sentiment, themes, closed-loop follow-up
- **Knowledge Base** (`/kb`) — Bilingual articles, categories, search, ratings
- **Beneficiary Portal** (`/portal`) — Citizen-facing tile dashboard, submit/track requests
- **AI Copilot** (`/copilot`) — Mock LLM with human-oversight badges

### Govern
- **Governance & Compliance** (`/governance`) — 6 tabs:
  1. Strategic Alignment (Vision 2030 + DGA maturity + EFQM scorecard)
  2. Standards Traceability (~70 requirements mapped to DGA / EFQM / ISO / WCAG / PDPL / NCA ECC)
  3. Compliance Status (8 standards with gauges and findings)
  4. Governance & RACI (forums + 9 roles × 12 activities)
  5. NFRs (uptime, RTO/RPO, P95, security, WCAG conformance)
  6. Integrations Registry (25 services — Nafath, Absher, SADAD, Sehhaty, etc.)
- **Programme** (`/programme`) — 4 tabs:
  1. Roadmap (4-phase 12–18 month Gantt)
  2. RAID Log (risks/assumptions/issues/dependencies + 5×5 heatmap)
  3. Cost & Value (3-year TCO + benefits realisation + ROI)
  4. Change & Training (ADKAR readiness, training catalogue, adoption metrics)
- **Audit Log** (`/audit`)

### System
- **Admin Console** (`/admin`) — Users, Roles & Permissions, Channels, SLA Policies, Escalation Matrix, Lookups

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + Vite + TypeScript |
| Routing | Wouter (hash routing) |
| Server | Express.js |
| Database | SQLite + Drizzle ORM (template-ready, currently using in-memory state) |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| State | TanStack Query + React Context |
| i18n | Custom LocaleContext (no library — minimal footprint) |
| Fonts | IBM Plex Sans + IBM Plex Sans Arabic |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
git clone https://github.com/<your-username>/cx-platform.git
cd cx-platform
npm install
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

### Production Build
```bash
npm run build
NODE_ENV=production node dist/index.cjs
```

---

## 🌍 Deploy

### Vercel (frontend only)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F<your-username>%2Fcx-platform)

Set **Build Command** to `npm run build` and **Output Directory** to `dist/public`.

### Railway / Render / Fly.io (full stack)
Deploy the whole monorepo. Start command:
```bash
NODE_ENV=production node dist/index.cjs
```
Expose port `5000`.

### Docker
A simple Dockerfile (not yet included) — multi-stage build, copy `dist/`, run the server.

---

## 📂 Project Structure

```
cx-platform/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/             # Page components (Login, Dashboard, Journeys, etc.)
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui primitives
│   │   │   ├── shell/         # AppShell, Sidebar, Topbar
│   │   │   ├── brand/         # HeroPattern, CountUp, Sparkline, InitialsAvatar
│   │   │   └── journeys/      # Journey-specific components
│   │   ├── contexts/          # LocaleContext, AuthContext, JourneyContext
│   │   ├── lib/               # i18n, seed data, queryClient, utils
│   │   └── index.css          # DGA design tokens (HSL)
│   └── index.html
├── server/                    # Express backend
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts             # Drizzle storage layer
├── shared/
│   └── schema.ts              # Drizzle SQLite schema
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 🎨 Design System

This platform implements the **official DGA Saudi Government Design System** ([design.dga.gov.sa](https://design.dga.gov.sa)):

| Token | Value |
|---|---|
| Primary | Saudi Green `#25935F` (SA-500) |
| Accent | Vision 2030 Gold `#F8BD02` |
| Body font | IBM Plex Sans |
| Arabic font | IBM Plex Sans Arabic |
| Border radius | 8px (buttons/inputs), 12px (cards), full (pills) |
| Focus ring | 2px SA-500 + 4px SA-300 halo |
| Base grid | 4px |
| Breakpoints | 375 / 768 / 1024 / 1280 / 1440 px |

Full design tokens are defined as CSS variables in [`client/src/index.css`](client/src/index.css).

---

## 📊 Coverage

This platform implements **20 of 22 sections** from the master CX Blueprint:

| # | Blueprint Section | Module / Page |
|---|---|---|
| 1 | Executive Overview | About |
| 2 | Vision, Scope, Boundaries | About |
| 3 | Strategic Alignment | Governance → Strategic Alignment |
| 4 | Personas & Role-Based Views | 6 demo logins, role-gated nav |
| 5 | Experience Journeys | Service Journeys (5 editable journeys) |
| 6 | Business Requirements | Governance → Standards Traceability |
| 7 | Functional Requirements | 8 operate modules |
| 8 | UX / UI / Accessibility | DGA-compliant theme |
| 9 | Bilingual / Localization | Full RTL, AR default |
| 10 | Data Architecture | _Implicit via modules_ |
| 11 | Integration Architecture | Governance → Integrations Registry |
| 12 | AI & Emerging Tech | AI Copilot |
| 13 | Non-Functional Requirements | Governance → NFRs |
| 14 | Security/Privacy/Risk/Compliance | Governance → Compliance Status |
| 15 | Governance & Operating Model | Governance → Governance & RACI |
| 16 | Reporting & Metrics | Executive Scorecard |
| 17 | Roadmap | Programme → Roadmap |
| 18 | Risks, Assumptions, Dependencies | Programme → RAID Log |
| 19 | TCO | Programme → Cost & Value |
| 20 | Change Management & Training | Programme → Change & Training |
| 21 | Standards Traceability | Governance → Standards Traceability |
| 22 | Self-Audit / Quality Gate | _Implicit_ |

---

## 🤝 Contributing

This is a demonstration platform. Contributions, ideas, and bilingual translations are welcome — open an issue or a pull request.

---

## 📜 License

This project is released for **demonstration and reference purposes**. All trademarks, government identities, and design assets remain the property of their respective owners. The **DGA Design System** assets are referenced under their official guidelines.

---

## 🙏 Acknowledgements

- **Saudi Digital Government Authority (DGA)** — for the official Saudi Design System
- **IBM** — for the open-source IBM Plex font family
- **shadcn/ui · Tailwind CSS · Lucide · Recharts** — for the open-source UI tooling
- **Vision 2030** — for the strategic direction this platform aligns to

---

## 📞 Contact

Built by [Raid Al-Ghamdi](https://github.com/raid-alghamdi) — Chief of Strategy and Business Excellence Officer, Saudi Arabia.

For questions, feedback, or partnership inquiries: open an issue on this repository.
