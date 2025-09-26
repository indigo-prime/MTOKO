This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Video compatibility (H.264 + AAC)

Some browsers require MP4 videos to use H.264 for video and AAC for audio. If your videos were encoded with different codecs, they may fail to play.

This repository includes a helper script to re-encode all .mp4 files under the `public/` directory to H.264 (libx264) + AAC using FFmpeg.

Prerequisites:
- Install FFmpeg and ensure the `ffmpeg` command is on your PATH (https://ffmpeg.org/download.html).

Run the re-encode script:

```bash
npm run videos:reencode
```

What it does:
- Recursively finds `.mp4` files under `public/`.
- Re-encodes to H.264 (libx264) + AAC with `-movflags +faststart` for faster playback start.
- Replaces the original file and keeps a `.orig.backup.mp4` backup in the same folder.

If you prefer manual FFmpeg usage, here is an equivalent command:

```bash
ffmpeg -y -i input.mp4 -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k -ac 2 output.mp4
```
