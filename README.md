# 🕌 Dashboard Masjid Al Amanah

<p align="center">
  <img src="logo.png" alt="Logo Masjid Al Amanah" width="120">
</p>

<h3 align="center">Dashboard Informasi Digital Masjid untuk Layar TV, Jamaah, dan Pengurus</h3>

<p align="center">
  <em>Ringan, mudah dipasang, mudah diduplikasi, dan didedikasikan untuk ummat.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-GitHub%20Pages-181717?style=for-the-badge&logo=github" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/Type-Static%20Web-0ea5e9?style=for-the-badge" alt="Static Web">
  <img src="https://img.shields.io/badge/Data-Google%20Apps%20Script-34a853?style=for-the-badge&logo=google" alt="Google Apps Script">
  <img src="https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge" alt="GPL-3.0">
</p>

---

## ✨ Tentang Aplikasi

**Dashboard Masjid Al Amanah** adalah aplikasi dashboard informasi digital berbasis web statis yang dirancang untuk ditampilkan pada layar TV atau display masjid.

Aplikasi ini dapat digunakan untuk menampilkan:

- jam dan tanggal secara real-time;
- tanggal Masehi dan Hijriah;
- jadwal shalat harian;
- jadwal kajian atau kegiatan masjid;
- laporan kas Jumat;
- informasi donasi;
- himbauan visual untuk jamaah;
- running text informasi penting.

Project ini dibuat agar pengurus masjid dapat memiliki media informasi digital yang **rapi, transparan, mudah diperbarui, dan tidak memerlukan server backend yang rumit**.

> Semoga aplikasi sederhana ini menjadi bagian dari ikhtiar kebaikan, memudahkan pelayanan kepada jamaah, dan menjadi amal jariyah bagi siapa pun yang menggunakan, memperbaiki, serta menyebarkannya.

---

## 🌟 Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🖥️ Dashboard fullscreen | Cocok untuk TV, monitor masjid, atau display informasi publik. |
| ⏰ Jam real-time | Menampilkan waktu berjalan dengan zona waktu Indonesia Barat. |
| 📅 Tanggal Masehi & Hijriah | Menampilkan informasi tanggal yang mudah dibaca jamaah. |
| 🕌 Jadwal shalat otomatis | Mengambil jadwal shalat harian dari API MyQuran berdasarkan kode kota. |
| 📚 Slide kajian | Menampilkan jadwal kajian, tema, pemateri, waktu, dan tempat. |
| 💰 Laporan kas | Menampilkan saldo awal, pemasukan, pengeluaran, dan saldo akhir. |
| 🤲 Informasi donasi | Menampilkan target donasi, dana terkumpul, progress, dan keterangan. |
| 📢 Himbauan visual | Berisi pengingat untuk menonaktifkan HP, menjaga kebersihan, dan menjaga barang bawaan. |
| 📰 Running text | Informasi penting berjalan di bagian bawah layar. |
| ⚡ Ringan | Cukup HTML, CSS, JavaScript, dan file gambar. |
| 🌐 Siap GitHub Pages | Dapat dipublikasikan tanpa hosting berbayar. |

---

## 🧭 Cocok Digunakan Untuk

Aplikasi ini cocok digunakan oleh:

- masjid;
- musala;
- lembaga dakwah;
- yayasan sosial;
- panitia kajian;
- DKM kantor;
- DKM sekolah/kampus;
- komunitas keislaman yang membutuhkan papan informasi digital.

---

## 🗂️ Struktur File

Struktur utama project:

```text
dashboard-masjid/
├── index.html
├── script.js
├── styles.css
├── logo.png
├── bg.jpg
├── himbauan-hp.png
├── himbauan-kebersihan.png
├── himbauan-barang.png
├── README.md
└── LICENSE
```

Penjelasan singkat:

| File | Fungsi |
|---|---|
| `index.html` | Struktur utama halaman dashboard. |
| `script.js` | Logika aplikasi, pengambilan data API, jam, jadwal shalat, slide, running text, dan efek visual. |
| `styles.css` | Pengaturan tampilan, warna, layout, ukuran font, animasi, dan responsivitas. |
| `logo.png` | Logo masjid/lembaga yang tampil pada header. |
| `bg.jpg` | Gambar latar belakang dashboard. |
| `himbauan-hp.png` | Gambar himbauan menonaktifkan atau menjaga penggunaan HP. |
| `himbauan-kebersihan.png` | Gambar himbauan menjaga kebersihan masjid. |
| `himbauan-barang.png` | Gambar himbauan menjaga barang bawaan. |
| `LICENSE` | Informasi lisensi project. |

---

## 🚀 Cara Menjalankan Secara Lokal

Karena aplikasi ini berbasis web statis, tidak diperlukan instalasi Node.js, database, ataupun backend tambahan.

### Opsi 1 — Langsung Buka File

Klik dua kali file berikut:

```text
index.html
```

Namun, untuk hasil yang lebih stabil saat membaca file lokal dan API, gunakan web server sederhana.

### Opsi 2 — Menggunakan Python

Buka terminal pada folder project, lalu jalankan:

```bash
python -m http.server 8000
```

Kemudian buka browser:

```text
http://localhost:8000
```

### Opsi 3 — Menggunakan VS Code Live Server

1. Buka folder project di Visual Studio Code.
2. Pasang ekstensi **Live Server**.
3. Klik kanan file `index.html`.
4. Pilih **Open with Live Server**.
5. Dashboard akan terbuka otomatis di browser.

---

## 🌐 Cara Deploy ke GitHub Pages

### 1. Fork atau duplikasi repository

Klik tombol **Fork** pada repository GitHub, atau unduh ZIP project lalu upload ulang ke repository baru.

Contoh nama repository:

```text
dashboard-masjid
```

### 2. Pastikan file berada di root repository

Struktur yang benar:

```text
dashboard-masjid/
├── index.html
├── script.js
├── styles.css
├── logo.png
├── bg.jpg
├── himbauan-hp.png
├── himbauan-kebersihan.png
├── himbauan-barang.png
├── README.md
└── LICENSE
```

Jangan meletakkan file di dalam folder tambahan seperti:

```text
dashboard-masjid/dashboard-masjid/index.html
```

### 3. Aktifkan GitHub Pages

Masuk ke menu repository:

```text
Settings → Pages
```

Lalu pilih:

```text
Source  : Deploy from a branch
Branch  : main
Folder  : /root
```

Klik **Save**.

### 4. Akses dashboard

Setelah proses deploy selesai, dashboard dapat diakses melalui URL seperti:

```text
https://username.github.io/dashboard-masjid/
```

---

## 🔌 Sumber Data Aplikasi

Dashboard ini dapat mengambil data dari **Google Apps Script** yang terhubung ke Google Sheet.

Pada file `script.js`, endpoint utama berada pada variabel:

```javascript
const DASHBOARD_API_URL = "https://script.google.com/macros/s/SCRIPT_ID/exec";
```

Untuk menggunakan data milik masjid sendiri, ganti nilai tersebut dengan URL Web App Google Apps Script Anda.

---

## 🧾 Struktur Data API

Aplikasi membaca beberapa jenis data, antara lain:

### 1. Pengaturan Umum

Digunakan untuk identitas masjid dan konfigurasi dasar.

```json
{
  "pengaturan": {
    "nama_masjid": "Masjid Al Amanah Kementerian Keuangan",
    "label_periode": "Jumat, 22 Mei 2026",
    "myquran_kota_id": "1301",
    "myquran_kota_nama": "DKI Jakarta"
  }
}
```

### 2. Jadwal Kajian

Slide kajian hanya akan ditampilkan apabila status bernilai aktif.

```json
{
  "kajian": [
    {
      "judul": "Kajian Ba'da Dzuhur",
      "pemateri": "Ustadz Ahmad",
      "tanggal_kajian": "Senin, 25 Mei 2026",
      "tanggal_kajian_iso": "2026-05-25",
      "waktu": "12:15 WIB",
      "tempat": "Ruang Utama Masjid Al Amanah",
      "tema": "Keutamaan Sedekah",
      "status": "aktif"
    }
  ]
}
```

### 3. Laporan Kas Jumat

Digunakan untuk menampilkan informasi keuangan masjid secara ringkas dan transparan.

```json
{
  "kas_jumat": {
    "label_periode": "Jumat, 22 Mei 2026",
    "saldo_awal": 7497047,
    "pemasukan": 34382925,
    "pengeluaran": 14831589,
    "saldo_akhir": 19551336,
    "keterangan": "Penggunaan dana untuk operasional masjid, kebersihan, dan kegiatan lainnya.",
    "status": "aktif"
  }
}
```

### 4. Donasi

Digunakan untuk menampilkan target donasi, dana terkumpul, progress, dan informasi penyaluran.

```json
{
  "donasi_palestina": {
    "target": 200000000,
    "terkumpul": 135157857,
    "progress": 67.58,
    "jumlah_donatur": 126,
    "keterangan": "Donasi akan disalurkan melalui lembaga resmi sesuai ketetapan pengurus masjid.",
    "status": "aktif"
  }
}
```

### 5. Jadwal Shalat

Kode kota untuk jadwal shalat dapat diatur melalui variabel:

```javascript
const MYQURAN_CITY_ID = "1301";
```

Nilai `1301` digunakan untuk wilayah DKI Jakarta. Untuk wilayah lain, sesuaikan dengan kode kota/kabupaten pada sumber jadwal shalat yang digunakan.

---

## 🧑‍💻 Cara Menyesuaikan untuk Masjid Lain

### 1. Mengganti nama masjid

Buka file:

```text
index.html
```

Cari bagian nama masjid, lalu ubah sesuai kebutuhan.

Contoh:

```html
<h1>MASJID AL AMANAH</h1>
<p>KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</p>
```

### 2. Mengganti alamat

Masih pada `index.html`, ubah teks alamat masjid.

Contoh:

```text
Jl. Lapangan Banteng Timur No. 2-4 Jakarta Pusat Kode Pos 10710
```

### 3. Mengganti logo

Ganti file berikut dengan logo masjid Anda:

```text
logo.png
```

Gunakan nama file yang sama agar tidak perlu mengubah kode.

Rekomendasi:

- format PNG;
- latar transparan;
- ukuran proporsional;
- resolusi cukup tinggi agar tidak pecah di layar TV.

### 4. Mengganti background

Ganti file:

```text
bg.jpg
```

Rekomendasi:

- gunakan foto masjid sendiri;
- orientasi landscape;
- rasio 16:9;
- kualitas cukup baik;
- jangan terlalu ramai agar teks tetap terbaca.

### 5. Mengganti gambar himbauan

Ganti file berikut sesuai kebutuhan:

```text
himbauan-hp.png
himbauan-kebersihan.png
himbauan-barang.png
```

Anda juga dapat menambahkan gambar himbauan baru, lalu mendaftarkannya pada konfigurasi slide di `script.js`.

### 6. Mengganti endpoint Google Apps Script

Buka file:

```text
script.js
```

Cari bagian:

```javascript
const DASHBOARD_API_URL = "...";
```

Ganti dengan URL Web App Google Apps Script milik masjid Anda.

### 7. Mengubah kota jadwal shalat

Buka file:

```text
script.js
```

Cari bagian:

```javascript
const MYQURAN_CITY_ID = "1301";
```

Ubah kode kota sesuai wilayah masjid.

### 8. Mengubah warna dan tampilan

Buka file:

```text
styles.css
```

Bagian yang dapat disesuaikan:

- warna utama;
- warna aksen;
- ukuran font;
- transparansi kartu;
- efek gradasi;
- ukuran running text;
- jarak antar elemen;
- layout slide;
- tampilan untuk layar besar.

---

## 📋 Rekomendasi Operasional di Masjid

Untuk hasil terbaik:

1. Gunakan layar TV atau monitor dengan orientasi landscape.
2. Buka dashboard menggunakan Chrome, Edge, atau browser modern lainnya.
3. Aktifkan mode fullscreen dengan tombol `F11`.
4. Pastikan koneksi internet stabil.
5. Nonaktifkan mode sleep pada laptop, mini PC, atau perangkat display.
6. Gunakan akun Google khusus DKM untuk mengelola Google Sheet dan Apps Script.
7. Lakukan pengecekan data sebelum waktu jamaah ramai, misalnya sebelum shalat Jumat.
8. Simpan backup file project sebelum melakukan perubahan besar.

---

## 🔄 Alur Update Data Rutin

Contoh alur kerja sederhana untuk pengurus masjid:

```text
Pengurus mengisi Google Sheet
        ↓
Google Apps Script membaca data
        ↓
Dashboard mengambil data melalui API
        ↓
TV masjid menampilkan informasi terbaru
```

Dengan alur ini, pengurus cukup memperbarui Google Sheet tanpa perlu mengubah kode setiap hari.

---

## 🛠️ Troubleshooting

### Jadwal shalat tidak muncul

Kemungkinan penyebab:

- koneksi internet bermasalah;
- API jadwal shalat sedang tidak dapat diakses;
- kode kota salah;
- browser memblokir request tertentu.

Solusi:

- refresh halaman;
- cek koneksi internet;
- pastikan `MYQURAN_CITY_ID` benar;
- cek console browser dengan menekan `F12`.

### Slide kajian tidak tampil

Kemungkinan penyebab:

- data kajian belum diisi;
- status kajian bukan `aktif`;
- struktur JSON tidak sesuai;
- endpoint Google Apps Script belum benar.

Solusi:

- cek data pada Google Sheet;
- pastikan status bernilai `aktif`;
- buka URL Apps Script langsung di browser;
- pastikan respons berupa JSON.

### Data kas atau donasi tidak berubah

Kemungkinan penyebab:

- cache browser;
- data Google Sheet belum tersimpan;
- Apps Script belum dideploy ulang;
- nama field tidak sesuai dengan struktur yang dibaca aplikasi.

Solusi:

- refresh dengan `Ctrl + F5`;
- cek Web App Google Apps Script;
- deploy ulang Apps Script jika ada perubahan kode;
- samakan nama field dengan contoh struktur API.

### Tampilan pecah di TV

Kemungkinan penyebab:

- resolusi layar tidak umum;
- browser belum fullscreen;
- ukuran zoom browser berubah;
- gambar background terlalu kecil.

Solusi:

- tekan `F11`;
- atur zoom browser ke 100%;
- gunakan layar 16:9;
- gunakan background resolusi tinggi.

---

## 🔐 Catatan Keamanan dan Privasi

Karena dashboard ini ditampilkan secara publik pada layar masjid, sebaiknya:

- jangan tampilkan data pribadi jamaah;
- jangan tampilkan nomor rekening pribadi tanpa persetujuan;
- jangan menyimpan credential di `script.js`;
- gunakan Google Sheet khusus untuk data publik;
- pisahkan data internal DKM dari data yang ditampilkan di dashboard;
- pastikan Google Apps Script hanya mengeluarkan data yang memang boleh dibaca publik.

---

## 🧩 Ide Pengembangan Lanjutan

Beberapa ide yang dapat dikembangkan:

- mode tema Ramadan;
- jadwal imam dan muadzin;
- hitung mundur iqamah;
- informasi kajian mingguan;
- integrasi QRIS donasi;
- panel admin sederhana;
- mode multi-masjid;
- dukungan beberapa bahasa;
- template slide khusus Jumat;
- pengumuman otomatis menjelang waktu shalat.

---

## 🤝 Kontribusi

Kontribusi sangat terbuka, terutama untuk:

- memperbaiki tampilan;
- menambah template slide;
- memperbaiki dokumentasi;
- menambah contoh Google Sheet;
- membuat panduan video;
- memperbaiki kompatibilitas layar;
- membuat versi yang lebih mudah digunakan pengurus masjid non-teknis.

Alur kontribusi:

```text
Fork repository
        ↓
Buat branch perubahan
        ↓
Lakukan commit
        ↓
Ajukan Pull Request
```

---

## 📜 Lisensi

Project ini menggunakan lisensi **GNU General Public License v3.0 (GPL-3.0)**.

Artinya, project ini boleh digunakan, dipelajari, dimodifikasi, dan didistribusikan kembali dengan tetap memperhatikan ketentuan lisensi yang berlaku.

---

## 🤲 Dedikasi

Project ini didedikasikan untuk **ummat**.

Semoga dashboard ini membantu masjid dan musala menyampaikan informasi dengan lebih baik, meningkatkan transparansi pengelolaan kegiatan dan kas, serta memudahkan jamaah memperoleh informasi yang bermanfaat.

> _"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya."_

Semoga setiap baris kode, setiap tampilan informasi, dan setiap kemudahan yang muncul dari project ini menjadi jalan kebaikan.

---

## 🙏 Kredit

Dibuat dan dibagikan oleh **cakgup**.

**Made with love for ummat.**
