# Dashboard Masjid Al Amanah - Static GitHub Pages

Versi ini sudah disederhanakan menjadi aplikasi static sehingga bisa langsung diunggah ke GitHub Pages tanpa Next.js, tanpa `npm install`, dan tanpa proses build. Font mengikuti tampilan live acuan: Inter/sans-serif untuk seluruh elemen utama agar tetap ringan dan konsisten.

## Struktur file

```text
index.html
script.js
styles.css
logo.png
bg.jpg
himbauan-hp.png
himbauan-kebersihan.png
himbauan-barang.png
README.md
LICENSE
```

## Sumber data

Data dashboard utama diambil dari Google Apps Script:

```text
https://script.google.com/macros/s/AKfycbyq0UsoCdCsaGEcFqoxO23cyEkMoKDyhWB_aCTCn7bKDeI_G2Exnt5-rLSFoccHBgZx/exec
```

Aplikasi akan otomatis menambahkan parameter `tanggal_update` berdasarkan tanggal hari ini zona waktu Jakarta. Jika data untuk tanggal tersebut kosong, aplikasi mencoba ulang ke endpoint tanpa parameter tanggal.

Data yang digunakan:

- `kajian` untuk slide jadwal kajian. Jika endpoint tidak mengirim data kajian, slide kajian tidak ditampilkan;
- `ringkasan` untuk laporan kas;
- `ringkasan` untuk target donasi, nominal terkumpul, dan progress donasi;
- MyQuran untuk jadwal shalat DKI Jakarta.

## Cara tes lokal

Jalankan dari folder ini:

```bash
python -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

## Cara upload ke GitHub Pages

Upload semua file di folder ini ke root repository GitHub Pages. Pastikan `index.html`, `script.js`, `styles.css`, dan semua gambar berada dalam satu folder yang sama.


Catatan: versi ini juga menambahkan ikon SVG inline untuk alamat dan tanggal, efek gradasi latar yang bergerak, serta partikel lembut yang ringan untuk tampilan layar masjid.

## Perbaikan v8

- Slide kajian hanya memakai data dari endpoint Google Apps Script.
- Data kajian dengan `status: "aktif"` akan ditampilkan, meskipun `tanggal_update` pada baris kajian berbeda dari tanggal komputer.
- Jika endpoint dengan parameter tanggal harian tidak mengembalikan kajian aktif, aplikasi mencoba endpoint dasar tanpa parameter sebagai fallback.
- Data kajian statis/fallback tetap tidak digunakan.
