/* Dashboard Masjid Al Amanah - Static GitHub Pages Version
 * Cukup upload index.html, styles.css, script.js, dan file gambar ke GitHub Pages.
 */

const DASHBOARD_API_URL = "https://script.google.com/macros/s/AKfycbyq0UsoCdCsaGEcFqoxO23cyEkMoKDyhWB_aCTCn7bKDeI_G2Exnt5-rLSFoccHBgZx/exec";
const MYQURAN_CITY_ID = "1301"; // DKI Jakarta
const DASHBOARD_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const PRAYER_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const FALLBACK_PRAYER_TIMES = [
  { name: "Imsak", time: "04:15" },
  { name: "Subuh", time: "04:25" },
  { name: "Syuruq", time: "05:42" },
  { name: "Dzuhur", time: "11:41" },
  { name: "Ashar", time: "15:02" },
  { name: "Maghrib", time: "17:47" },
  { name: "Isya", time: "18:59" },
];

const FALLBACK_SLIDES = [
  {
    id: "kas-fallback",
    type: "kas",
    duration: 15000,
    active: true,
    periode: "-",
    saldoAwal: 0,
    pemasukan: 0,
    pengeluaran: 0,
    saldoAkhir: 0,
    keterangan: "Data kas belum tersedia.",
  },
  {
    id: "donation-fallback",
    type: "donation",
    duration: 15000,
    active: true,
    program: "Donasi Kemanusiaan Palestina",
    target: 0,
    terkumpul: 0,
    periode: "-",
    keterangan: "Data donasi belum tersedia.",
  },
  {
    id: "reminder-hp",
    type: "reminder",
    duration: 15000,
    active: true,
    imagePath: "./himbauan-hp.png",
    baris: [
      [{ text: "terima kasih telah ", bold: false }, { text: "menonaktifkan", bold: true }],
      [{ text: "alat komunikasi", bold: false }],
    ],
  },
  {
    id: "reminder-kebersihan",
    type: "reminder",
    duration: 15000,
    active: true,
    imagePath: "./himbauan-kebersihan.png",
    baris: [
      [{ text: "terima kasih telah ", bold: false }, { text: "menjaga kebersihan", bold: true }],
      [{ text: "di Masjid Al Amanah Kementerian Keuangan", bold: false }],
    ],
  },
  {
    id: "reminder-barang",
    type: "reminder",
    duration: 15000,
    active: true,
    imagePath: "./himbauan-barang.png",
    baris: [
      [{ text: "pastikan barang bawaan anda ", bold: false }, { text: "aman", bold: true }],
      [{ text: "dan dalam ", bold: false }, { text: "pengawasan", bold: true }],
    ],
  },
];

let activeSlides = FALLBACK_SLIDES.filter((slide) => slide.active);
let currentSlideIndex = 0;
let slideSwitchTimer = null;
let slideFadeTimer = null;
let prayerTimes = FALLBACK_PRAYER_TIMES;

const els = {
  clock: document.getElementById("clock"),
  gregorianDate: document.getElementById("gregorianDate"),
  hijriDate: document.getElementById("hijriDate"),
  iqomahReminder: document.getElementById("iqomahReminder"),
  prayerTimes: document.getElementById("prayerTimes"),
  slideCard: document.getElementById("slideCard"),
  slideContent: document.getElementById("slideContent"),
  snowLayer: document.getElementById("snowLayer"),
};

function iconSvg(name) {
  const icons = {
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>',
    map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    landmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="3" x2="21" y1="22" y2="22"></line><line x1="6" x2="6" y1="18" y2="11"></line><line x1="10" x2="10" y1="18" y2="11"></line><line x1="14" x2="14" y1="18" y2="11"></line><line x1="18" x2="18" y1="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg>',
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>'
  };
  return icons[name] || '';
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeKey(key) {
  return String(key || "")
    .toLowerCase()
    .trim()
    .replace(/[()]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, "_");
}

function toRow(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function toRows(value) {
  if (Array.isArray(value)) return value.filter((item) => item && typeof item === "object" && !Array.isArray(item));
  const row = toRow(value);
  return row ? [row] : [];
}

function getRawValue(row, keys) {
  if (!row) return undefined;
  const normalized = new Map();
  Object.entries(row).forEach(([key, value]) => normalized.set(normalizeKey(key), value));
  for (const key of keys) {
    const value = normalized.get(normalizeKey(key));
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function getString(row, keys, fallback = "") {
  const value = getRawValue(row, keys);
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function parseFlexibleNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;

  let text = String(value).trim();
  if (!text) return fallback;

  text = text
    .replace(/rp/gi, "")
    .replace(/idr/gi, "")
    .replace(/%/g, "")
    .replace(/\s/g, "")
    .replace(/[^0-9,.-]/g, "");

  if (!text || text === "-" || text === "." || text === ",") return fallback;

  const commaCount = (text.match(/,/g) || []).length;
  const dotCount = (text.match(/\./g) || []).length;
  const lastComma = text.lastIndexOf(",");
  const lastDot = text.lastIndexOf(".");

  if (commaCount > 0 && dotCount > 0) {
    text = lastComma > lastDot ? text.replace(/\./g, "").replace(/,/g, ".") : text.replace(/,/g, "");
  } else if (commaCount > 0) {
    const digitsAfterLastComma = text.length - lastComma - 1;
    text = commaCount > 1 || digitsAfterLastComma === 3 ? text.replace(/,/g, "") : text.replace(/,/g, ".");
  } else if (dotCount > 0) {
    const digitsAfterLastDot = text.length - lastDot - 1;
    if (dotCount > 1 || digitsAfterLastDot === 3) text = text.replace(/\./g, "");
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
}

function getNumber(row, keys, fallback = 0) {
  return parseFlexibleNumber(getRawValue(row, keys), fallback);
}

function hasValue(row, keys) {
  return getRawValue(row, keys) !== undefined;
}

function isFilled(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function getTanggalHariIniJakarta() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return year && month && day ? `${year}-${month}-${day}` : new Date().toISOString().slice(0, 10);
}

function normalizeDateToIso(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);

  const text = String(value).trim();
  if (!text) return "";

  const isoMatch = text.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];

  const slashMatch = text.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? text : date.toISOString().slice(0, 10);
}

function formatTanggalIndonesia(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (!text) return "";

  if (!/^\d{4}-\d{2}-\d{2}/.test(text) && Number.isNaN(new Date(text).getTime())) return text;

  const iso = normalizeDateToIso(text);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00+07:00`) : new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function normalizeJamIndonesia(value) {
  let text = String(value || "").trim();
  if (!text) return "";
  text = text.replace(/\bpukul\b/gi, "").replace(/\bWIB\b/gi, "").replace(/\s+/g, " ").trim();
  return text.replace(/(\d{1,2})[.:](\d{2})/g, "$1:$2");
}

function formatWaktuKajian(tanggalLabel, rentangWaktu, waktuLengkap) {
  if (waktuLengkap) {
    let text = String(waktuLengkap).replace(/(\d{1,2})[.:](\d{2})/g, "$1:$2").replace(/\s+/g, " ").trim();
    if (/\d{1,2}:\d{2}/.test(text) && !/\bPukul\b/i.test(text)) {
      text = text.replace(/(,?\s*)(\d{1,2}:\d{2})/, " Pukul $2").replace(/\s+/g, " ").trim();
    }
    if (/\d{1,2}:\d{2}/.test(text) && !/\bWIB\b/i.test(text)) text = `${text} WIB`;
    return text;
  }

  const jamLabel = normalizeJamIndonesia(rentangWaktu);
  if (tanggalLabel && jamLabel) return `${tanggalLabel} Pukul ${jamLabel} WIB`;
  if (tanggalLabel) return tanggalLabel;
  if (jamLabel) return `Pukul ${jamLabel} WIB`;
  return "";
}

function formatRupiah(amount) {
  const number = parseFlexibleNumber(amount, 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(number)
    .replace(/^Rp\s?/, "Rp ");
}

function labelToSummaryKey(label) {
  const key = normalizeKey(String(label || ""));
  if (!key) return "";
  if (key.includes("tanggal_update_aktif")) return "tanggal_update_aktif";
  if (key.includes("label_periode")) return "label_periode";
  if (key.includes("nama_masjid")) return "nama_masjid";
  if (key.includes("saldo_awal")) return "saldo_awal";
  if (key.includes("total_pemasukan") || key === "pemasukan" || key.includes("kas_masuk")) return "total_pemasukan";
  if (key.includes("total_pengeluaran") || key === "pengeluaran" || key.includes("kas_keluar")) return "total_pengeluaran";
  if (key.includes("saldo_akhir")) return "saldo_akhir";
  if (key.includes("donasi_palestina_terkumpul") || key.includes("telah_terkumpul") || key.includes("total_terkumpul") || key.includes("jumlah_terkumpul")) return "donasi_palestina_terkumpul";
  if (key.includes("target_donasi_palestina") || key.includes("target_donasi") || key.includes("target_pengumpulan") || key === "target") return "target_donasi_palestina";
  if (key.includes("progress_donasi")) return "progress_donasi";
  if (key.includes("jumlah_kajian_aktif")) return "jumlah_kajian_aktif";
  if (key.includes("sumber_jadwal_shalat")) return "sumber_jadwal_shalat";
  return key;
}

function keyValueRowsToObject(rows) {
  const result = {};
  rows.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      const summaryKey = labelToSummaryKey(key);
      if (summaryKey && isFilled(value) && !["0", "1", "2", "3", "4", "5"].includes(summaryKey)) result[summaryKey] = value;
    });

    const directLabel = getRawValue(row, ["label", "indikator", "komponen", "uraian", "keterangan", "nama"]);
    const directValue = getRawValue(row, ["value", "nilai", "nominal", "jumlah", "total"]);
    if (isFilled(directLabel) && isFilled(directValue)) {
      result[labelToSummaryKey(directLabel)] = directValue;
      return;
    }

    const values = Object.values(row).filter(isFilled);
    if (values.length >= 2) {
      const summaryKey = labelToSummaryKey(values[0]);
      if (summaryKey) result[summaryKey] = values[1];
    }
  });
  return Object.keys(result).length ? result : null;
}

const KAS_KEYS = [
  "saldo_awal", "saldo awal", "pemasukan", "total_pemasukan", "jumlah_pemasukan",
  "penerimaan", "total_penerimaan", "kas_masuk", "total_infaq", "total_infak",
  "pengeluaran", "total_pengeluaran", "jumlah_pengeluaran", "kas_keluar", "saldo_akhir", "saldo akhir",
];

const DONATION_KEYS = [
  "target", "target_donasi", "target donasi", "target_donasi_palestina", "target_pengumpulan",
  "terkumpul", "telah_terkumpul", "telah terkumpul", "total_terkumpul", "jumlah_terkumpul",
  "donasi_palestina_terkumpul", "realisasi_donasi",
];

function rowHasKasValue(row) {
  return Boolean(row && KAS_KEYS.some((key) => hasValue(row, [key])));
}

function rowHasDonationValue(row) {
  return Boolean(row && DONATION_KEYS.some((key) => hasValue(row, [key])));
}

function firstRowByPredicate(predicate, ...values) {
  for (const value of values) {
    const row = toRow(value);
    if (row && predicate(row)) return row;
  }
  return null;
}

function isFinancialKey(key) {
  const normalized = normalizeKey(key);
  return KAS_KEYS.concat(DONATION_KEYS).some((item) => normalizeKey(item) === normalized) ||
    normalized.includes("saldo") || normalized.includes("pemasukan") || normalized.includes("pengeluaran") ||
    normalized.includes("target") || normalized.includes("terkumpul") || normalized.includes("donasi");
}

function mergeRowsPreferNonZero(...values) {
  const merged = {};

  values.forEach((value) => {
    const row = toRow(value);
    if (!row) return;

    Object.entries(row).forEach(([key, value]) => {
      if (!isFilled(value)) return;

      const current = merged[key];
      if (!isFilled(current)) {
        merged[key] = value;
        return;
      }

      if (isFinancialKey(key)) {
        const currentNumber = parseFlexibleNumber(current, Number.NaN);
        const incomingNumber = parseFlexibleNumber(value, Number.NaN);
        if ((!Number.isFinite(currentNumber) || currentNumber === 0) && Number.isFinite(incomingNumber) && incomingNumber !== 0) {
          merged[key] = value;
        }
      }
    });
  });

  return Object.keys(merged).length ? merged : null;
}

function getNestedRows(result, keys) {
  for (const key of keys) {
    const directRows = toRows(result?.[key]);
    if (directRows.length) return directRows;
    const nestedRows = toRows(result?.data?.[key]);
    if (nestedRows.length) return nestedRows;
  }
  return [];
}

function rowIsActiveForTanggal(row, tanggalUpdate) {
  // Slide kajian ditampilkan berdasarkan status dari endpoint.
  // Jangan memblokir slide hanya karena tanggal_update berbeda dengan tanggal hari ini,
  // karena endpoint bisa mengirim jadwal aktif untuk periode update terakhir.
  const status = getString(row, ["status", "aktif", "active"], "aktif").toLowerCase().trim();
  return !["nonaktif", "tidak aktif", "inactive", "false", "0", "batal", "cancelled", "cancel"].includes(status);
}

function mapKajianSlides(rows, tanggalUpdate) {
  const filteredRows = rows.filter((row) => rowIsActiveForTanggal(row, tanggalUpdate));
  if (!filteredRows.length) return [];

  return filteredRows.map((row, index) => {
    const tanggal = getRawValue(row, ["tanggal_kajian", "tanggal kajian", "tanggal", "hari_tanggal", "hari tanggal", "tanggal_update"]);
    const jamMulai = getString(row, ["waktu", "waktu_kajian", "jam", "pukul", "jam_mulai", "mulai"], "");
    const jamSelesai = getString(row, ["jam_selesai", "selesai"], "");
    const rentangWaktu = jamMulai && jamSelesai ? `${jamMulai} - ${jamSelesai}` : jamMulai;
    const waktuLengkap = getString(row, ["waktu_lengkap", "jadwal", "jadwal_kajian", "hari_tanggal_waktu", "hari tanggal waktu"], "");
    const tanggalLabel = formatTanggalIndonesia(tanggal);
    const waktu = formatWaktuKajian(tanggalLabel, rentangWaktu, waktuLengkap);

    const judul = getString(row, ["judul", "judul_kajian", "nama_kegiatan", "nama_kajian", "kegiatan", "program"], "Kajian Ba'da Dzuhur");

    return {
      id: `kajian-api-${index + 1}`,
      type: "kajian",
      duration: getNumber(row, ["duration", "durasi", "durasi_ms"], 15000),
      active: true,
      judul,
      tema: getString(row, ["tema", "tema_kajian", "topik", "topik_kajian", "materi", "materi_kajian", "bahasan", "kitab"], judul),
      pemateri: getString(row, ["pemateri", "ustadz", "ustad", "narasumber", "penceramah", "pembicara", "imam"], "-"),
      waktu,
      lokasi: getString(row, ["lokasi", "tempat", "tempat_kajian", "ruang", "ruangan", "alamat"], "Ruang Utama Masjid Al Amanah"),
    };
  });
}

function fallbackByType(type) {
  return FALLBACK_SLIDES.find((slide) => slide.type === type);
}

function mapKasSlide(row, tanggalUpdate) {
  const fallbackKas = fallbackByType("kas");
  if (!row) return { ...fallbackKas, periode: formatTanggalIndonesia(tanggalUpdate), saldoAwal: 0, pemasukan: 0, pengeluaran: 0, saldoAkhir: 0, keterangan: "Data kas belum tersedia." };

  const saldoAwal = getNumber(row, ["saldo_awal", "saldoAwal", "saldo awal", "saldo_awal_text", "saldo_awal_rp"], fallbackKas?.saldoAwal || 0);
  const pengeluaran = getNumber(row, ["pengeluaran", "total_pengeluaran", "total pengeluaran", "total_pengeluaran_text", "jumlah_pengeluaran", "jumlah pengeluaran", "kas_keluar", "kas keluar"], fallbackKas?.pengeluaran || 0);
  const saldoAkhirRaw = getNumber(row, ["saldo_akhir", "saldoAkhir", "saldo akhir", "saldo_akhir_text", "saldo_akhir_rp"], Number.NaN);
  const pemasukanKeys = [
    "pemasukan", "pemasukan_jumat", "pemasukan jumat", "total_pemasukan", "total pemasukan", "total_pemasukan_text",
    "jumlah_pemasukan", "jumlah pemasukan", "penerimaan", "total_penerimaan", "total penerimaan",
    "kas_masuk", "kas masuk", "total_infaq", "total infaq", "total_infak", "total infak", "infaq", "infak", "kotak_jumat", "kotak jumat", "kotak_infaq", "kotak infaq",
  ];
  let pemasukan = getNumber(row, pemasukanKeys, Number.NaN);
  const hitungPemasukanDariSaldoAkhir = Number.isFinite(saldoAkhirRaw) ? saldoAkhirRaw - saldoAwal + pengeluaran : Number.NaN;

  if ((!hasValue(row, pemasukanKeys) || !Number.isFinite(pemasukan) || pemasukan === 0) && Number.isFinite(hitungPemasukanDariSaldoAkhir) && hitungPemasukanDariSaldoAkhir > 0) {
    pemasukan = hitungPemasukanDariSaldoAkhir;
  }
  if (!Number.isFinite(pemasukan)) pemasukan = fallbackKas?.pemasukan || 0;
  const saldoAkhir = Number.isFinite(saldoAkhirRaw) ? saldoAkhirRaw : saldoAwal + pemasukan - pengeluaran;

  return {
    id: "kas-api",
    type: "kas",
    duration: getNumber(row, ["duration", "durasi", "durasi_ms"], fallbackKas?.duration || 15000),
    active: true,
    periode: getString(row, ["periode", "label_periode", "tanggal_update", "tanggal", "bulan"], formatTanggalIndonesia(tanggalUpdate)),
    saldoAwal,
    pemasukan,
    pengeluaran,
    saldoAkhir,
    keterangan: getString(row, ["keterangan", "catatan", "deskripsi"], fallbackKas?.keterangan || "Penggunaan dana untuk operasional masjid, kebersihan, dan kegiatan lainnya."),
  };
}

function mapDonationSlide(row, tanggalUpdate) {
  const fallbackDonation = fallbackByType("donation");
  if (!row) return { ...fallbackDonation, periode: formatTanggalIndonesia(tanggalUpdate), target: 0, terkumpul: 0, keterangan: "Data donasi belum tersedia." };

  return {
    id: "donation-api",
    type: "donation",
    duration: getNumber(row, ["duration", "durasi", "durasi_ms"], fallbackDonation?.duration || 15000),
    active: true,
    program: getString(row, ["program", "program_donasi", "judul", "judul_donasi", "nama_program", "nama_program_donasi"], fallbackDonation?.program || "Donasi Kemanusiaan Palestina"),
    target: getNumber(row, ["target", "target_donasi", "target donasi", "target_donasi_palestina", "target donasi palestina", "target_pengumpulan", "target pengumpulan", "target_palestina"], fallbackDonation?.target || 0),
    terkumpul: getNumber(row, ["terkumpul", "telah_terkumpul", "telah terkumpul", "total_terkumpul", "jumlah_terkumpul", "donasi_palestina_terkumpul", "donasi palestina terkumpul", "realisasi", "realisasi_donasi"], fallbackDonation?.terkumpul || 0),
    periode: getString(row, ["periode", "label_periode", "tanggal_update", "tanggal", "bulan"], formatTanggalIndonesia(tanggalUpdate)),
    keterangan: getString(row, ["keterangan", "catatan", "deskripsi", "keterangan_donasi", "catatan_donasi"], fallbackDonation?.keterangan || "Donasi akan disalurkan melalui lembaga resmi sesuai ketetapan pengurus masjid."),
  };
}

function buildDashboardUrl(tanggalUpdate, includeTanggalUpdate = true) {
  const url = new URL(DASHBOARD_API_URL);
  if (includeTanggalUpdate) {
    url.searchParams.set("tanggal_update", tanggalUpdate || getTanggalHariIniJakarta());
  }
  url.searchParams.set("_t", String(Date.now()));
  return url.toString();
}

async function fetchDashboardApi(tanggalUpdate, includeTanggalUpdate = true) {
  const response = await fetch(buildDashboardUrl(tanggalUpdate, includeTanggalUpdate), { method: "GET", cache: "no-store" });
  if (!response.ok) throw new Error(`Gagal menghubungi Apps Script. Status: ${response.status}`);
  const result = await response.json();
  if (result?.success === false) throw new Error(result.message || "Apps Script mengembalikan status gagal.");
  return result;
}

function hasObjectOrRows(value) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
}

function hasEndpointContent(result) {
  return Boolean(
    hasObjectOrRows(result?.kajian) ||
    hasObjectOrRows(result?.data?.kajian) ||
    hasObjectOrRows(result?.jadwal_kajian) ||
    hasObjectOrRows(result?.data?.jadwal_kajian) ||
    hasObjectOrRows(result?.ringkasan) ||
    hasObjectOrRows(result?.data?.ringkasan)
  );
}

async function loadDashboardSlides() {
  try {
    const tanggalUpdate = getTanggalHariIniJakarta();
    const kajianKeys = ["kajian", "kajian_jumat", "kajianJumat", "jadwal_kajian", "jadwalKajian"];
    let result = await fetchDashboardApi(tanggalUpdate, true);
    let alreadyFetchedWithoutTanggal = false;
    if (!hasEndpointContent(result)) {
      result = await fetchDashboardApi(null, false);
      alreadyFetchedWithoutTanggal = true;
    }

    // Jika endpoint dengan parameter tanggal_update tidak mengembalikan kajian aktif,
    // coba endpoint dasar. Ini membuat slide kajian tetap muncul selama status = "aktif"
    // pada data yang dikirim Apps Script.
    const currentTanggalAktif = () => result.tanggal_update || normalizeDateToIso(getString(result.pengaturan, ["tanggal_update_aktif", "tanggal update aktif"], tanggalUpdate));
    const currentKajianRows = () => getNestedRows(result, kajianKeys);
    if (!alreadyFetchedWithoutTanggal && !mapKajianSlides(currentKajianRows(), currentTanggalAktif()).length) {
      try {
        const resultWithoutTanggal = await fetchDashboardApi(null, false);
        const fallbackTanggalAktif = resultWithoutTanggal.tanggal_update || normalizeDateToIso(getString(resultWithoutTanggal.pengaturan, ["tanggal_update_aktif", "tanggal update aktif"], tanggalUpdate));
        if (mapKajianSlides(getNestedRows(resultWithoutTanggal, kajianKeys), fallbackTanggalAktif).length) {
          result = resultWithoutTanggal;
        }
      } catch (fallbackError) {
        console.warn("Endpoint tanpa tanggal_update belum dapat digunakan untuk kajian:", fallbackError);
      }
    }

    const tanggalAktif = result.tanggal_update || normalizeDateToIso(getString(result.pengaturan, ["tanggal_update_aktif", "tanggal update aktif"], tanggalUpdate));
    const labelPeriode = getString(result.pengaturan, ["label_periode", "label periode"], formatTanggalIndonesia(tanggalAktif));

    const kajianRows = getNestedRows(result, kajianKeys);
    const ringkasanRows = getNestedRows(result, ["ringkasan", "summary", "rekap"]);
    const ringkasanKeyValueRow = keyValueRowsToObject(ringkasanRows);
    const ringkasanGabungan = {
      ...(toRow(result.ringkasan) || {}),
      ...(toRow(result.data?.ringkasan) || {}),
      ...(ringkasanKeyValueRow || {}),
      label_periode: labelPeriode,
      tanggal_update: tanggalAktif,
    };

    // Object khusus dari Apps Script tetap dipakai untuk keterangan/catatan.
    // Namun angka 0/kosong akan ditambal dari ringkasan agar saldo tidak tampil Rp 0
    // ketika kolom formula spreadsheet belum selesai terbaca.
    const kasCandidates = [
      result.kas_jumat,
      result.kasJumat,
      result.data?.kas_jumat,
      result.data?.kasJumat,
      ringkasanGabungan,
      ringkasanKeyValueRow,
      result.ringkasan,
      result.data?.ringkasan,
    ].map(toRow).filter((row) => row && rowHasKasValue(row));

    const kasRow = mergeRowsPreferNonZero(...kasCandidates);

    const donationCandidates = [
      result.donasi_palestina,
      result.donasiPalestina,
      result.data?.donasi_palestina,
      result.data?.donasiPalestina,
      ringkasanGabungan,
      ringkasanKeyValueRow,
      result.ringkasan,
      result.data?.ringkasan,
    ].map(toRow).filter((row) => row && rowHasDonationValue(row));

    const donationRow = mergeRowsPreferNonZero(...donationCandidates);

    const reminderSlides = FALLBACK_SLIDES.filter((slide) => slide.type === "reminder");
    const slides = [
      ...mapKajianSlides(kajianRows, tanggalAktif),
      mapKasSlide(kasRow, tanggalAktif),
      mapDonationSlide(donationRow, tanggalAktif),
      ...reminderSlides,
    ].filter((slide) => slide.active);

    if (slides.length) {
      activeSlides = slides;
      if (currentSlideIndex >= activeSlides.length) currentSlideIndex = 0;
      renderCurrentSlide();
      scheduleNextSlide();
    }
  } catch (error) {
    console.error("Gagal mengambil data dashboard dari Google Sheets:", error);
    activeSlides = FALLBACK_SLIDES.filter((slide) => slide.active && slide.type !== "kajian");
    if (currentSlideIndex >= activeSlides.length) currentSlideIndex = 0;
    renderCurrentSlide();
    scheduleNextSlide();
  }
}

function renderCurrentSlide() {
  const slide = activeSlides[currentSlideIndex];
  if (!slide) return;

  if (slide.type === "kajian") renderKajianSlide(slide);
  else if (slide.type === "kas") renderCashSlide(slide);
  else if (slide.type === "donation") renderDonationSlide(slide);
  else if (slide.type === "reminder") renderReminderSlide(slide);
  else els.slideContent.innerHTML = `<div class="slide-inner"><h2 class="slide-title">Slide belum tersedia</h2></div>`;
}

function scheduleNextSlide() {
  clearTimeout(slideFadeTimer);
  clearTimeout(slideSwitchTimer);

  const currentSlide = activeSlides[currentSlideIndex] || { duration: 15000 };
  const duration = Math.max(Number(currentSlide.duration) || 15000, 3000);

  slideFadeTimer = setTimeout(() => els.slideCard.classList.add("is-fading"), Math.max(duration - 1000, 1000));
  slideSwitchTimer = setTimeout(() => {
    currentSlideIndex = (currentSlideIndex + 1) % activeSlides.length;
    renderCurrentSlide();
    requestAnimationFrame(() => els.slideCard.classList.remove("is-fading"));
    scheduleNextSlide();
  }, duration);
}

function renderKajianSlide(data) {
  els.slideContent.innerHTML = `
    <section class="slide-inner kajian-slide">
      <h2 class="slide-title">${escapeHtml(data.judul)}</h2>
      <div class="panel">
        <p class="muted-label">Tema Kajian</p>
        <div class="kajian-theme">&quot;${escapeHtml(data.tema)}&quot;</div>
        <div class="kajian-grid">
          <div class="info-box">
            <div class="icon-circle">${iconSvg("user")}</div>
            <p class="info-label">Pemateri</p>
            <p class="info-value">${escapeHtml(data.pemateri)}</p>
          </div>
          <div class="info-box gold">
            <div class="icon-circle gold">${iconSvg("clock")}</div>
            <p class="info-label">Waktu</p>
            <p class="info-value">${escapeHtml(data.waktu)}</p>
          </div>
          <div class="info-box">
            <div class="icon-circle">${iconSvg("map")}</div>
            <p class="info-label">Lokasi</p>
            <p class="info-value">${escapeHtml(data.lokasi)}</p>
          </div>
        </div>
      </div>
    </section>`;
}

function renderCashSlide(data) {
  els.slideContent.innerHTML = `
    <section class="slide-inner cash-slide">
      <h2 class="slide-title cash-title">${iconSvg("landmark")} Laporan Kas Masjid</h2>
      <p class="slide-subtitle">Periode: ${escapeHtml(data.periode)}</p>
      <div class="cash-grid">
        <div class="metric-box">
          <p class="metric-label">Saldo Awal</p>
          <p class="metric-value">${formatRupiah(data.saldoAwal)}</p>
        </div>
        <div class="metric-box">
          <p class="metric-label">Saldo Akhir</p>
          <p class="metric-value blue">${formatRupiah(data.saldoAkhir)}</p>
        </div>
      </div>
      <div class="cash-grid">
        <div class="metric-box green">
          <div class="icon-circle green-icon">${iconSvg("up")}</div>
          <p class="metric-label green">Pemasukan</p>
          <p class="metric-value green">${formatRupiah(data.pemasukan)}</p>
        </div>
        <div class="metric-box red">
          <div class="icon-circle red-icon">${iconSvg("down")}</div>
          <p class="metric-label red">Pengeluaran</p>
          <p class="metric-value red">${formatRupiah(data.pengeluaran)}</p>
        </div>
      </div>
      <div class="note">&quot;${escapeHtml(data.keterangan)}&quot;</div>
    </section>`;
}

function renderDonationSlide(data) {
  const progressPercentage = data.target > 0 ? Math.max(0, Math.min(Math.round((data.terkumpul / data.target) * 100), 100)) : 0;
  els.slideContent.innerHTML = `
    <section class="slide-inner donation-slide">
      <h2 class="slide-title">${escapeHtml(data.program)}</h2>
      <p class="slide-subtitle">Periode: ${escapeHtml(data.periode)}</p>
      <div class="panel donation-panel">
        <div class="donation-grid">
          <div class="metric-box">
            <p class="metric-label">Target Donasi</p>
            <p class="metric-value">${formatRupiah(data.target)}</p>
          </div>
          <div class="metric-box">
            <p class="metric-label" style="color:#a9c2ff">Telah Terkumpul</p>
            <p class="metric-value blue">${formatRupiah(data.terkumpul)}</p>
          </div>
        </div>
        <div class="progress-head"><span>Progress</span><span class="progress-value">${progressPercentage}%</span></div>
        <div class="progress-track"><div class="progress-bar" style="width:${progressPercentage}%"></div></div>
      </div>
      <div class="note">&quot;${escapeHtml(data.keterangan)}&quot;</div>
    </section>`;
}

function renderReminderSlide(data) {
  const linesHtml = data.baris.map((line) => {
    const segments = line.map((seg) => seg.bold ? `<span class="reminder-bold">${escapeHtml(seg.text)}</span>` : `<span>${escapeHtml(seg.text)}</span>`).join("");
    return `<div>${segments}</div>`;
  }).join("");

  els.slideContent.innerHTML = `
    <section class="slide-inner reminder-slide">
      <div class="reminder-box">
        <img class="reminder-img" src="${escapeHtml(data.imagePath)}" alt="Ikon Himbauan" />
        <div class="reminder-lines">${linesHtml}</div>
      </div>
    </section>`;
}

function updateClock() {
  const now = new Date();
  els.clock.textContent = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Jakarta",
  }).format(now).replace(/\./g, ":");

  els.gregorianDate.textContent = new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
  }).format(now);

  els.hijriDate.textContent = getHijriDateText(now);
  checkIqomahReminder(now);
}

function getHijriDateText(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
      day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
    }).formatToParts(date);
    const day = parts.find((p) => p.type === "day")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    if (day && month && year) return `${day} ${month} ${year.replace(/\D/g, "")} H`;
  } catch (_) {
    // Fallback sederhana jika browser tidak mendukung kalender Islam via Intl.
  }
  return "- H";
}

async function fetchPrayerTimes() {
  try {
    const [year, month, day] = getTanggalHariIniJakarta().split("-");
    const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${MYQURAN_CITY_ID}/${year}/${month}/${day}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const j = result?.data?.jadwal;
    if (result.status && j) {
      prayerTimes = [
        { name: "Imsak", time: j.imsak },
        { name: "Subuh", time: j.subuh },
        { name: "Syuruq", time: j.terbit },
        { name: "Dzuhur", time: j.dzuhur },
        { name: "Ashar", time: j.ashar },
        { name: "Maghrib", time: j.maghrib },
        { name: "Isya", time: j.isya },
      ];
    }
  } catch (error) {
    console.error("Gagal mengambil jadwal shalat:", error);
    prayerTimes = FALLBACK_PRAYER_TIMES;
  }
  renderPrayerTimes();
}

function renderPrayerTimes() {
  const now = new Date();
  const currentMinutes = getJakartaMinutes(now);
  const prayerWithMinutes = prayerTimes.map((prayer) => ({ ...prayer, minutes: timeToMinutes(prayer.time) }));
  let nextIndex = prayerWithMinutes.findIndex((prayer) => prayer.minutes > currentMinutes);
  if (nextIndex === -1) nextIndex = 1; // Setelah Isya, highlight Subuh.

  els.prayerTimes.innerHTML = prayerTimes.map((prayer, index) => `
    <div class="prayer-item ${index === nextIndex ? "next" : ""}">
      <div class="prayer-name">${escapeHtml(prayer.name)}</div>
      <div class="prayer-time">${escapeHtml(prayer.time)}</div>
    </div>
  `).join("");
}

function timeToMinutes(time) {
  const [hour, minute] = String(time || "00:00").split(":").map((value) => Number(value) || 0);
  return hour * 60 + minute;
}

function getJakartaMinutes(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta",
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  return hour * 60 + minute;
}

function checkIqomahReminder(now) {
  const currentMinutes = getJakartaMinutes(now);
  const currentSeconds = Number(new Intl.DateTimeFormat("en-GB", { second: "2-digit", timeZone: "Asia/Jakarta" }).format(now)) || 0;
  const nowTotalSeconds = currentMinutes * 60 + currentSeconds;

  const activePrayer = prayerTimes.find((prayer) => {
    if (!["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].includes(prayer.name)) return false;
    const prayerSeconds = timeToMinutes(prayer.time) * 60;
    return nowTotalSeconds >= prayerSeconds - 60 && nowTotalSeconds < prayerSeconds;
  });

  if (activePrayer) {
    els.iqomahReminder.textContent = `IQOMAH ${activePrayer.name} 1 MENIT LAGI`;
    els.iqomahReminder.classList.remove("hidden");
  } else {
    els.iqomahReminder.classList.add("hidden");
  }
}

function createAtmosphere() {
  if (!els.snowLayer || els.snowLayer.childElementCount) return;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reducedMotion) return;

  const fragment = document.createDocumentFragment();
  const total = 42;
  for (let index = 0; index < total; index += 1) {
    const flake = document.createElement("span");
    flake.className = "snow-flake";
    const size = 2 + Math.random() * 4;
    const left = Math.random() * 100;
    const duration = 18 + Math.random() * 18;
    const delay = -Math.random() * duration;
    const drift = -70 + Math.random() * 140;
    flake.style.left = `${left}%`;
    flake.style.setProperty("--size", `${size}px`);
    flake.style.setProperty("--duration", `${duration}s`);
    flake.style.setProperty("--delay", `${delay}s`);
    flake.style.setProperty("--drift", `${drift}px`);
    fragment.appendChild(flake);
  }
  els.snowLayer.appendChild(fragment);
}

function init() {
  createAtmosphere();
  renderPrayerTimes();
  renderCurrentSlide();
  scheduleNextSlide();
  updateClock();
  fetchPrayerTimes();
  loadDashboardSlides();

  setInterval(updateClock, 1000);
  setInterval(renderPrayerTimes, 60 * 1000);
  setInterval(fetchPrayerTimes, PRAYER_REFRESH_INTERVAL_MS);
  setInterval(loadDashboardSlides, DASHBOARD_REFRESH_INTERVAL_MS);
}

document.addEventListener("DOMContentLoaded", init);
