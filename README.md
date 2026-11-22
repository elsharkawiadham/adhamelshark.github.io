# Adham Elsharkawi Portfolio

A static portfolio built with plain HTML, CSS, and JavaScript. It has no build step, backend, or package dependencies and is suitable for GitHub Pages.

## Run locally

Open `index.html` in a browser, or start a local static server from the repository root:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Push or merge the site files to the repository's `main` branch.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save.
4. GitHub Pages will publish the site at the URL shown in the Pages settings.

The site uses relative asset paths and static files, so it can also be hosted from a project subpath.

## Update content

Project details and evidence labels are in `index.html`; each project has a self-contained `<article>` with its own evidence list. Keep unavailable destinations as plain text until a real URL or asset is ready. Skills and contact placeholders are also in `index.html`.

Project evidence is organized under `assets/projects/<project-name>/` in `cover/`, `gallery/`, `diagrams/`, and `documents/` folders. Only add real project evidence; keep unavailable material clearly marked in the portfolio.

The supplied logo is stored at `assets/brand/adham-elsharkawi-logo.png`. It appears by itself in the navigation and beside the name in the footer.

The “Beyond the screen” slideshow is data-driven in `script.js`. It supports images, MP4 video, and tested public Instagram embeds. Add future media and poster images under `assets/creative/media/`; do not add autoplay to video slides.

## Accessibility and responsive behavior

The page uses semantic landmarks and headings, a skip link, visible keyboard focus, a mobile navigation button with an expanded state, and reduced-motion support. Layouts adapt for narrow screens without external fonts or JavaScript dependencies. Instagram embeds require an internet connection.
