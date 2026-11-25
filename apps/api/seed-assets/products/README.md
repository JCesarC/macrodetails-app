# Product photos for the seed

Put each product's photos in a folder named after its slug (see `src/seed/data/products.ts`):

```
seed-assets/products/
  ramo-rosas-rojas-clasico/
    1.jpg
    2.jpg
```

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`. Files are sorted by name; the first one is the cover.
- Run `pnpm --filter @macrodetails/api seed`. Photos are uploaded to the media bucket only when `MEDIA_BUCKET` and `MEDIA_BASE_URL` are set.
- Each upload key includes a hash of the file (`products/<slug>/1-3f2a9c1b7d4e.webp`). To replace a photo, overwrite the file and run the seed again: the new contents get a new URL, so the one-year CDN cache never serves the old photo.
- Only use photos you have permission to publish.
- Photo folders are git-ignored: the photos belong to the vendors and live in the media bucket, not in the repository. Keep the originals in a private backup.
- Prepare each photo before adding it: WebP or JPEG, 1600–2000 px on the long side, under 500 KB, with the product centered (cards crop to a square).
