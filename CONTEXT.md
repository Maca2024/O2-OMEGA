# CONTEXT.md — O2-OMEGA Technical Context

> Dit bestand beschrijft de technische context, ontwerpbeslissingen en architectuur van het O2-OMEGA project. Het is bedoeld voor ontwikkelaars die aan het project willen bijdragen of het willen begrijpen.

---

## 1. Projectoverzicht

| Eigenschap | Waarde |
|---|---|
| **Naam** | O2-OMEGA |
| **Type** | Statische landingspagina |
| **Taal (content)** | Nederlands (NL) |
| **Taal (code)** | Engels |
| **Framework** | Geen (vanilla HTML/CSS/JS) |
| **Build tools** | Geen |
| **Hosting** | GitHub Pages via GitHub Actions |
| **Doelgroep** | Product showcase / landing page |

### Missie

Een Apple.com-geinspireerde landingspagina bouwen die de O2-OMEGA brand presenteert met een premium, minimalistisch ontwerp. Dark mode als standaard, volledig responsief, en zonder externe dependencies.

---

## 2. Bestandsoverzicht

```
O2-OMEGA/
+-- index.html                    # Enige HTML-pagina (SPA-achtig via secties)
+-- css/style.css                 # Alle CSS in een bestand
+-- js/main.js                    # Alle JavaScript in een bestand
+-- assets/favicon.svg            # SVG favicon
+-- .github/workflows/deploy.yml  # CI/CD pipeline
+-- README.md                     # Uitgebreide documentatie
+-- CONTEXT.md                    # Dit bestand
+-- LICENSE                       # Licentie
```

### Waarom een enkel bestand per type?

- **Geen build step**: Er is geen bundler (Webpack, Vite, etc.), dus code-splitting is niet van toepassing.
- **Eenvoud**: Alle CSS in een bestand maakt het design systeem doorzoekbaar. Alle JS in een IIFE voorkomt scope-problemen.
- **Performance**: Drie HTTP requests (HTML + CSS + JS) is optimaal voor een statische site van deze grootte. Minder requests = snellere first paint.

---

## 3. CSS Architectuur

### 3.1 Design Token Systeem

Alle visuele waarden zijn gedefinieerd als CSS custom properties in `:root`:

```
:root
  +-- Typografie      --font-primary, --font-weight-*
  +-- Spacing         --space-xs tot --space-5xl (8-staps schaal)
  +-- Border Radius   --radius-sm tot --radius-full
  +-- Transities      --transition-fast/base/slow/spring
  +-- Layout          --container-max, --container-padding, --nav-height
```

### 3.2 Theming via data-attribute

Het thema wordt gestuurd door `data-theme` op het `<html>` element:

```
<html data-theme="dark">    -->  [data-theme="dark"]  { 20 variabelen }
<html data-theme="light">   -->  [data-theme="light"] { 20 variabelen }
```

**Waarom `data-theme` in plaats van een class?**
- Semantischer: het beschrijft een eigenschap, niet een stijl
- Makkelijk te queryen: `html.getAttribute('data-theme')`
- Geen class-conflicten

**Thema-variabelen (20 per thema):**

| Categorie | Variabelen |
|---|---|
| Achtergronden | `--color-bg`, `--color-bg-elevated`, `--color-bg-card`, `--color-bg-card-hover`, `--color-surface` |
| Borders | `--color-border`, `--color-border-strong` |
| Tekst | `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary` |
| Accent | `--color-accent`, `--color-accent-hover`, `--color-accent-glow` |
| Gradient | `--color-gradient-start`, `--color-gradient-end` |
| Navigatie | `--nav-bg`, `--nav-border` |
| Schaduwen | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow` |

### 3.3 Component Structuur

CSS is georganiseerd in secties, van boven naar beneden:

```
1.  Design Tokens          :root variabelen
2.  Dark Theme             [data-theme="dark"] variabelen
3.  Light Theme            [data-theme="light"] variabelen
4.  Reset & Base           *, html, body, a, img, button, ul/ol
5.  Layout                 .container
6.  Navigation             .nav, .nav-container, .nav-logo, .nav-links, etc.
7.  Theme Toggle           .theme-toggle, .theme-icon
8.  Mobile Menu            .mobile-menu-toggle, .mobile-menu, .mobile-menu-content
9.  Hero                   .hero, .hero-bg, .hero-gradient, .hero-content, .hero-title
10. Buttons                .btn, .btn-primary, .btn-secondary, .btn-outline, .btn-ghost
11. Section Headers        .section-header, .section-label, .section-title
12. Intro                  .intro, .intro-text, .text-gradient
13. Features               .features, .feature-grid-*, .feature-card-*
14. 3D Cube                .feature-visual-cube, .cube-face, @keyframes rotateCube
15. Neural Mesh            .neural-mesh, canvas styling
16. Technology             .technology, .tech-showcase, .tech-rings, .tech-stats
17. Specs                  .specs, .specs-grid, .spec-item
18. Pricing                .pricing, .pricing-grid, .pricing-card, .pricing-badge
19. CTA                    .cta-section, .cta-content
20. Footer                 .footer, .footer-grid, .footer-links, .footer-bottom
21. Scroll Animations      .animate-on-scroll, .animate-on-scroll.visible
22. Media Queries          Tablet (768px), Desktop (1024px), Mobile (767px)
23. Accessibility          prefers-reduced-motion, prefers-color-scheme
```

### 3.4 Responsive Strategie

De CSS volgt een **mobile-first** aanpak:
- Basisstijlen zijn voor mobiel
- `min-width: 768px` voegt tablet-specifieke layout toe
- `min-width: 1024px` voegt desktop-verfijningen toe
- `max-width: 767px` bevat mobiel-specifieke overrides (nav hidden, hamburger visible)

### 3.5 Animaties

| Naam | Type | Gebruik |
|---|---|---|
| `scrollPulse` | CSS @keyframes | Scroll indicator pulsering |
| `rotateCube` | CSS @keyframes | 3D kubus rotatie (20s cycle) |
| `ringPulse` | CSS @keyframes | Technologie ringen pulsering |
| `corePulse` | CSS @keyframes | Technologie kern pulsering |
| `floatParticle[0-29]` | JS-generated @keyframes | Hero deeltjes (elk uniek) |
| Scroll reveal | JS + CSS class | `.animate-on-scroll` -> `.visible` |
| Counter | JS requestAnimationFrame | Statistieken optellen |
| Neural mesh | JS Canvas API | Deeltjessysteem met verbindingen |

---

## 4. JavaScript Architectuur

### 4.1 Patroon: IIFE

```javascript
(function () {
    'use strict';
    // Alle code hier
})();
```

**Waarom IIFE?**
- Voorkomt globale scope vervuiling
- Geen module bundler nodig
- `'use strict'` vangt stille fouten

### 4.2 Modules (logische groepering)

```
main.js
  |
  +-- DOM Element References
  |     Alle getElementById/querySelector calls bij de top
  |
  +-- Theme Manager
  |     - getStoredTheme(): leest localStorage
  |     - setTheme(theme): zet data-theme + localStorage
  |     - toggleTheme(): schakelt dark <-> light
  |     - Init: check localStorage, fallback naar HTML default
  |
  +-- Mobile Menu
  |     - toggleMobileMenu(): toggle .active class + body overflow
  |     - closeMobileMenu(): verwijder .active + reset overflow
  |     - Event: click op hamburger, click op menu links
  |     - Null guards: if (!mobileMenu || !mobileMenuToggle) return
  |
  +-- Scroll Handler
  |     - updateNav(): add/remove .scrolled class op nav
  |     - Throttled via requestAnimationFrame
  |     - Passive scroll listener voor performance
  |
  +-- Smooth Scroll
  |     - Alle a[href^="#"] links
  |     - Berekent positie minus nav-hoogte
  |     - window.scrollTo met behavior: 'smooth'
  |
  +-- Scroll Animations
  |     - IntersectionObserver (threshold: 0.1, rootMargin: -50px bottom)
  |     - Stagger: siblings krijgen +100ms delay (max 400ms)
  |     - Auto-unobserve na trigger
  |     - Fallback: alle elementen direct .visible als geen IO support
  |
  +-- Counter Animation
  |     - animateCounter(element, target, duration)
  |     - requestAnimationFrame-based
  |     - Ease-out-cubic easing: 1 - (1 - progress)^3
  |     - Ondersteunt integers en floats (bijv. 99.9)
  |     - IntersectionObserver trigger (threshold: 0.5)
  |
  +-- Neural Mesh Canvas
  |     - 40 deeltjes met random positie en snelheid
  |     - Verbindingslijnen als afstand < 100px
  |     - DevicePixelRatio-aware rendering
  |     - Start/stop via IntersectionObserver (performance)
  |     - Resize handler: herbereken canvas + hermaak deeltjes
  |     - Leest --color-accent dynamisch (reageert op thema-wissel)
  |
  +-- Hero Particles
  |     - 30 deeltjes, elk met unieke CSS keyframe animatie
  |     - Unieke drift X/Y per deeltje
  |     - Keyframes dynamisch toegevoegd aan <head>
  |     - Willekeurige grootte, positie, duratie en delay
  |
  +-- Keyboard Accessibility
        - Escape key sluit mobile menu
```

### 4.3 Performance Patronen

| Patroon | Implementatie | Waarom |
|---|---|---|
| **rAF throttling** | Scroll handler via `requestAnimationFrame` | Voorkomt layout thrashing op elke scroll event |
| **Passive listeners** | `{ passive: true }` op scroll | Vertelt browser dat we `preventDefault()` niet aanroepen |
| **Visibility-based rendering** | Canvas start/stop via IntersectionObserver | Geen CPU-gebruik voor off-screen animaties |
| **Auto-unobserve** | Observer.unobserve na scroll-reveal trigger | Observer hoeft niet steeds opnieuw te checken |
| **Lazy keyframe generation** | Hero particles keyframes gegenereerd in JS | 30 unieke @keyframes in CSS zou veel bloat zijn |

### 4.4 Thema-architectuur Detail

```
Pagina laadt
    |
    v
HTML heeft data-theme="dark"       (standaard in markup)
    |
    v
JS checkt localStorage('o2-theme')
    |
    +-- Waarde gevonden? --> setTheme(waarde)  --> data-theme wordt overschreven
    |
    +-- Geen waarde?     --> niets doen        --> dark blijft actief
    |
    v
Gebruiker klikt toggle
    |
    v
toggleTheme()
    |
    +-- Lees huidige data-theme
    +-- Flip: dark -> light / light -> dark
    +-- Zet data-theme op <html>
    +-- Sla op in localStorage
    |
    v
CSS reageert automatisch
    |
    +-- Alle var(--color-*) worden opnieuw geresolved
    +-- transition op body zorgt voor smooth kleur-overgang
    +-- Canvas leest --color-accent dynamisch bij volgende frame
```

---

## 5. HTML Structuur

### 5.1 Sectie-overzicht

```html
<body>
    <nav>           <!-- Vaste glasmorfisme navigatie -->
    <div>           <!-- Mobiel menu overlay -->
    <section#hero>  <!-- Full-viewport hero met particles -->
    <section#intro> <!-- Introductie statement -->
    <section#features>    <!-- Feature showcase (2 groot + 4 klein) -->
    <section#technology>  <!-- Tech details met animaties -->
    <section#specs>       <!-- Specificaties grid -->
    <section#pricing>     <!-- Prijskaarten -->
    <section.cta>         <!-- Call-to-action -->
    <footer>              <!-- Footer met links -->
</body>
```

### 5.2 Conventies

| Conventie | Voorbeeld | Reden |
|---|---|---|
| BEM-achtige naming | `.feature-card-title`, `.pricing-card-header` | Duidelijke component-hiererchie |
| Inline SVG icons | `<svg viewBox="...">` direct in HTML | Geen extra HTTP requests, thema-bewust via `currentColor` |
| `animate-on-scroll` class | Op elk element dat moet animeren | Declaratief: HTML bepaalt WAT animeert, JS bepaalt WANNEER |
| `data-target` attribute | Op `.stat-number` elementen | Scheiding van data en presentatie voor teller-animatie |
| Sectie IDs | `id="features"`, `id="technology"` | Ankerlinks en navigatie |

---

## 6. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
Trigger:  push naar 'claude/apple-inspired-frontend-PXhKt' of 'main'
Runner:   ubuntu-latest
```

```
Stappen:
  1. actions/checkout@v4          # Clone repo
  2. actions/configure-pages@v5   # Configureer GitHub Pages
  3. actions/upload-pages-artifact@v3  # Upload '.' als artifact
  4. actions/deploy-pages@v4      # Deploy naar GitHub Pages
```

**Permissions:**
- `contents: read` — leest de repo
- `pages: write` — schrijft naar Pages
- `id-token: write` — voor OIDC authentication

**Concurrency:** `group: "pages"` met `cancel-in-progress: false` voorkomt race conditions bij snelle achtereenvolgende pushes.

---

## 7. Ontwerpbeslissingen

### 7.1 Waarom geen framework?

| Overweging | Beslissing |
|---|---|
| Complexiteit | Een landing page heeft geen React/Vue nodig |
| Bundle size | 0 KB dependencies vs 40+ KB voor een framework |
| Laadtijd | Geen JS parsing delay voor framework bootstrapping |
| Onderhoudbaarheid | Minder moving parts = minder dingen die breken |
| Hosting | Elke statische server werkt, geen SSR nodig |

### 7.2 Waarom dark mode als standaard?

- Apple.com gebruikt dark als standaard voor product pagina's
- Dark mode is visueel imposanter voor een tech product
- Gradient effecten en glow zijn mooier op donkere achtergrond
- Vermindert oogbelasting bij gebruik in de avond

### 7.3 Waarom Inter als font?

- Meest vergelijkbaar met Apple's SF Pro dat publiek beschikbaar is
- Uitstekende leesbaarheid op scherm
- Breed scala aan weights (300-900) voor visuele hierarchie
- Gratis via Google Fonts met preconnect voor snelheid

### 7.4 Waarom IntersectionObserver i.p.v. scroll events?

- Performanter: browser optimaliseert intern
- Declaratief: observe/unobserve patroon
- Threshold-based: nauwkeurige controle over wanneer animaties starten
- Automatische cleanup via unobserve

### 7.5 Waarom CSS Custom Properties voor theming?

- Native browser support, geen JS nodig voor kleur-updates
- Cascade: een variabele aanpassen werkt door in alle kinderen
- DevTools: gemakkelijk te debuggen en aan te passen
- Performance: browser optimaliseert var() resolution

---

## 8. Browser Compatibiliteit

| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| CSS Custom Properties | 49+ | 31+ | 9.1+ | 15+ |
| CSS Grid | 57+ | 52+ | 10.1+ | 16+ |
| backdrop-filter | 76+ | 103+ | 9+ | 17+ |
| IntersectionObserver | 51+ | 55+ | 12.1+ | 15+ |
| CSS clamp() | 79+ | 75+ | 13.1+ | 79+ |
| transform-style: preserve-3d | 36+ | 16+ | 9+ | 12+ |

**Fallbacks:**
- IntersectionObserver: JS check + fallback die alle elementen direct toont
- backdrop-filter: `-webkit-` prefix meegeleverd
- Reduced motion: `prefers-reduced-motion` schakelt animaties uit

---

## 9. Bekende Beperkingen

| Beperking | Beschrijving | Mogelijke oplossing |
|---|---|---|
| Geen echte afbeeldingen | Visuals zijn CSS/Canvas animaties, geen product foto's | Voeg product afbeeldingen toe in WebP formaat |
| Geen backend | Prijsknoppen en CTA's zijn niet functioneel | Koppel aan een backend/payment provider |
| Geen i18n | Content is alleen in het Nederlands | Voeg taalbestanden toe met een simpele switcher |
| Geen form handling | Contact formulieren ontbreken | Voeg Formspree, Netlify Forms, of een API toe |
| Enkele CSS file | Bij verdere groei kan het onoverzichtelijk worden | Split in partials + gebruik een CSS preprocessor |

---

## 10. Toekomstige Verbeteringen

```
Prioriteit 1 (Korte termijn):
  +-- Echte product afbeeldingen toevoegen (WebP + lazy loading)
  +-- Open Graph / Twitter Card meta tags
  +-- Sitemap.xml en robots.txt

Prioriteit 2 (Middellange termijn):
  +-- Contact formulier met backend integratie
  +-- Blog sectie (kan statisch met markdown)
  +-- Meertalige ondersteuning (NL/EN)
  +-- Cookie consent banner

Prioriteit 3 (Lange termijn):
  +-- CMS integratie (bijv. headless CMS)
  +-- A/B testing voor pricing en CTA's
  +-- Analytics integratie
  +-- PWA support (service worker, manifest)
```

---

## 11. Lokale Ontwikkeling Tips

### Snel starten
```bash
# Eenvoudigste manier: Python server
python3 -m http.server 8080

# Of met live-reload via Node:
npx browser-sync start --server --files "**/*"
```

### CSS aanpassen
1. Open `css/style.css`
2. Zoek de sectie via de comment headers (`/* === Section Name === */`)
3. Gebruik bestaande CSS variabelen waar mogelijk
4. Test altijd in BEIDE thema's (dark + light)
5. Test op 3 schermbreedtes: 375px (mobiel), 768px (tablet), 1280px (desktop)

### JS aanpassen
1. Open `js/main.js`
2. Alle code zit in de IIFE — voeg nieuwe functies toe binnen de scope
3. Gebruik IntersectionObserver voor visibility-based effecten
4. Test met DevTools > Performance tab voor animatie-impact

### Nieuw thema-variabele toevoegen
1. Voeg toe aan `[data-theme="dark"]` in `css/style.css`
2. Voeg het equivalent toe aan `[data-theme="light"]`
3. Gebruik als `var(--jouw-variabele)` in je CSS

---

*Laatst bijgewerkt: 5 februari 2026*
