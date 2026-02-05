<div align="center">

```
     ___   ____            ___  __  __ _____ ____    _
    / _ \ |___ \          / _ \|  \/  | ____/ ___|  / \
   | | | |  __) |  _____ | | | | |\/| |  _|| |  _  / _ \
   | |_| | / __/  |_____|| |_| | |  | | |__| |_| |/ ___ \
    \___/ |_____|          \___/|_|  |_|_____\____/_/   \_\
```

### Next-Generation Intelligence Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMaca2024%2FO2-OMEGA)

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2997ff?style=for-the-badge&logo=github)](https://maca2024.github.io/O2-OMEGA/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMaca2024%2FO2-OMEGA)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-See_LICENSE-lightgrey?style=for-the-badge)](LICENSE)

---

*Krachtig. Intuitief. Grenzeloos.*

</div>

---

## Inhoudsopgave

- [Over het Project](#-over-het-project)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Technische Stack](#-technische-stack)
- [Architectuur](#-architectuur)
- [Aan de Slag](#-aan-de-slag)
- [Projectstructuur](#-projectstructuur)
- [Design Systeem](#-design-systeem)
- [Responsief Ontwerp](#-responsief-ontwerp)
- [Performance](#-performance)
- [Toegankelijkheid](#-toegankelijkheid)
- [Deployment](#-deployment)
- [Bijdragen](#-bijdragen)

---

## Over het Project

O2-OMEGA is een premium landingspagina gebouwd met een **Apple.com-geinspireerd** design. Het project demonstreert een modern, minimalistisch web-ontwerp met vloeiende animaties, een volledig functionerend donker/licht thema systeem, en een mobile-first responsieve aanpak.

### Ontwerpfilosofie

| Principe | Toepassing |
|---|---|
| **Minimalisme** | Grote witruimte, bewuste typografie, alleen essentiele elementen |
| **Visuele Hierarchie** | Bold titels, gradient accenten, gelaagde informatie |
| **Glasmorfisme** | Transparante navigatie met `backdrop-filter: blur` |
| **Micro-interacties** | Hover-effecten, scroll-animaties, teller-animaties |
| **Content-first** | Typografie en kleur sturen de aandacht, niet decoratie |

---

## Screenshots

### Dark Mode (standaard)
```
+--------------------------------------------------+
|  [O2]  Features  Technologie  Specs  Prijzen  [*] |  <-- Glazen navigatiebalk
+--------------------------------------------------+
|                                                    |
|                      O2                            |
|                    OMEGA                           |  <-- Hero met gradient tekst
|                                                    |
|    De volgende generatie in intelligente            |
|              technologie.                          |
|                                                    |
|        [Ontdek meer]  [Bekijk prijzen]             |
|                                                    |
|                     |                              |  <-- Scroll indicator
+--------------------------------------------------+
|                                                    |
|   +-------------------+  +-------------------+     |
|   | Quantum Processing|  | Neural Mesh       |     |  <-- Feature kaarten
|   | Engine            |  | Network           |     |      met 3D kubus &
|   |     [3D Cube]     |  |   [Canvas Mesh]   |     |      canvas animatie
|   +-------------------+  +-------------------+     |
|                                                    |
|   +---------+ +---------+ +---------+ +---------+ |
|   |Security | |Speed    | |Platform | |Modular  | |  <-- 4x kleine features
|   +---------+ +---------+ +---------+ +---------+ |
+--------------------------------------------------+
|                                                    |
|         (( ))  Pulserende tech-ringen              |
|                                                    |
|     10x       99.9%      256-bit      50ms        |  <-- Geanimeerde tellers
+--------------------------------------------------+
|   +----------+  +----------+  +----------+         |
|   |  Starter |  |  Pro     |  | Enterprise|        |  <-- Pricing grid
|   |   EUR 0   |  |  EUR 49  |  |  EUR 199  |        |
|   +----------+  +----------+  +----------+         |
+--------------------------------------------------+
|           Klaar voor de toekomst?                  |
|   [Start gratis]    [Neem contact op]              |  <-- CTA sectie
+--------------------------------------------------+
|  O2-OMEGA  |  Product  |  Bedrijf  |  Support     |
|  (c) 2026  |  Privacy  |  Voorwaarden  |  Cookies |  <-- Footer
+--------------------------------------------------+
```

### Light Mode
```
Dezelfde layout, automatisch omgezet naar lichte kleuren:
  - Achtergrond: #ffffff / #f5f5f7
  - Tekst: #1d1d1f / #6e6e73
  - Accent: #0071e3 (Apple blauw)
  - Subtielere schaduwen en borders
```

### Mobiel (< 768px)
```
+----------------------+
| [O2]       [*] [=]   |  <-- Compacte nav + hamburger
+----------------------+
|                      |
|        O2            |
|      OMEGA           |  <-- Aangepaste typografie
|                      |
|  Krachtig. Intuitief.|
|                      |
| [Ontdek] [Prijzen]   |
+----------------------+
| +------------------+ |
| | Quantum Engine   | |  <-- Full-width kaarten
| |    [3D Cube]     | |
| +------------------+ |
+----------------------+
|  +----+  +----+      |
|  |Sec | |Spd |      |  <-- 1-kolom grid
|  +----+  +----+      |
+----------------------+
```

---

## Features

### Kern Features

```
    Dark Mode                    Responsive Design              Animaties
   +----------+                 +----------+                  +----------+
   |          |                 |          |                  |          |
   |  *  / *  | <-- Toggle     | Desktop  | <-- 3 break-    | Scroll   | <-- Intersection
   | Zon  Maan|     met        | Tablet   |     points      | Reveal   |     Observer
   |          |     localStorage| Mobiel   |                  | Counters |
   +----------+                 +----------+                  +----------+
```

| Feature | Beschrijving |
|---|---|
| **Dark/Light Mode** | Standaard dark theme met toggle. Keuze opgeslagen in `localStorage`. Respecteert `prefers-color-scheme`. |
| **Glasmorfisme Nav** | Vaste navigatiebalk met `backdrop-filter: saturate(180%) blur(20px)` voor een frosted-glass effect. |
| **3D Kubus Animatie** | CSS `transform-style: preserve-3d` draaiende kubus als visueel element. |
| **Neural Mesh Canvas** | HTML5 Canvas met 40 verbonden deeltjes die reageren op viewport. Alleen actief als zichtbaar (performance). |
| **Floating Particles** | 30 unieke deeltjes in de hero, elk met eigen keyframe-animatie en drift-richting. |
| **Scroll Animaties** | Elementen verschijnen met gestaffelde fade-in bij scrollen via `IntersectionObserver`. |
| **Teller Animaties** | Statistieken tellen op van 0 naar hun doelwaarde met ease-out-cubic easing. |
| **Smooth Scroll** | Ankerlinks scrollen vloeiend met correctie voor navbar-hoogte. |
| **Mobiel Menu** | Fullscreen overlay met hamburger-naar-X animatie en `overflow: hidden` body lock. |
| **Keyboard Nav** | `Escape` sluit het mobiel menu. Alle interactieve elementen zijn toetsenbord-bereikbaar. |
| **Reduced Motion** | `prefers-reduced-motion: reduce` schakelt alle animaties en transities uit. |

---

## Technische Stack

```
+-------------------------------------------------------+
|                     FRONTEND                           |
+-------------------------------------------------------+
|                                                        |
|  +-------------+  +-------------+  +---------------+  |
|  |   HTML5     |  |   CSS3      |  |  JavaScript   |  |
|  |             |  |             |  |   (ES5/ES6)   |  |
|  | - Semantisch|  | - Custom    |  |               |  |
|  | - Toeganke- |  |   Properties|  | - IIFE Pattern|  |
|  |   lijk      |  | - Grid/Flex |  | - Intersection|  |
|  | - SVG icons |  | - Animations|  |   Observer    |  |
|  | - Canvas    |  | - Media     |  | - Canvas API  |  |
|  |             |  |   Queries   |  | - localStorage|  |
|  +-------------+  +-------------+  +---------------+  |
|                                                        |
+-------------------------------------------------------+
|                    HOSTING                              |
+-------------------------------------------------------+
|                                                        |
|  +---------------------+  +------------------------+  |
|  | GitHub Pages        |  | GitHub Actions CI/CD   |  |
|  | (Static hosting)    |  | (Auto-deploy on push)  |  |
|  +---------------------+  +------------------------+  |
|                                                        |
+-------------------------------------------------------+
|                   FONTS                                 |
+-------------------------------------------------------+
|                                                        |
|  Google Fonts: Inter (300-900)                         |
|  Fallback: -apple-system, BlinkMacSystemFont, ...     |
|                                                        |
+-------------------------------------------------------+
```

### Zero Dependencies

Dit project gebruikt **geen frameworks, geen build tools, geen npm packages**. Alles is pure HTML, CSS en JavaScript. Dit zorgt voor:

- Onmiddellijke laadtijden
- Geen supply chain risico's
- Eenvoudig te hosten op elke statische server
- Maximale controle over elke pixel

---

## Architectuur

```
Gebruiker opent pagina
        |
        v
+---[ index.html ]---+
|                     |
|  <link> --> css/style.css        (alle stijlen + thema's + responsive)
|  <script> --> js/main.js         (alle interactiviteit)
|  <link> --> assets/favicon.svg   (SVG favicon)
|  <link> --> Google Fonts         (Inter font)
|                     |
+---------------------+
        |
        v
+---[ CSS Architecture ]---+
|                           |
|  :root                    |  <-- Globale design tokens (spacing, radius, transitions)
|  [data-theme="dark"]      |  <-- 20 kleur-variabelen voor dark mode
|  [data-theme="light"]     |  <-- 20 kleur-variabelen voor light mode
|  Componenten              |  <-- Nav, Hero, Features, Tech, Specs, Pricing, Footer
|  @media queries           |  <-- Mobile (< 768), Tablet (768+), Desktop (1024+)
|  @media reduced-motion    |  <-- Toegankelijkheid
|                           |
+---------------------------+
        |
        v
+---[ JS Architecture ]---+
|                          |
|  IIFE ('use strict')     |  <-- Geen globale scope vervuiling
|    |                     |
|    +-- Theme Manager     |  <-- localStorage get/set, data-theme toggle
|    +-- Mobile Menu       |  <-- Toggle, close, body scroll lock
|    +-- Scroll Handler    |  <-- rAF-throttled, nav.scrolled class
|    +-- Smooth Scroll     |  <-- Anchor links met nav-offset correctie
|    +-- Scroll Animations |  <-- IntersectionObserver + stagger delay
|    +-- Counter Animation |  <-- rAF-based met ease-out-cubic easing
|    +-- Neural Mesh       |  <-- Canvas particles + connections, visibility-aware
|    +-- Hero Particles    |  <-- 30x unieke CSS keyframe animaties
|    +-- Keyboard a11y     |  <-- Escape handler
|                          |
+--------------------------+
```

---

## Aan de Slag

### Vereisten

Geen. Dit is een statische site. Je hebt alleen een webbrowser nodig.

### Lokaal draaien

```bash
# Clone de repository
git clone https://github.com/Maca2024/O2-OMEGA.git
cd O2-OMEGA

# Open in je browser (kies een methode):

# Methode 1: Direct openen
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Methode 2: Python HTTP server
python3 -m http.server 8080
# Open http://localhost:8080

# Methode 3: Node.js (npx)
npx serve .
# Open http://localhost:3000

# Methode 4: VS Code Live Server
# Installeer de Live Server extensie en klik "Go Live"
```

---

## Projectstructuur

```
O2-OMEGA/
|
+-- index.html                   Hoofdpagina (505 regels)
|     |-- Navigation             Glasmorfisme nav + dark mode toggle
|     |-- Mobile Menu            Fullscreen overlay menu
|     |-- Hero Section           Titel, subtitel, CTA knoppen, particles
|     |-- Intro Statement        Gradient-tekst introductie
|     |-- Features Section       2 grote + 4 kleine feature kaarten
|     |-- Technology Section     Geanimeerde ringen, stats, details
|     |-- Specs Section          6-cel specificatie grid
|     |-- Pricing Section        3 prijskaarten (Starter/Pro/Enterprise)
|     |-- CTA Section            Afsluitende call-to-action
|     +-- Footer                 Links grid + copyright
|
+-- css/
|    +-- style.css               Alle stijlen (1339 regels)
|          |-- Design Tokens     CSS custom properties (:root)
|          |-- Dark Theme        20 kleur-variabelen
|          |-- Light Theme       20 kleur-variabelen
|          |-- Reset & Base      CSS reset, typografie
|          |-- Componenten       Nav, Hero, Buttons, Sections...
|          |-- Animaties         Keyframes: scrollPulse, rotateCube...
|          |-- Responsive        3 breakpoints + reduced motion
|          +-- System Pref       prefers-color-scheme fallback
|
+-- js/
|    +-- main.js                 Alle JavaScript (380 regels)
|          |-- Theme Manager     Dark/light toggle + localStorage
|          |-- Mobile Menu       Open/close/escape handlers
|          |-- Scroll Handler    rAF-throttled nav styling
|          |-- Scroll Reveal     IntersectionObserver animaties
|          |-- Counter Anim      Eased number counting
|          |-- Neural Mesh       Canvas deeltjessysteem
|          |-- Hero Particles    30 unieke keyframe animaties
|          +-- Keyboard A11Y    Escape key handler
|
+-- assets/
|    +-- favicon.svg             SVG favicon (O2-OMEGA logo)
|
+-- .github/
|    +-- workflows/
|         +-- deploy.yml         GitHub Actions: auto-deploy naar Pages
|
+-- LICENSE                      Licentie
+-- README.md                    Dit bestand
+-- CONTEXT.md                   Technische context & architectuur details
```

---

## Design Systeem

### Kleurenpalet

#### Dark Mode (standaard)

| Variabele | Waarde | Gebruik |
|---|---|---|
| `--color-bg` | `#000000` | Hoofdachtergrond |
| `--color-bg-elevated` | `#1c1c1e` | Verhoogde secties |
| `--color-bg-card` | `rgba(28,28,30,0.8)` | Kaart achtergronden |
| `--color-text-primary` | `#f5f5f7` | Hoofdtekst |
| `--color-text-secondary` | `#a1a1a6` | Subtekst |
| `--color-text-tertiary` | `#6e6e73` | Tertiaire tekst |
| `--color-accent` | `#2997ff` | Primair accent (Apple blauw) |
| `--color-gradient-start` | `#2997ff` | Gradient start |
| `--color-gradient-end` | `#a855f7` | Gradient eind (paars) |

#### Light Mode

| Variabele | Waarde | Gebruik |
|---|---|---|
| `--color-bg` | `#ffffff` | Hoofdachtergrond |
| `--color-bg-elevated` | `#f5f5f7` | Verhoogde secties (Apple grijs) |
| `--color-text-primary` | `#1d1d1f` | Hoofdtekst |
| `--color-accent` | `#0071e3` | Primair accent |

### Typografie

```
Font:    Inter (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

Weights:    300 (Light)    --> Subtitels, beschrijvingen
            400 (Regular)  --> Bodytekst
            500 (Medium)   --> Knoppen, labels
            600 (Semibold) --> Koppen, nav items
            700 (Bold)     --> Sectie titels, prijzen
            800 (Heavy)    --> Feature tokens
            900 (Black)    --> Hero titel

Sizing:     Hero:     clamp(4rem, 15vw, 10rem)
            Section:  clamp(2rem, 5vw, 3.5rem)
            Intro:    clamp(1.5rem, 4vw, 2.75rem)
            Body:     0.85rem - 1.15rem
```

### Spacing Schaal

```
--space-xs:   0.25rem  (4px)
--space-sm:   0.5rem   (8px)
--space-md:   1rem     (16px)
--space-lg:   1.5rem   (24px)
--space-xl:   2rem     (32px)
--space-2xl:  3rem     (48px)
--space-3xl:  4rem     (64px)
--space-4xl:  6rem     (96px)
--space-5xl:  8rem     (128px)
```

---

## Responsief Ontwerp

```
              Mobile              Tablet              Desktop
            (< 768px)          (768 - 1023px)        (>= 1024px)
          +-------------+    +------------------+   +----------------------+
Nav:      | Logo  [*][=]|    | Logo Links  [*]  |   | Logo  Links   [*][CTA]|
          +-------------+    +------------------+   +----------------------+

Features: | [Card Full] |    | [Card] | [Card]  |   | [Card]  |  [Card]   |
          | [Card Full] |    | [1][2][3][4]     |   | [1] [2] [3] [4]    |
          | [1]         |    +------------------+   +----------------------+
          | [2]         |
          | [3]         |    Specs:                  Specs:
          | [4]         |    | [1] | [2] | [3] |    | [1] | [2] | [3] |
          +-------------+    | [4] | [5] | [6] |    | [4] | [5] | [6] |
                             +------------------+   +----------------------+
Specs:    | [1]         |
          | [2]         |    Pricing:                Pricing:
          | [3]         |    |[S] | [Pro] | [E] |   |[S] | [Pro*] | [E]  |
          | [4]         |    +------------------+   +----------------------+
          | [5]         |                            * Pro kaart is 1.05x geschaald
          | [6]         |
          +-------------+

Pricing:  | [Starter]   |
          | [Pro]       |
          | [Enterprise]|
          +-------------+

Footer:   | Brand       |    | Brand             |   | Brand | Prod | Bedr | Sup |
          | Prod | Bedr |    | Prod | Bedr | Sup |   +----------------------+
          +-------------+    +------------------+
```

### Breakpoints

| Breakpoint | Pixels | Veranderingen |
|---|---|---|
| Mobile | `< 768px` | Nav links verborgen, hamburger menu, 1-kolom grids, kleiner hero |
| Tablet | `>= 768px` | Feature cards 2-kolom, 3-kolom specs, 3-kolom pricing, nav links zichtbaar |
| Desktop | `>= 1024px` | Kleinere nav hoogte (48px), bredere container padding, grotere tech rings |

---

## Performance

### Optimalisaties

```
+-- Zero Dependencies           Geen frameworks = geen bloat
|
+-- CSS Custom Properties       Theme switching zonder re-render
|
+-- IntersectionObserver        Animaties alleen als zichtbaar
|    +-- Scroll reveal           Auto-unobserve na trigger
|    +-- Counter animation       Start pas bij 50% visibility
|    +-- Neural mesh canvas      Start/stop op basis van visibility
|
+-- requestAnimationFrame       Scroll handler is rAF-throttled
|
+-- Passive Event Listeners     scroll event met { passive: true }
|
+-- Font Preconnect             <link rel="preconnect"> voor Google Fonts
|
+-- SVG Icons                   Inline SVGs, geen icon font of sprite sheet
|
+-- Canvas Performance          DevicePixelRatio-aware, stop als niet zichtbaar
```

### Estimated Bundle Size

| Bestand | Grootte | Gecomprimeerd (gzip) |
|---|---|---|
| `index.html` | ~26 KB | ~5 KB |
| `css/style.css` | ~28 KB | ~5 KB |
| `js/main.js` | ~10 KB | ~3 KB |
| `assets/favicon.svg` | ~0.5 KB | ~0.3 KB |
| **Totaal** | **~65 KB** | **~13 KB** |

---

## Toegankelijkheid

| Feature | Implementatie |
|---|---|
| **Keyboard navigatie** | Alle interactieve elementen bereikbaar via Tab. Escape sluit mobile menu. |
| **ARIA labels** | `aria-label` op theme toggle en hamburger menu knop. |
| **SVG roles** | `role="img"` en `aria-label` op logo SVG. |
| **Reduced motion** | `prefers-reduced-motion: reduce` schakelt alle animaties uit. |
| **Semantische HTML** | `<nav>`, `<section>`, `<footer>`, `<h1>`-`<h4>` hierarchie. |
| **Kleurcontrast** | Voldoende contrast ratio's in zowel dark als light mode. |
| **Focus visible** | Browser-standaard focus indicators behouden. |
| **Viewport meta** | Correcte viewport instelling voor mobile zoom. |

---

## Deployment

### GitHub Pages (Automatisch)

De repository bevat een GitHub Actions workflow (`.github/workflows/deploy.yml`) die automatisch deployt naar GitHub Pages bij elke push.

**Setup stappen:**

1. Ga naar **Settings** > **Pages** in je GitHub repository
2. Onder **Source**, selecteer **GitHub Actions**
3. Push naar de branch en de workflow doet de rest

```
Push naar branch
       |
       v
GitHub Actions trigger
       |
       v
actions/checkout@v4
       |
       v
actions/configure-pages@v5
       |
       v
actions/upload-pages-artifact@v3
       |
       v
actions/deploy-pages@v4
       |
       v
Site live op https://maca2024.github.io/O2-OMEGA/
```

### Vercel (One-Click Deploy)

De snelste manier om te deployen naar Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMaca2024%2FO2-OMEGA)

**Of handmatig:**

1. Ga naar [vercel.com](https://vercel.com) en log in
2. Klik **"Add New Project"**
3. Importeer de `Maca2024/O2-OMEGA` repository
4. Klik **Deploy** - geen configuratie nodig (`vercel.json` is al inbegrepen)
5. Je site is live op `o2-omega.vercel.app` (of een aangepast domein)

```
vercel.json configuratie:
+-- Naam: o2-omega
+-- Framework: None (statisch)
+-- Output: . (root directory)
+-- Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
+-- Caching: 1 jaar voor CSS, JS, en assets
```

### Alternatieve hosting

Omdat dit een volledig statische site is, kun je deze overal hosten:

```bash
# Netlify
netlify deploy --prod --dir .

# Vercel
vercel --prod

# Cloudflare Pages
# Koppel je GitHub repo en stel de build directory in op "/"

# AWS S3 + CloudFront
aws s3 sync . s3://jouw-bucket --exclude ".git/*"

# Elke webserver
# Kopieer de bestanden naar de document root
cp -r . /var/www/html/
```

---

## Bijdragen

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/mijn-feature`)
3. Commit je wijzigingen (`git commit -m 'feat: voeg mijn-feature toe'`)
4. Push naar de branch (`git push origin feature/mijn-feature`)
5. Open een Pull Request

### Conventies

- **Commits**: Gebruik [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)
- **CSS**: Gebruik bestaande CSS custom properties. Voeg nieuwe variabelen toe aan zowel dark als light theme.
- **JS**: Houd alles binnen de IIFE. Gebruik `var` voor ES5 compatibiliteit of `const`/`let` voor moderne browsers.
- **Taal**: Frontend content is in het Nederlands (NL). Code en comments zijn in het Engels.

---

<div align="center">

```
     ___   ____            ___  __  __ _____ ____    _
    / _ \ |___ \          / _ \|  \/  | ____/ ___|  / \
   | | | |  __) |  _____ | | | | |\/| |  _|| |  _  / _ \
   | |_| | / __/  |_____|| |_| | |  | | |__| |_| |/ ___ \
    \___/ |_____|          \___/|_|  |_|_____\____/_/   \_\
```

**Gebouwd met passie en precisie.**

*Copyright 2026 O2-OMEGA. Alle rechten voorbehouden.*

</div>
