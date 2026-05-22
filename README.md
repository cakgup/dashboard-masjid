# Dashboard Masjid Al Amanah — Kementerian Keuangan RI

Dashboard informasi digital berbasis **Next.js** untuk layar TV di Masjid Al Amanah Kemenkeu. Menampilkan jadwal sholat otomatis, slide kajian, laporan kas, donasi, dan himbauan secara bergantian.

---

## 📺 Tampilan Layar

| Slide | Konten |
|---|---|
| **Jadwal Sholat** | Tampil permanen di bagian bawah layar, otomatis dari API Kemenag |
| **Kajian Ba'da Dzuhur** | Informasi tema, pemateri, waktu, dan lokasi kajian |
| **Laporan Kas** | Saldo awal, pemasukan, pengeluaran, saldo akhir |
| **Donasi** | Program donasi, target, dana terkumpul, dan progress bar |
| **Himbauan** | Slide pengingat (nonaktifkan HP, jaga kebersihan, dll.) |
| **Running Text** | Informasi penting berputar di bagian paling bawah |

---

## 🗂️ Struktur File Penting

```
src/
├── components/
│   ├── Header.tsx          → Logo, nama masjid, jam, tanggal
│   ├── PrayerTimes.tsx     → Bar jadwal sholat (otomatis dari API)
│   ├── Marquee.tsx         → Running text bagian bawah
│   └── slides/
│       ├── SlideContainer.tsx   ⭐ FILE UTAMA: Data semua slide
│       ├── KajianSlide.tsx      → Tampilan slide kajian
│       ├── CashReportSlide.tsx  → Tampilan slide laporan kas
│       ├── DonationSlide.tsx    → Tampilan slide donasi
│       └── ReminderSlide.tsx    → Tampilan slide himbauan
public/
├── logo.png                → Logo masjid (lingkaran di header)
├── bg.jpg                  → Gambar latar belakang layar
├── himbauan-hp.png         → Ikon slide himbauan HP
├── himbauan-kebersihan.png → Ikon slide himbauan kebersihan
└── himbauan-barang.png     → Ikon slide himbauan barang bawaan
```

---

## 🔄 Panduan Update Bulanan

### ⭐ File Utama: `src/components/slides/SlideContainer.tsx`

Ini adalah **satu-satunya file** yang perlu diedit setiap bulan untuk memperbarui data. Semua informasi slide tersimpan di variabel `DUMMY_SLIDES`.

---

### 📚 1. Update Jadwal Kajian

Cari objek dengan `type: "kajian"` dan ubah properti berikut:

```typescript
{
  id: "1",
  type: "kajian",
  duration: 15000,        // Durasi tampil dalam milidetik (15000 = 15 detik)
  active: true,
  judul: "Kajian Ba'da Dzuhur",         // ← Judul kajian
  tema: "Menjaga Keikhlasan dalam Beramal",  // ← GANTI: Tema kajian bulan ini
  pemateri: "Ustadz Ahmad",             // ← GANTI: Nama pemateri
  waktu: "Rabu, 20 Mei 2026, pukul 12.15 WIB",  // ← GANTI: Hari, tanggal, jam
  lokasi: "Ruang Utama Masjid Al Amanah",        // ← GANTI: Lokasi jika berbeda
},
```

> **Tip:** Jika kajian tiap hari berbeda pemateri, tambahkan objek baru dengan `id: "1c"`, `id: "1d"`, dst. Jika ingin hapus hari tertentu, cukup hapus seluruh blok `{ ... }` tersebut.

---

### ➕ Menambah Slide Kajian

Untuk menambah slide kajian hari baru, **salin blok berikut** dan tempelkan tepat di bawah kajian terakhir (sebelum blok `type: "kas"`), lalu sesuaikan isinya:

```typescript
{
  id: "1c",                   // ← ID unik, lanjutkan dari ID sebelumnya
  type: "kajian",
  duration: 15000,            // Durasi tampil (milidetik). 15000 = 15 detik
  active: true,
  judul: "Kajian Ba'da Dzuhur",
  tema: "Tulis tema kajian hari ini",
  pemateri: "Tulis nama pemateri lengkap",
  waktu: "Kamis, 21 Mei 2026, pukul 12.15 WIB",
  lokasi: "Ruang Utama Masjid Al Amanah",
},
```

**Contoh: menambah kajian hari Jumat**

```typescript
// Tambahkan blok ini setelah kajian hari Kamis
{
  id: "1d",
  type: "kajian",
  duration: 15000,
  active: true,
  judul: "Kajian Ba'da Jum'at",
  tema: "Adab Berdoa dan Keutamaannya",
  pemateri: "Ustadz Dr. Khalid Basalamah, MA",
  waktu: "Jumat, 22 Mei 2026, pukul 13.30 WIB",
  lokasi: "Ruang Utama Masjid Al Amanah",
},
```

---

### ➖ Menghapus Slide Kajian

Untuk menghapus kajian hari tertentu, cukup **hapus seluruh blok** dari tanda `{` sampai `},` untuk kajian tersebut.

**Sebelum dihapus:**
```typescript
const DUMMY_SLIDES: AnySlide[] = [
  {
    id: "1",
    type: "kajian",
    ...  // Kajian Rabu
  },
  {
    id: "1b",
    type: "kajian",
    ...  // Kajian Kamis ← ingin dihapus
  },
  {
    id: "2",
    type: "kas",
    ...
  },
```

**Setelah dihapus (kajian Kamis sudah tidak ada):**
```typescript
const DUMMY_SLIDES: AnySlide[] = [
  {
    id: "1",
    type: "kajian",
    ...  // Kajian Rabu
  },
  {
    id: "2",
    type: "kas",
    ...
  },
```

> ⚠️ **Perhatian:** Pastikan tidak ada tanda koma `,` yang tertinggal atau hilang setelah penghapusan, karena dapat menyebabkan error. Blok terakhir dalam array **tidak boleh** diakhiri koma.

---

### 🌙 Menggunakan Slide Kajian untuk Acara Khusus

Slide kajian bisa digunakan untuk **acara apa pun**, tidak hanya kajian rutin. Cukup sesuaikan judul, tema, dan kolom-kolomnya dengan informasi acara tersebut.

**Contoh: Slide I'tikaf Ramadan**

```typescript
{
  id: "1e",
  type: "kajian",
  duration: 15000,
  active: true,
  judul: "I'tikaf Ramadan 1447 H",                     // ← Nama acara
  tema: "Meraih Lailatul Qadar dengan Ibadah Optimal", // ← Tema/subtema acara
  pemateri: "Panitia DKM Al Amanah",                   // ← Penanggung jawab / pemateri
  waktu: "21–29 Ramadan 1447 H (malam ganjil)",        // ← Waktu pelaksanaan
  lokasi: "Masjid Al Amanah Lt. 1 & 2",               // ← Lokasi
},
```

**Contoh: Slide Pengajian Akbar / Tabligh Akbar**

```typescript
{
  id: "1f",
  type: "kajian",
  duration: 15000,
  active: true,
  judul: "Tabligh Akbar",
  tema: "Hikmah Isra Mi'raj dalam Kehidupan Modern",
  pemateri: "Prof. Dr. KH. Ahmad Mujib Ashari",
  waktu: "Sabtu, 26 Januari 2026, pukul 08.00 WIB",
  lokasi: "Halaman Masjid Al Amanah",
},
```

**Contoh: Slide Rapat / Kegiatan Internal**

```typescript
{
  id: "1g",
  type: "kajian",
  duration: 15000,
  active: true,
  judul: "Rapat Pengurus DKM",
  tema: "Pembahasan Program Kerja Semester II 2026",
  pemateri: "Ketua DKM Al Amanah",
  waktu: "Minggu, 1 Juni 2026, pukul 09.00 WIB",
  lokasi: "Ruang Rapat Lt. 2",
},
```

> 💡 **Tips penggunaan acara khusus:**
> - Kolom `judul` → nama acara utama (tampil paling besar di atas)
> - Kolom `tema` → subtema, topik, atau tagline acara (tampil di tengah, berwarna emas)
> - Kolom `pemateri` → nama pembicara, panitia, atau penanggung jawab
> - Kolom `waktu` → bisa diisi rentang tanggal (misal: "21–29 Ramadan 1447 H")
> - Kolom `lokasi` → tempat pelaksanaan, boleh berbeda dengan masjid

---

### 🔕 Menonaktifkan Slide Sementara (Tanpa Menghapus)

Jika acara sudah selesai atau slide tidak ingin ditampilkan sementara waktu, **jangan langsung dihapus**. Ada dua cara yang lebih aman agar slide bisa digunakan kembali nanti:

---

#### ✅ Cara 1: Gunakan `active: false` *(Direkomendasikan)*

Cukup ubah nilai `active` dari `true` menjadi `false`. Slide akan **otomatis dilewati** tanpa perlu dihapus.

```typescript
{
  id: "1e",
  type: "kajian",
  duration: 15000,
  active: false,   // ← Ganti dari true menjadi false → slide tidak akan tampil
  judul: "I'tikaf Ramadan 1447 H",
  tema: "Meraih Lailatul Qadar dengan Ibadah Optimal",
  pemateri: "Panitia DKM Al Amanah",
  waktu: "21–29 Ramadan 1447 H (malam ganjil)",
  lokasi: "Masjid Al Amanah Lt. 1 & 2",
},
```

Saat acara berikutnya tiba, cukup ganti kembali ke `active: true` dan perbarui isi datanya. Praktis!

---

#### 💬 Cara 2: Jadikan Komentar (`/* ... */`)

Blok slide bisa "dibekukan" dengan membungkusnya dalam komentar JavaScript. Slide tidak akan dibaca oleh program sama sekali.

```typescript
/* -- Dinonaktifkan sementara, aktifkan kembali saat i'tikaf berikutnya --
{
  id: "1e",
  type: "kajian",
  duration: 15000,
  active: true,
  judul: "I'tikaf Ramadan 1447 H",
  tema: "Meraih Lailatul Qadar dengan Ibadah Optimal",
  pemateri: "Panitia DKM Al Amanah",
  waktu: "21–29 Ramadan 1447 H (malam ganjil)",
  lokasi: "Masjid Al Amanah Lt. 1 & 2",
},
*/
```

Untuk mengaktifkan kembali, hapus `/*` di awal dan `*/` di akhir.

---

> 🏆 **Perbandingan kedua cara:**
>
> | | `active: false` | Komentar `/* */` |
> |---|---|---|
> | Mudah diaktifkan kembali | ✅ Ganti satu kata | ✅ Hapus 2 tanda |
> | Data tetap rapi & terbaca | ✅ Ya | ✅ Ya |
> | Direkomendasikan | ⭐ **Ya** | Bisa |

Cari objek dengan `type: "kas"` dan ubah angka-angkanya:

```typescript
{
  id: "2",
  type: "kas",
  duration: 15000,
  active: true,
  periode: "Mei 2026",          // ← GANTI: "Juni 2026", "Juli 2026", dst.
  saldoAwal: 15000000,          // ← GANTI: Saldo awal bulan (angka tanpa titik/koma)
  pemasukan: 7500000,           // ← GANTI: Total pemasukan bulan ini
  pengeluaran: 3250000,         // ← GANTI: Total pengeluaran bulan ini
  saldoAkhir: 19250000,         // ← GANTI: Saldo akhir (saldoAwal + pemasukan - pengeluaran)
  keterangan: "Penggunaan dana untuk operasional masjid...",  // ← GANTI: Catatan penggunaan dana
},
```

> **Catatan format angka:** Tulis tanpa titik, koma, atau Rp. Contoh: Rp 15.000.000 ditulis `15000000`

---

### 💰 3. Update Program Donasi

Cari objek dengan `type: "donation"` dan ubah datanya:

```typescript
{
  id: "3",
  type: "donation",
  duration: 15000,
  active: true,
  program: "Donasi Kemanusiaan Palestina",   // ← GANTI: Nama program donasi
  target: 50000000,                          // ← GANTI: Target donasi (angka)
  terkumpul: 32500000,                       // ← GANTI: Dana yang sudah terkumpul
  periode: "Mei 2026",                       // ← GANTI: Periode donasi
  keterangan: "Donasi akan disalurkan...",   // ← GANTI: Keterangan penyaluran
},
```

> **Progress bar** otomatis dihitung dari `terkumpul / target × 100%`

---

### 📢 4. Update Running Text (Marquee)

Edit file: **`src/components/Marquee.tsx`**

```typescript
// Ubah teks di antara tag <div> berikut:
Selamat datang di Masjid Al Amanah Kementerian Keuangan
  &nbsp; • &nbsp;
Mari luruskan dan rapatkan shaf sebelum shalat dimulai
  &nbsp; • &nbsp;
Kajian rutin setiap ba'da Maghrib
  &nbsp; • &nbsp;
Salurkan Infaq dan Sedekah terbaik Anda melalui rekening BSI:
123456789 a/n DKM Al Amanah    // ← GANTI: Nomor rekening jika berubah
```

> **Format pemisah:** Gunakan `&nbsp; • &nbsp;` untuk memisahkan antar informasi

---

### 🔔 5. Menambah/Menghapus Slide Himbauan

Slide himbauan menggunakan format `baris` yang fleksibel. Teks **tebal** (`bold: true`) akan berwarna **kuning emas**.

```typescript
{
  id: "7",               // ← ID unik, gunakan angka berikutnya
  type: "reminder",
  duration: 15000,
  active: true,
  baris: [
    // Setiap array di dalam adalah satu baris
    [{ text: "harap menjaga ", bold: false }, { text: "wudhu", bold: true }],
    [{ text: "sebelum memasuki masjid", bold: false }],
  ],
  imagePath: "/himbauan-wudhu.png",  // ← Nama file gambar di folder public/
},
```

Untuk gambar himbauan baru:
1. Siapkan file PNG (background transparan lebih bagus)
2. Letakkan di folder `public/`
3. Referensikan sebagai `"/nama-file.png"`

---

## 🕌 Info Masjid (Jarang Berubah)

Jika nama masjid, alamat, atau logo perlu diubah, edit file **`src/components/Header.tsx`**:

```typescript
// Baris 133-138: Nama dan alamat
<span>Masjid Al Amanah</span>
<span>Kementerian Keuangan Republik Indonesia</span>
<span>Jl. Lapangan Banteng Timur No. 2-4 Jakarta Pusat</span>
```

Untuk **logo**, ganti file `public/logo.png` dengan logo baru (usahakan ukuran sama, format PNG).

---

## 🕐 Jadwal Sholat

Jadwal sholat **otomatis diambil dari API myquran.com** (sumber: Bimas Islam Kemenag RI) setiap hari saat halaman dibuka. Tidak perlu update manual.

- **Kota:** Jakarta (ID: 1301)
- **Sumber:** `https://api.myquran.com/v2/sholat/jadwal/1301/`
- **Fallback:** Jika internet tidak tersedia, jadwal terakhir atau data default akan ditampilkan

---

## ⚙️ Cara Menjalankan Secara Lokal

```bash
# Install dependencies (cukup sekali)
npm install

# Jalankan mode development
npm run dev

# Buka di browser
http://localhost:3000
```

---

## 🚀 Cara Update dan Push ke GitHub

Setelah mengubah data di `SlideContainer.tsx` atau file lainnya:

```bash
# 1. Simpan semua perubahan
git add .

# 2. Buat commit dengan pesan yang jelas
git commit -m "update: data kajian, kas, dan donasi bulan Juni 2026"

# 3. Push ke GitHub
git push
```

---

## 📋 Checklist Update Bulanan

Copy checklist ini setiap awal bulan:

```
[ ] Update tema & pemateri kajian (SlideContainer.tsx)
[ ] Update tanggal kajian bulan baru
[ ] Update periode laporan kas
[ ] Update saldo awal, pemasukan, pengeluaran, saldo akhir
[ ] Update keterangan penggunaan kas
[ ] Update dana terkumpul program donasi
[ ] Update teks running text jika ada info baru (Marquee.tsx)
[ ] Commit & push ke GitHub
```

---

## 🛠️ Teknologi

- **Next.js 16** — Framework React
- **Tailwind CSS** — Styling
- **date-fns** — Format tanggal
- **hijri-converter** — Konversi kalender Hijriah
- **lucide-react** — Ikon
- **myquran.com API** — Jadwal sholat Kemenag RI

---

*Dashboard ini dikembangkan untuk Masjid Al Amanah, Kementerian Keuangan Republik Indonesia.*
*Created by Cakgup*
