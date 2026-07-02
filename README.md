# Rubex UI — Website

A production-ready, fully static multi-page website for **Rubex UI**, a modern web development agency based in Kyiv, Ukraine.

## Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, flexbox, grid, animations)
- Vanilla JavaScript (no dependencies)
- [Web3Forms](https://web3forms.com/) for contact form submissions

## Project Structure

```
/
├── index.html          # Home page
├── about.html          # About page
├── services.html       # Services page
├── portfolio.html      # Portfolio with filter
├── contact.html        # Contact form page
├── assets/
│   ├── css/
│   │   └── styles.css  # All styles
│   ├── js/
│   │   └── main.js     # All interactivity
│   ├── images/         # Add your images here
│   └── icons/          # Add custom icons here
├── robots.txt
├── sitemap.xml
└── README.md
```

## Features

- ✅ Fully static — works on GitHub Pages, Netlify, Vercel, Cloudflare Pages
- ✅ Mobile-first responsive design
- ✅ Sticky navbar with scroll effect & mobile hamburger menu
- ✅ Animated dot-grid hero (canvas-based, mouse-reactive)
- ✅ Scroll reveal animations (IntersectionObserver)
- ✅ Portfolio filter by category
- ✅ Contact form with validation, loading state, and success message
- ✅ Back-to-top button
- ✅ SEO: semantic HTML, meta tags, Open Graph, sitemap.xml, robots.txt
- ✅ Accessible: WCAG contrast, keyboard navigation, ARIA labels
- ✅ Respects `prefers-reduced-motion`

## Deploying to GitHub Pages

### Option 1 — GitHub UI (Quickest)

1. Create a new repository on GitHub (e.g. `rubex-ui`)
2. Upload all files to the repository (drag and drop in the GitHub UI)
3. Go to **Settings → Pages**
4. Under **Source**, select **Deploy from a branch**
5. Select the `main` branch and `/ (root)` folder
6. Click **Save**
7. Your site will be live at `https://<your-username>.github.io/rubex-ui/`

### Option 2 — Git CLI

```bash
# Clone or init your repo
git init
git remote add origin https://github.com/<your-username>/rubex-ui.git

# Add all files
git add .
git commit -m "Initial commit: Rubex UI website"
git push -u origin main

# Enable GitHub Pages in Settings → Pages → main branch
```

### Option 3 — Custom Domain

1. Follow Option 1 or 2 to deploy
2. In **Settings → Pages → Custom Domain**, enter your domain (e.g. `rubexui.com`)
3. Update your domain's DNS:
   - Add 4 A records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or add a CNAME for `www` pointing to `<your-username>.github.io`
4. Check **Enforce HTTPS** once DNS propagates

### After Deployment

- Update `sitemap.xml`: replace `https://rubexui.com/` with your actual domain
- Update Open Graph `og:url` meta tags in each HTML file
- Update the `robots.txt` Sitemap URL to match your domain

## Customisation

### Colours

All design tokens are CSS custom properties in `assets/css/styles.css`:

```css
:root {
  --bg:         #0A0C0F;   /* Page background */
  --accent:     #4A9EFF;   /* Primary accent (blue) */
  --accent-2:   #7C6BFF;   /* Secondary accent (purple) */
  --text:       #E8F0FE;   /* Primary text */
  --text-muted: #8892A4;   /* Secondary text */
}
```

### Contact Form

The form uses [Web3Forms](https://web3forms.com/). To use your own access key:

1. Sign up at https://web3forms.com/
2. Get your access key
3. Replace `58fef3c3-68c3-48e3-83b8-05356f09baa4` in `contact.html` with your key

### Adding Real Images

Place images in `assets/images/` and reference them in HTML:

```html
<img src="assets/images/project-name.jpg" alt="Description" loading="lazy" width="800" height="600" />
```

Always include `loading="lazy"`, `width`, and `height` for best performance.

## Performance Notes

- No external dependencies loaded at runtime
- Google Fonts loaded with `display=swap`
- Canvas animation uses `requestAnimationFrame` and auto-cancels off-screen
- All images should be converted to WebP format for production

## License

 2026 Rubex UI. All rights reserved.
