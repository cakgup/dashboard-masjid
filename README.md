# Dashboard Masjid Static GitHub Pages

Dashboard ini dibuat sebagai media informasi digital untuk masjid/musala, khususnya untuk menampilkan jam, tanggal, jadwal shalat, jadwal kajian, laporan kas, donasi, himbauan, dan running text secara ringan melalui halaman web statis.

Project ini didedikasikan untuk ummat. Silakan digunakan, dipelajari, dimodifikasi, dan diduplikasi oleh pengurus masjid di mana pun agar informasi kegiatan masjid dapat tersampaikan dengan lebih rapi, transparan, dan mudah diakses jamaah.

**Made with love by cakgup.**

---

## Fitur Utama

- Tampilan dashboard masjid fullscreen untuk TV/display informasi.
- Jam digital real-time dengan zona waktu Indonesia Barat.
- Tanggal Masehi dan Hijriah.
- Jadwal shalat harian dari API MyQuran.
- Slide jadwal kajian dari Google Apps Script.
- Slide laporan kas Jumat dari data API.
- Slide donasi Palestina dari data API.
- Slide himbauan visual untuk jamaah.
- Running text tanpa jeda panjang.
- Efek visual ringan, seperti gradasi bergerak dan partikel halus.
- Struktur sangat sederhana, cocok untuk GitHub Pages.
- Tidak membutuhkan Node.js, npm, build, database, atau server backend sendiri.

---

## Struktur Program

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

Penjelasan file:

| File | Fungsi |
|---|---|
| `index.html` | Struktur utama halaman dashboard. |
| `script.js` | Logika aplikasi, pengambilan API, jam, jadwal shalat, slide, running text, dan efek visual. |
| `styles.css` | Seluruh pengaturan tampilan, layout, warna, ukuran font, animasi, dan responsivitas. |
| `logo.png` | Logo masjid/lembaga yang tampil di bagian header. |
| `bg.jpg` | Gambar latar belakang dashboard. |
| `himbauan-hp.png` | Gambar slide himbauan penggunaan/penonaktifan telepon genggam. |
| `himbauan-kebersihan.png` | Gambar slide himbauan kebersihan. |
| `himbauan-barang.png` | Gambar slide himbauan menjaga barang bawaan. |
| `README.md` | Dokumentasi penggunaan dan modifikasi. |
| `LICENSE` | Informasi lisensi project. |

---

## Cara Menjalankan Secara Lokal

Karena project ini static, cukup jalankan web server sederhana dari folder project.

### Opsi 1: Menggunakan Python

Buka terminal pada folder project, lalu jalankan:

```bash
python -m http.server 8000
```

Kemudian buka browser:

```text
http://localhost:8000
```

### Opsi 2: Menggunakan VS Code Live Server

1. Buka folder project di VS Code.
2. Install extension **Live Server**.
3. Klik kanan file `index.html`.
4. Pilih **Open with Live Server**.

---

## Cara Upload ke GitHub Pages

1. Buat repository GitHub baru, misalnya:

   ```text
   dashboard-masjid
   ```

2. Upload semua file project ke root repository, bukan ke dalam folder tambahan.

3. Pastikan struktur repository menjadi seperti ini:

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

4. Buka menu repository:

   ```text
   Settings → Pages
   ```

5. Pada bagian **Build and deployment**, pilih:

   ```text
   Source: Deploy from a branch
   Branch: main
   Folder: /root
   ```

6. Simpan pengaturan.

7. Tunggu beberapa saat, lalu akses halaman GitHub Pages, misalnya:

   ```text
   https://username.github.io/dashboard-masjid/
   ```

---

## Sumber Data

Dashboard mengambil data utama dari Google Apps Script berikut:

```text
https://script.google.com/macros/s/SCRIPT_ID/exec
```

Di dalam `script.js`, endpoint tersebut berada pada variabel:

```javascript
const DASHBOARD_API_URL = "https://script.google.com/macros/s/SCRIPT_ID/exec";
```

Aplikasi akan otomatis menambahkan parameter `tanggal_update` berdasarkan tanggal hari ini zona waktu Jakarta. Contoh:

```text
...?tanggal_update=2026-05-22
```

Jika data kajian aktif tidak ditemukan pada endpoint bertanggal, aplikasi akan mencoba membaca endpoint dasar tanpa parameter sebagai fallback.

---

## Struktur Data API yang Digunakan

### 1. Pengaturan

Digunakan untuk identitas masjid, label periode, dan konfigurasi umum.

Contoh field yang dapat digunakan:

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

### 2. Kajian

Slide kajian hanya akan ditampilkan jika data kajian memiliki:

```json
"status": "aktif"
```

Contoh:

```json
{
  "kajian": [
    {
      "judul": "Kajian Ba’da Dzuhur",
      "pemateri": "Ust. Ahmad",
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

Catatan:

- Jika tidak ada kajian dengan `status: "aktif"`, slide kajian tidak ditampilkan.
- Tidak ada fallback kajian statis, sehingga data kajian lama tidak akan muncul secara palsu.
- Format tampilan waktu akan dirapikan menjadi seperti:

```text
Senin, 25 Mei 2026, pukul 12.15 WIB
```

### 3. Kas Jumat

Digunakan untuk slide laporan kas masjid.

Contoh:

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

Field `keterangan` akan tampil pada bagian bawah slide laporan kas.

### 4. Donasi Palestina

Digunakan untuk slide target donasi dan progress donasi.

Contoh:

```json
{
  "donasi_palestina": {
    "target": 200000000,
    "terkumpul": 135157857,
    "progress": 67.58,
    "jumlah_donatur": 126,
    "keterangan": "Donasi transfer melalui: Rekening BSI 7015518248 a.n. Yayasan Rumah Zakat Indonesia",
    "status": "aktif"
  }
}
```

Field `keterangan` akan tampil pada bagian bawah slide donasi.

### 5. Jadwal Shalat

Jadwal shalat diambil dari API MyQuran menggunakan kode kota:

```javascript
const MYQURAN_CITY_ID = "1301";
```

Default saat ini menggunakan DKI Jakarta. Untuk masjid di wilayah lain, ubah kode kota sesuai ID kota/kabupaten pada MyQuran.

---

## Cara Modifikasi untuk Masjid Lain

### 1. Mengganti Nama Masjid

Buka `index.html`, cari bagian header, lalu ubah teks nama masjid dan instansi/yayasan sesuai kebutuhan.

Contoh:

```html
<h1>MASJID AL AMANAH</h1>
<p>KEMENTERIAN KEUANGAN REPUBLIK INDONESIA</p>
```

### 2. Mengganti Alamat

Buka `index.html`, cari teks alamat:

```text
Jl. Lapangan Banteng Timur No. 2-4 Jakarta Pusat Kode Pos 10710
```

Ubah sesuai alamat masjid masing-masing. Ikon lokasi sudah menggunakan SVG inline sehingga tidak membutuhkan file ikon tambahan.

### 3. Mengganti Logo

Ganti file:

```text
logo.png
```

Gunakan nama file yang sama agar tidak perlu mengubah kode. Disarankan menggunakan format PNG dengan latar transparan.

### 4. Mengganti Background

Ganti file:

```text
bg.jpg
```

Gunakan gambar masjid masing-masing dengan orientasi landscape agar tampilan layar TV lebih proporsional.

### 5. Mengganti Gambar Himbauan

Ganti file berikut sesuai kebutuhan:

```text
himbauan-hp.png
himbauan-kebersihan.png
himbauan-barang.png
```

Jika ingin menambah slide gambar baru, tambahkan file gambar baru lalu daftarkan di bagian konfigurasi slide pada `script.js`.

### 6. Mengganti Endpoint Google Apps Script

Buka `script.js`, ubah bagian:

```javascript
const DASHBOARD_API_URL = "...";
```

Isi dengan URL Apps Script milik masjid masing-masing.

### 7. Mengubah Kota Jadwal Shalat

Buka `script.js`, lalu ubah:

```javascript
const MYQURAN_CITY_ID = "1301";
```

Gunakan ID kota/kabupaten sesuai lokasi masjid.

### 8. Mengubah Warna dan Tampilan

Buka `styles.css` untuk mengubah:

- warna utama;
- warna aksen;
- ukuran font;
- jarak antar elemen;
- efek gradasi;
- transparansi card;
- ukuran running text;
- layout slide.

Bagian yang paling sering diubah biasanya berada di awal file `styles.css`, terutama variabel warna dan konfigurasi dasar tampilan.

---

## Rekomendasi Penggunaan di Masjid

Untuk tampilan terbaik:

- gunakan layar TV landscape;
- buka dashboard melalui browser Chrome/Edge;
- aktifkan mode fullscreen dengan tombol `F11`;
- gunakan koneksi internet stabil agar API jadwal shalat dan data Google Sheet dapat terbaca;
- pastikan komputer/mini PC yang terhubung ke TV tidak masuk sleep mode;
- gunakan refresh otomatis browser jika diperlukan.

---

## Prinsip Pengembangan

Project ini dibuat dengan prinsip:

- ringan;
- mudah dipasang;
- mudah dimodifikasi;
- tidak tergantung proses build;
- dapat dipakai oleh pengurus masjid non-programmer;
- transparan untuk informasi jamaah;
- terbuka untuk diduplikasi dan dikembangkan kembali.

Semoga project sederhana ini menjadi amal jariyah dan bermanfaat bagi pengurus masjid, jamaah, serta masyarakat luas.

**Silakan digunakan untuk masjid masing-masing. Semoga Allah mudahkan setiap ikhtiar kebaikan.**

---

## Kredit

Dibuat dan dibagikan untuk ummat.

**Made with love by cakgup.**
