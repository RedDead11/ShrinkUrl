# ShrinkURL

<p align="center">
  <a href="https://shrink-url-ten.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🔗_Launch_App-6366f1?style=for-the-badge&logoColor=white" alt="Launch App"/>
  </a>
</p>

A full-stack URL shortener built with React, TypeScript, Express, Prisma and PostgreSQL (Neon). Paste a long link, get a short one with click tracking, persistent history and rate limiting.

## ✨ Features

- 🔗 **URL Shortening:** Generate short codes instantly from any valid URL
- 📊 **Click Tracking:** Every redirect increments a click counter in the database
- 🔁 **Duplicate Detection:** Same URL always returns the same short code
- 🛡️ **Rate Limiting:** Prevents abuse with per-IP request limits
- ✅ **URL Validation:** Rejects malformed URLs and non-http/https protocols
- 💾 **Persistent History:** Last 5 shortened links saved to localStorage
- 📋 **One-click Copy:** Copy short links instantly to clipboard
- 📱 **Responsive Design:** Works on desktop and mobile

## 🚀 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL via Neon (serverless)
- **ORM:** Prisma with `@prisma/adapter-pg`
- **Rate Limiting:** express-rate-limit

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm
- A Neon account ([neon.tech](https://neon.tech))

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/shrinkurl.git
cd shrinkurl
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create a `.env` file inside the `backend/` folder:
```env
DATABASE_URL=your_neon_postgres_connection_string
```

5. **Set up the database**

Run this in your Neon SQL editor or via Prisma:
```bash
cd backend
npx prisma migrate dev --name init
```

Or manually using Prisma schema — the `url` table requires:

| Column | Type | Notes |
|--------|------|-------|
| id | String | Auto-generated CUID |
| originalUrl | String | The full URL |
| shortCode | String | Unique short identifier |
| clicks | Int | Defaults to 0 |
| createdAt | DateTime | Auto-set on creation |

6. **Start the backend**
```bash
cd backend
npm run dev
```
Runs on `http://localhost:3000`

7. **Start the frontend**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173`

## 📖 Usage

1. Paste any URL into the input field (with or without `https://`)
2. Click **Shorten** to generate a short link
3. Copy the short link or click **Visit** to test it
4. Your last 5 links appear in the **Recent Links** section below
5. Clicking a short link redirects and increments the click counter

## 🏗️ Project Structure

```
shrinkurl/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── controller.ts      # Request handlers
│   │   ├── services/
│   │   │   └── service.ts         # Business logic + Prisma calls
│   │   ├── routes/
│   │   │   └── routes.ts          # Express route definitions
│   │   ├── models/
│   │   │   └── model.ts           # TypeScript interfaces
│   │   ├── lib/
│   │   │   └── prisma.ts          # Prisma client setup
│   │   └── index.ts               # Express app entry point
│   └── prisma/
│       └── schema.prisma          # Database schema
└── frontend/
    └── src/
        └── components/
            ├── UrlShortener.tsx   # Parent, manages shared state
            ├── UrlForm.tsx        # Input form + validation
            ├── ResultCard.tsx     # Short link result display
            └── HistoryList.tsx    # Recent links section
```

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |

## 🛡️ Rate Limiting

The `/shorten` endpoint is rate limited to **20 requests per 10 minutes** per IP address. Redirect links (`/:shortCode`) are not rate limited.

## ✅ Implemented

- URL shortening with random short code generation
- URL validation (protocol check, malformed URL rejection)
- Duplicate URL detection (same URL returns existing short code)
- Click tracking on every redirect
- Rate limiting on the `/shorten` endpoint
- Persistent history via localStorage (last 5 links)
- Inline error messages on the frontend
- Component-based frontend architecture

## 🗺️ Roadmap

- [ ] Analytics endpoint (`GET /stats/:shortCode` to expose click data)
- [ ] Custom short codes (let users choose their own alias)
- [ ] Link expiration (auto-expire links after a set time)
- [ ] Proper 404 page for invalid short codes# ShrinkURL
