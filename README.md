# Horizon Properties

A premium real estate website: editorial architecture-led design, a full property discovery flow and
working enquiry handling.

## Stack

* **Frontend** — Vite, React 18, TypeScript, Tailwind CSS, React Router
* **API** — Express (enquiry capture, JSON store)
* **Imagery** — Unsplash CDN with responsive `srcset`

## Structure

```
src/
  components/
    layout/     Header, Footer, Layout, PageHero
    property/   PropertyCard, PropertyCarousel, PropertyFilters, Gallery, InquiryModal, FavoriteButton
    sections/   Hero, WhoWeAre, FeaturedProperties, ServicesSection, WhyHorizon, TeamSection, CtaSection
    forms/      InquiryForm, NewsletterForm
    ui/         Button, SmartImage, Reveal, SectionHeading, Logo
  data/         properties.ts (12 listings), site.ts (nav, services, team, stats)
  hooks/        useFavorites (localStorage)
  lib/          filters, images, format, api, cx
  pages/        Home, Properties, PropertyDetail, About, Services, Team, Contact, NotFound
server/         Express API for enquiries
```

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

Run the API alongside it (`cd server && npm install && npm start`) or use the compose stack, which
starts both with live reload:

```bash
docker compose -f docker-compose.base44.yml up -d --build   # site on http://localhost:3000
```

## Content

Listings live in `src/data/properties.ts`; navigation, services, team and stats in `src/data/site.ts`.
Both are typed modules shaped like database rows, so they can be swapped for API responses without
touching the components.

## API

| Method | Route            | Purpose                                        |
| ------ | ---------------- | ---------------------------------------------- |
| GET    | `/api/health`    | Health probe                                   |
| POST   | `/api/inquiries` | Contact, viewing request and newsletter signup |
| GET    | `/api/inquiries` | Read back the most recent 50 enquiries         |
