# HUMA Hardware – 3D bathroom showroom

React + Vite + three.js (pinned to 0.128.0, the version this scene was written for).

## Run locally
    npm install
    npm run dev

## Deploy on Cloudflare Pages
1. Push this folder to a GitHub repo.
2. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git.
3. Build command: `npm run build`   Build output directory: `dist`
4. If the build complains about Node, add environment variable `NODE_VERSION` = `20`.

Or deploy directly: `npm run build && npx wrangler pages deploy dist`

## Things to change
- `src/config.js`: WhatsApp number, product text, sink hotspots.
- `public/img/`: replace photos (keep file names, or update `config.js`).
- `src/scene.js`: the 3D room, products and camera path.
- `src/styles.css`: look and feel.
