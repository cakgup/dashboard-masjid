# Update Integrasi Apps Script Dashboard Masjid

Dokumen ini menjelaskan penyesuaian project agar sesuai dengan project Apps Script berikut:

```text
https://script.google.com/u/0/home/projects/1C6CnNE8S2VGaNxZVOus3SnN57jvCcf2kyZ-RY1W8D-f5GE0JBkwDgmzE/edit
```

## Catatan Penting

Link di atas adalah **link editor Apps Script**, bukan URL API.

Dashboard tidak bisa mengambil JSON dari URL editor tersebut. Dashboard harus memakai URL Web App hasil deploy, yaitu URL yang bentuknya seperti:

```text
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
```

Pada project ini, URL Web App dikonfigurasi di:

```text
src/config/dashboardApi.ts
```

Saat ini URL yang dipakai:

```text
https://script.google.com/macros/s/AKfycbwCgyD0gEHL-iIKgZw7N5laMjjDbfVuV1RGr71jqTi4uCsWVeFPbu9nAM1VEc4Y8lip/exec
```

Jika project Apps Script tersebut memiliki deployment `/exec` yang berbeda, ganti hanya bagian `DASHBOARD_API_URL`.

## File Apps Script yang Disiapkan

Saya sudah menambahkan file:

```text
apps-script/Code.gs
```

Isi file tersebut adalah script siap tempel ke Apps Script editor.

Langkahnya:

1. Buka project Apps Script editor.
2. Hapus isi `Kode.gs` lama.
3. Paste isi dari `apps-script/Code.gs`.
4. Isi konstanta `SPREADSHEET_ID` dengan ID Google Sheets.
5. Klik **Simpan**.
6. Jalankan fungsi `testDoGet` untuk uji coba.
7. Deploy sebagai **Web app**.
8. Copy URL `/exec` hasil deploy ke `src/config/dashboardApi.ts` jika URL-nya berbeda.

## Format JSON yang Diharapkan Dashboard

Dashboard mengharapkan response seperti ini:

```json
{
  "success": true,
  "tanggal_update": "2026-05-22",
  "pengaturan": {
    "tanggal_update_aktif": "2026-05-22",
    "nama_masjid": "Masjid Al Amanah Kementerian Keuangan"
  },
  "kajian": [],
  "kas_jumat": {
    "tanggal_update": "2026-05-22",
    "saldo_awal": "Rp 7,497,047",
    "pemasukan": "Rp 34,382,925",
    "pengeluaran": "Rp 14,831,589",
    "saldo_akhir": "Rp 19,551,336",
    "status": "aktif"
  },
  "donasi_palestina": {},
  "ringkasan": {
    "total_pemasukan": "Rp 34,382,925",
    "total_pengeluaran": "Rp 14,831,589",
    "saldo_akhir": "Rp 19,551,336"
  }
}
```

## File Frontend yang Diubah

Penyesuaian dilakukan tanpa mengubah CSS dan layout.

File yang diubah:

```text
src/config/dashboardApi.ts
apps-script/Code.gs
README_APPS_SCRIPT_UPDATE.md
.github/workflows/deploy.yml
```

File tampilan berikut tetap dipertahankan:

```text
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/components/slides/CashReportSlide.tsx
src/components/slides/DonationSlide.tsx
src/components/slides/KajianSlide.tsx
```

---

<p align="center">
  <strong>Made by cakgup</strong><br>
  🕌 Dashboard Masjid — Google Sheets Integration
</p>
