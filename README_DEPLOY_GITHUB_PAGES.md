# 🛠️ Perbaikan Tampilan GitHub Pages

Jika URL berikut hanya menampilkan README dan bukan dashboard:

```text
https://cakgup.github.io/dashboard-masjid/
```

penyebabnya biasanya karena GitHub Pages masih memakai sumber publikasi:

```text
Deploy from a branch → main → root
```

Akibatnya, GitHub Pages membaca file `README.md` di root repository, bukan hasil build Next.js dari folder `out`.

## Perbaikan yang sudah ditambahkan

Repository ini sudah dilengkapi workflow:

```text
.github/workflows/deploy.yml
```

Workflow tersebut akan:

1. menjalankan `npm ci`;
2. menjalankan `npm run build`;
3. menghasilkan static export Next.js ke folder `out`;
4. menambahkan file `.nojekyll`;
5. mengunggah folder `out` ke GitHub Pages.

## Langkah yang perlu dilakukan di GitHub

1. Push isi project ini ke repository `dashboard-masjid`.
2. Buka repository di GitHub.
3. Masuk ke:

```text
Settings → Pages
```

4. Pada bagian **Build and deployment**, ubah **Source** menjadi:

```text
GitHub Actions
```

5. Masuk ke tab:

```text
Actions
```

6. Jalankan workflow:

```text
Deploy Dashboard Masjid to GitHub Pages
```

atau cukup lakukan push baru ke branch `main`.

## File yang disentuh untuk deployment

```text
.github/workflows/deploy.yml
next.config.ts
README_DEPLOY_GITHUB_PAGES.md
```

## File tampilan yang tidak diubah

```text
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/components/slides/*.tsx
```

CSS, font, dan layout dashboard tetap dipertahankan.

---

<p align="center">
  <strong>Made by cakgup</strong><br>
  🕌 Dashboard Masjid — GitHub Pages Deployment Fix
</p>
