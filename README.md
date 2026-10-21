# Sonath Solutions

**Sonath Solutions** is a two-founder software studio in Kenya. We design, build and launch websites and business systems.

This repository contains the source code for the official Sonath website.

## Website

[sonathsolutions.com](https://sonathsolutions.com)

## Technology

The site is plain static HTML, CSS and JavaScript. There is no framework, no build step and nothing to install.

* HTML5, one file per page
* One stylesheet: `css/style.css`
* Three small scripts: `js/main.js` (mobile menu, scroll animations, the live example dashboard and the floating WhatsApp button), `js/contact-form.js` (contact form) and `js/estimate.js` (the price estimator on the pricing page)
* Fonts loaded from Google Fonts: Archivo, IBM Plex Sans, IBM Plex Mono
* Hosted on Netlify, which also collects the contact form submissions

## Project structure

```text
.
├── index.html            Home
├── work.html             Work (case study list and example build)
├── royal-tavern.html     Case study: Royal Tavern Hotel
├── wits-garden.html      Case study: Wits Garden Educational Centre
├── demos.html            Demo sites: four fictional businesses Sonath built (school, property, clinic, hotel)
├── services.html         Services, timelines and starting prices
├── pricing.html          Website packages, other offers, care plans and the price estimator
├── hotels.html           Industry page: hotels, lodges and guesthouses
├── schools.html          Industry page: schools and learning centres
├── guides.html           List of guides
├── guide-*.html          The guides (articles) themselves
├── process.html          The five project stages, with sample documents
├── about.html            About the studio and founders
├── contact.html          Contact form and direct contact details
├── privacy.html          Privacy policy
├── terms.html            Terms of service
├── 404.html              Page-not-found page (served automatically by Netlify)
├── css/style.css         All styles
├── js/                   Scripts
├── assets/
│   ├── brand/            Logo mark, wordmark and app icon (SVG)
│   ├── icons/            PNG app icons
│   ├── work/             Screenshots of client sites (WebP)
│   ├── demos/            Screenshots of the demo sites (WebP)
│   ├── favicon.ico
│   └── og-image.png      Preview image for links shared on WhatsApp and social media
├── manifest.json
├── robots.txt
└── sitemap.xml
```

## Editing

The header and footer are repeated in every HTML file. If you change a navigation link, the phone number or the footer, make the same change in every page.

Figures that are estimates (prices, timelines, reply times) are marked in the HTML with a `data-estimate` attribute, so they are easy to find:

```bash
grep -n "data-estimate" *.html
```

### Demo sites

The four demo sites (Cedarfield Academy, Havenstone Realty, WillowCare Clinics and Amani House) are fictional businesses, so they are always labelled "Demo" and kept apart from real client work. They appear on:

* `demos.html`: one section per demo, with what it shows and "Try this" steps
* `index.html`: the "Try a finished website in your industry" switcher (the same text, shorter)
* `work.html`: four cards under the client projects
* `hotels.html` (Amani House), `schools.html` (Cedarfield Academy) and the kits on `pricing.html`

If a demo changes, check its "Try this" steps still work, and retake its screenshots in `assets/demos/` (desktop 1440 x 900, phone 390 x 844 at 2x, saved as WebP).

### Prices

Package prices appear in more than one place. When you change one, update all of them:

* `js/estimate.js`: the numbers the estimator uses (at the top of the file)
* `pricing.html`: package cards, offers, care plans and the estimator's choice labels
* `index.html`: the "Pick a starting point" packages and the cost question
* `services.html`, `hotels.html`, `schools.html` and `guide-website-cost.html`

```bash
grep -n "KES" *.html js/estimate.js
```

### Animation

All movement is in `js/main.js` and section 21 of `css/style.css`. It switches off for visitors whose device is set to reduce motion. The floating WhatsApp button is added by `js/main.js`; a page with `<body data-no-wa>` (the contact page) does not show it.

### Adding a guide

Copy one of the `guide-*.html` files, change the title, description, canonical link and the Article data in the `<head>`, then add a card to `guides.html` and a line to `sitemap.xml`.

The dashboard, phone screen and document pictures on the site are drawn in HTML and CSS, not image files. Their text can be edited directly in the page. They are labelled "Example" wherever they appear.

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. The contact form only delivers messages on the deployed Netlify site. Locally it shows the fallback message with email and WhatsApp links.

## Contact form

The form on `contact.html` uses Netlify Forms. Form detection must be switched on for the site in the Netlify dashboard (Forms, then Enable form detection), and an email notification should be added there so new enquiries arrive in the inbox.

## Deployment

The site deploys from this repository through Netlify. The publish directory is the repository root and there is no build command.

## Contact

**Sonath Solutions**

Website: [sonathsolutions.com](https://sonathsolutions.com)

---

© 2026 Sonath Solutions. All rights reserved.
