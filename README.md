# QR Video Booth

Single-event QR video recording app built with React, Cloudflare Workers, D1 and R2.

## Setup

1. Install Node.js 20+ and run `npm install`.
2. Run `npx wrangler login`.
3. Run `npx wrangler r2 bucket create qr-video-booth-videos`.
4. Run `npx wrangler d1 create qr-video-booth-db` and set the returned ID in `wrangler.jsonc`.
5. Run `npm run db:migrate`.
6. Run `npx wrangler secret put SETUP_SECRET` and enter a strong secret.
7. Run `npm run deploy`.
8. Open `/admin` to create the first administrator.

Do not commit secrets. The app requires testing and hardening before use at public events.