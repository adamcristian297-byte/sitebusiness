# RRS Team IMP — Product Requirements Document

## Original Problem Statement
Construirea unui site de business pentru RRS Team IMP (proprietar: Ionut Encea), firmă ce execută beton amprentat, elicopterizat și verticalizat în toată România. Materialele provin din Spania (certificat de conformitate), garanția pentru beton se obține de la stația de beton (certificat de conformitate). Site-ul include: secțiuni publice (servicii, despre, galerie, recenzii, contact funcțional) + admin panel pentru gestionarea galeriei, recenziilor și mesajelor.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor). JWT auth cu httpOnly cookies (12h access + 7d refresh), bcrypt pentru parole.
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn. Sonner toasts. Axios cu `withCredentials: true`.
- **Storage**: Emergent Object Storage pentru imagini galerie (init la startup).
- **Fonts**: Cormorant Garamond (headings) + Manrope (body).
- **Theme**: Bone white #F9F7F3, charcoal #1C1A17, accent terracotta #A44A3F.

## User Personas
1. **Vizitator public**: navighează site-ul, vede serviciile, galeria, recenziile; trimite mesaj de contact.
2. **Ionut Encea (admin)**: logare, încarcă/șterge poze galerie, gestionează recenziile (adaugă/aprobă/șterge), citește mesajele primite.

## Core Requirements (static)
- Limba: Romanian
- Public: hero + servicii (3 tipuri) + despre + galerie + recenzii + contact
- Admin panel cu sidebar: Prezentare, Galerie, Recenzii, Mesaje
- JWT cookie auth, single admin seed din .env
- Gallery upload via object storage; soft delete în DB

## What's Been Implemented (2026-05-20)
- Backend complet: `/api/` + auth (login, logout, me, refresh) + public (gallery, gallery/image/{id}, reviews, contact) + admin (gallery CRUD, reviews CRUD/approve, messages list/read/delete, stats)
- Admin seeded din .env: `admin@rrsteam.ro` / `admin123`
- Object Storage initialized la startup
- Frontend public: Header (sticky), Hero (cu imagine de fundal), Services (3 secțiuni alternate cu poze), About/Quality, Gallery (cu fallback dacă DB e goală + lightbox), Reviews (cu fallback), Contact form funcțional, Footer
- Frontend admin: Login page, AdminLayout cu sidebar, Overview cu stats, GalleryAdmin (upload + delete), ReviewsAdmin (create/toggle approve/delete), MessagesAdmin (list/mark read/delete)
- AuthContext + ProtectedRoute
- Tested end-to-end: 17/17 backend pytest + frontend Playwright — toate fluxurile PASS

## Backlog / Future Enhancements (P0/P1/P2)
- **P1**: Notificare email când se primește mesaj nou (necesită Resend API key)
- **P1**: Drag & drop reorder pentru imaginile din galerie
- **P1**: WhatsApp click-to-chat CTA în hero (lead conversion direct pe telefonul lui Ionut)
- **P2**: Multi-image upload în GalleryAdmin
- **P2**: Filtre/categorii pentru galerie (amprentat / elicopterizat / verticalizat)
- **P2**: SEO meta tags + OpenGraph
- **P2**: Sitemap.xml + robots.txt
- **P2**: Formular cu upload poză a locului de către client în contact

## Next Tasks
1. Cere feedback de la Ionut despre conținut (texte, telefon corect, eventual email)
2. Adăugare WhatsApp deep-link pentru conversie rapidă (1-click contact)
3. Email notification la mesaje noi (Resend / SendGrid)
