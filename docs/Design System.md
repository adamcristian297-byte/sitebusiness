# Design System

## Theme

Organic & Earthy. Solid, premium, trustworthy. No glassmorphism, no SaaS vibes.

## Colors (Hardcoded Hex)

| Token | Hex | Usage |
|---|---|---|
| Background | `#F9F7F3` | Main background (bone white) |
| Text | `#1C1A17` | Primary text (charcoal) |
| Primary | `#A44A3F` | Accent, buttons (terracotta) |
| Primary Hover | `#8E3F35` | Button hover state |
| Secondary | `#E8E4D9` | Secondary surfaces |
| Muted | `#5C5852` | Secondary text |
| Border | `#D6D0C4` | Card borders, dividers |

## Typography

| Role | Font | Weights |
|---|---|---|
| Headings | **Cormorant Garamond** (serif) | 400, 600 |
| Body | **Manrope** (sans-serif) | 400, 500 |

- Loaded via Google Fonts in `index.css`
- **Never use Inter or Roboto**

## Layout

- Container: `max-w-7xl mx-auto px-6`
- Spacing: generous (`p-8`, `p-16`, `p-24`)
- Border radius: `rounded-none` or `rounded-sm` max (0-4px)
- Surfaces: solid flat colors, subtle ambient shadows, no glassmorphism

## shadcn/ui Overrides

- All card borders: `1px solid #D6D0C4`
- Max border radius: `rounded-sm`
- Buttons: `translate-y-1` hover with darkened color

## Icons

- **Library:** lucide-react
- **Stroke width:** 1.5

## Animations

- **Framer Motion** for scroll-triggered staggered animations on service items

## Related
- [[Frontend]]
