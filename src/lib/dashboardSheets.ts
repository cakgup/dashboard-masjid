import { DASHBOARD_API_URL, DEFAULT_TANGGAL_UPDATE } from "@/config/dashboardApi";
import { AnySlide, DonationData, KajianData, KasData } from "@/types";

type SheetRow = Record<string, unknown>;

interface DashboardApiResponse {
  success: boolean;
  message?: string;
  tanggal_update?: string;
  pengaturan?: SheetRow;
  kajian?: SheetRow[] | SheetRow | null;
  kajian_jumat?: SheetRow[] | SheetRow | null;
  jadwal_kajian?: SheetRow[] | SheetRow | null;
  kajianJumat?: SheetRow[] | SheetRow | null;
  kas_jumat?: SheetRow | null;
  kasJumat?: SheetRow | null;
  donasi_palestina?: SheetRow | null;
  donasiPalestina?: SheetRow | null;
  ringkasan?: SheetRow | null;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

function normalizeKey(key: string) {
  return key.toLowerCase().trim().replace(/[\s-]+/g, "_");
}

function toRow(value: unknown): SheetRow | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as SheetRow;
  }

  return null;
}

function toRows(value: unknown): SheetRow[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is SheetRow => Boolean(item) && typeof item === "object" && !Array.isArray(item));
  }

  const row = toRow(value);
  return row ? [row] : [];
}

function getRawValue(row: SheetRow | null | undefined, keys: string[]) {
  if (!row) return undefined;

  const normalized = new Map<string, unknown>();
  Object.entries(row).forEach(([key, value]) => {
    normalized.set(normalizeKey(key), value);
  });

  for (const key of keys) {
    const value = normalized.get(normalizeKey(key));
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function getString(row: SheetRow | null | undefined, keys: string[], fallback = "") {
  const value = getRawValue(row, keys);
  if (value === undefined) return fallback;
  return String(value).trim() || fallback;
}

function parseFlexibleNumber(value: unknown, fallback = 0) {
  if (value === undefined || value === null || value === "") return fallback;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

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
    if (lastComma > lastDot) {
      // Contoh Indonesia: 1.234,56
      text = text.replace(/\./g, "").replace(/,/g, ".");
    } else {
      // Contoh internasional: 1,234.56
      text = text.replace(/,/g, "");
    }
  } else if (commaCount > 0) {
    const digitsAfterLastComma = text.length - lastComma - 1;

    if (commaCount > 1 || digitsAfterLastComma === 3) {
      // Contoh: 34,382,925 atau 7,497,047
      text = text.replace(/,/g, "");
    } else {
      // Contoh: 67,58
      text = text.replace(/,/g, ".");
    }
  } else if (dotCount > 0) {
    const digitsAfterLastDot = text.length - lastDot - 1;

    if (dotCount > 1 || digitsAfterLastDot === 3) {
      // Contoh: 34.382.925 atau 7.497.047
      text = text.replace(/\./g, "");
    }
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
}

function getNumber(row: SheetRow | null | undefined, keys: string[], fallback = 0) {
  const value = getRawValue(row, keys);
  return parseFlexibleNumber(value, fallback);
}

function hasValue(row: SheetRow | null | undefined, keys: string[]) {
  return getRawValue(row, keys) !== undefined;
}

function normalizeDateToIso(value: unknown) {
  if (!value) return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

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
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }

  return text;
}

function formatTanggalIndonesia(value: unknown) {
  if (!value) return "";

  const text = String(value).trim();
  if (!text) return "";

  // Jika sudah berbentuk kalimat tanggal, tampilkan apa adanya.
  if (!/^\d{4}-\d{2}-\d{2}/.test(text) && Number.isNaN(new Date(text).getTime())) {
    return text;
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildUrl(tanggalUpdate = DEFAULT_TANGGAL_UPDATE) {
  const url = new URL(DASHBOARD_API_URL);

  if (tanggalUpdate) {
    url.searchParams.set("tanggal_update", tanggalUpdate);
  }

  // Mencegah data lama tertahan cache browser/TV display.
  url.searchParams.set("_t", String(Date.now()));

  return url.toString();
}

async function fetchDashboardApi(tanggalUpdate = DEFAULT_TANGGAL_UPDATE): Promise<DashboardApiResponse> {
  const response = await fetch(buildUrl(tanggalUpdate), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Gagal menghubungi Apps Script. Status: ${response.status}`);
  }

  const result = (await response.json()) as DashboardApiResponse;

  if (!result.success) {
    throw new Error(result.message || "Apps Script mengembalikan status gagal.");
  }

  return result;
}

function fallbackSlidesByType<T extends AnySlide["type"]>(fallbackSlides: AnySlide[], type: T) {
  return fallbackSlides.filter((slide) => slide.type === type);
}

function rowIsActiveForTanggal(row: SheetRow, tanggalUpdate: string) {
  const status = getString(row, ["status", "aktif", "active"], "aktif").toLowerCase();
  const statusAktif = !["nonaktif", "tidak aktif", "inactive", "false", "0"].includes(status);

  const tanggalRow = normalizeDateToIso(getRawValue(row, ["tanggal_update", "tanggal update", "periode_update"]));
  const tanggalAktif = normalizeDateToIso(tanggalUpdate);

  // Jika row tidak punya tanggal_update, jangan dibuang. Ini membuat mapping tetap kompatibel
  // dengan sheet yang hanya punya tanggal_kajian/hari_tanggal.
  const tanggalCocok = !tanggalRow || !tanggalAktif || tanggalRow === tanggalAktif;

  return statusAktif && tanggalCocok;
}

function mapKajianSlides(rows: SheetRow[], tanggalUpdate: string): KajianData[] {
  const filteredRows = rows.filter((row) => rowIsActiveForTanggal(row, tanggalUpdate));

  // Jangan tampilkan fallback kajian lama ketika API berhasil tetapi sheet kajian kosong.
  // Ini mencegah slide kajian terlihat seolah-olah belum berubah.
  if (!filteredRows.length) return [];

  return filteredRows.map((row, index) => {
    const tanggal = getRawValue(row, [
      "tanggal_kajian",
      "tanggal kajian",
      "tanggal",
      "hari_tanggal",
      "hari tanggal",
      "tanggal_update",
    ]);

    const jamMulai = getString(row, ["waktu", "waktu_kajian", "jam", "pukul", "jam_mulai", "mulai"], "");
    const jamSelesai = getString(row, ["jam_selesai", "selesai"], "");
    const rentangWaktu = jamMulai && jamSelesai ? `${jamMulai} - ${jamSelesai}` : jamMulai;

    const waktuLengkap = getString(row, [
      "waktu_lengkap",
      "jadwal",
      "jadwal_kajian",
      "hari_tanggal_waktu",
      "hari tanggal waktu",
    ], "");

    const tanggalLabel = formatTanggalIndonesia(tanggal);
    const waktu = waktuLengkap || [tanggalLabel, rentangWaktu].filter(Boolean).join(", ");

    const judul = getString(row, [
      "judul",
      "judul_kajian",
      "nama_kegiatan",
      "nama_kajian",
      "kegiatan",
      "program",
    ], "Kajian Ba'da Dzuhur");

    return {
      id: `kajian-google-sheet-${index + 1}`,
      type: "kajian",
      duration: getNumber(row, ["duration", "durasi", "durasi_ms"], 15000),
      active: true,
      judul,
      tema: getString(row, [
        "tema",
        "tema_kajian",
        "topik",
        "topik_kajian",
        "materi",
        "materi_kajian",
        "bahasan",
        "kitab",
      ], judul),
      pemateri: getString(row, [
        "pemateri",
        "ustadz",
        "ustad",
        "narasumber",
        "penceramah",
        "pembicara",
        "imam",
      ], "-"),
      waktu,
      lokasi: getString(row, [
        "lokasi",
        "tempat",
        "tempat_kajian",
        "ruang",
        "ruangan",
        "alamat",
      ], "Ruang Utama Masjid Al Amanah"),
    };
  });
}

function mapKasSlide(row: SheetRow | null | undefined, tanggalUpdate: string, fallbackSlides: AnySlide[]): KasData {
  const fallbackKas = fallbackSlidesByType(fallbackSlides, "kas")[0] as KasData | undefined;

  if (!row) {
    return fallbackKas ?? {
      id: "kas-fallback",
      type: "kas",
      duration: 15000,
      active: true,
      periode: formatTanggalIndonesia(tanggalUpdate),
      saldoAwal: 0,
      pemasukan: 0,
      pengeluaran: 0,
      saldoAkhir: 0,
      keterangan: "Data kas belum tersedia.",
    };
  }

  const saldoAwal = getNumber(row, [
    "saldo_awal",
    "saldoAwal",
    "saldo awal",
  ], fallbackKas?.saldoAwal ?? 0);

  const pengeluaran = getNumber(row, [
    "pengeluaran",
    "total_pengeluaran",
    "total pengeluaran",
    "jumlah_pengeluaran",
    "jumlah pengeluaran",
    "kas_keluar",
    "kas keluar",
  ], fallbackKas?.pengeluaran ?? 0);

  const saldoAkhirRaw = getNumber(row, [
    "saldo_akhir",
    "saldoAkhir",
    "saldo akhir",
  ], Number.NaN);

  const pemasukanKeys = [
    "pemasukan",
    "pemasukan_jumat",
    "pemasukan jumat",
    "total_pemasukan",
    "total pemasukan",
    "jumlah_pemasukan",
    "jumlah pemasukan",
    "penerimaan",
    "total_penerimaan",
    "total penerimaan",
    "kas_masuk",
    "kas masuk",
    "total_infaq",
    "total infaq",
    "total_infak",
    "total infak",
    "infaq",
    "infak",
    "kotak_jumat",
    "kotak jumat",
    "kotak_infaq",
    "kotak infaq",
  ];

  let pemasukan = getNumber(row, pemasukanKeys, Number.NaN);

  // Jika sheet hanya menyediakan Saldo Akhir dan Pengeluaran, maka pemasukan
  // dikembalikan dengan rumus: Pemasukan = Saldo Akhir + Pengeluaran.
  // Catatan: saldo_awal hanya informasi display, tidak ikut rumus saldo akhir.
  const hitungPemasukanDariSaldoAkhir = Number.isFinite(saldoAkhirRaw)
    ? saldoAkhirRaw + pengeluaran
    : Number.NaN;

  if ((!hasValue(row, pemasukanKeys) || !Number.isFinite(pemasukan) || pemasukan === 0) && Number.isFinite(hitungPemasukanDariSaldoAkhir) && hitungPemasukanDariSaldoAkhir > 0) {
    pemasukan = hitungPemasukanDariSaldoAkhir;
  }

  if (!Number.isFinite(pemasukan)) {
    pemasukan = fallbackKas?.pemasukan ?? 0;
  }

  // Sesuai Excel/ringkasan: Saldo Akhir = Total Pemasukan - Total Pengeluaran.
  // Contoh 2026-05-22: 34.382.925 - 14.831.589 = 19.551.336.
  const saldoAkhir = pemasukan - pengeluaran;

  return {
    id: "kas-google-sheet",
    type: "kas",
    duration: getNumber(row, ["duration", "durasi", "durasi_ms"], fallbackKas?.duration ?? 15000),
    active: true,
    periode: getString(row, ["periode", "tanggal_update", "tanggal", "bulan"], formatTanggalIndonesia(tanggalUpdate)),
    saldoAwal,
    pemasukan,
    pengeluaran,
    saldoAkhir,
    keterangan: getString(
      row,
      ["keterangan", "catatan", "deskripsi"],
      fallbackKas?.keterangan ?? "Penggunaan dana untuk operasional masjid, kebersihan, dan kegiatan lainnya."
    ),
  };
}

function mapDonationSlide(row: SheetRow | null | undefined, tanggalUpdate: string, fallbackSlides: AnySlide[]): DonationData {
  const fallbackDonation = fallbackSlidesByType(fallbackSlides, "donation")[0] as DonationData | undefined;

  if (!row) {
    return fallbackDonation ?? {
      id: "donation-fallback",
      type: "donation",
      duration: 15000,
      active: true,
      program: "Donasi Kemanusiaan Palestina",
      target: 0,
      terkumpul: 0,
      periode: formatTanggalIndonesia(tanggalUpdate),
      keterangan: "Data donasi belum tersedia.",
    };
  }

  return {
    id: "donation-google-sheet",
    type: "donation",
    duration: getNumber(row, ["duration", "durasi", "durasi_ms"], fallbackDonation?.duration ?? 15000),
    active: true,
    program: getString(row, ["program", "judul", "nama_program"], fallbackDonation?.program ?? "Donasi Kemanusiaan Palestina"),
    target: getNumber(row, ["target", "target_donasi", "target_pengumpulan"], fallbackDonation?.target ?? 0),
    terkumpul: getNumber(row, ["terkumpul", "total_terkumpul", "realisasi", "jumlah_terkumpul"], fallbackDonation?.terkumpul ?? 0),
    periode: getString(row, ["periode", "tanggal_update", "tanggal", "bulan"], formatTanggalIndonesia(tanggalUpdate)),
    keterangan: getString(
      row,
      ["keterangan", "catatan", "deskripsi"],
      fallbackDonation?.keterangan ?? "Donasi akan disalurkan melalui lembaga resmi sesuai ketetapan pengurus masjid."
    ),
  };
}


function isFilled(value: unknown) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function labelToSummaryKey(label: unknown) {
  const key = normalizeKey(String(label || ""));

  if (!key) return "";
  if (key.includes("tanggal_update_aktif")) return "tanggal_update_aktif";
  if (key.includes("label_periode")) return "label_periode";
  if (key.includes("nama_masjid")) return "nama_masjid";
  if (key.includes("saldo_awal")) return "saldo_awal";
  if (key.includes("total_pemasukan") || key === "pemasukan" || key.includes("kas_masuk")) return "total_pemasukan";
  if (key.includes("total_pengeluaran") || key === "pengeluaran" || key.includes("kas_keluar")) return "total_pengeluaran";
  if (key.includes("saldo_akhir")) return "saldo_akhir";
  if (key.includes("donasi_palestina_terkumpul")) return "donasi_palestina_terkumpul";
  if (key.includes("target_donasi_palestina")) return "target_donasi_palestina";
  if (key.includes("progress_donasi")) return "progress_donasi";
  if (key.includes("jumlah_kajian_aktif")) return "jumlah_kajian_aktif";
  if (key.includes("sumber_jadwal_shalat")) return "sumber_jadwal_shalat";

  return key;
}

function keyValueRowsToObject(rows: SheetRow[]) {
  const result: SheetRow = {};

  rows.forEach((row) => {
    // Jika baris sudah berupa object normal, tetap salin key yang relevan.
    Object.entries(row).forEach(([key, value]) => {
      const summaryKey = labelToSummaryKey(key);
      if (summaryKey && isFilled(value) && !["0", "1", "2", "3", "4", "5"].includes(summaryKey)) {
        result[summaryKey] = value;
      }
    });

    // Mendukung sheet ringkasan berbentuk dua kolom: Label | Nilai.
    const directLabel = getRawValue(row, ["label", "indikator", "komponen", "uraian", "keterangan", "nama"]);
    const directValue = getRawValue(row, ["value", "nilai", "nominal", "jumlah", "total"]);

    if (isFilled(directLabel) && isFilled(directValue)) {
      result[labelToSummaryKey(directLabel)] = directValue;
      return;
    }

    const values = Object.values(row).filter(isFilled);
    if (values.length >= 2) {
      const summaryKey = labelToSummaryKey(values[0]);
      if (summaryKey) {
        result[summaryKey] = values[1];
      }
    }
  });

  return Object.keys(result).length ? result : null;
}

const KAS_KEYS = [
  "saldo_awal",
  "saldo awal",
  "pemasukan",
  "total_pemasukan",
  "jumlah_pemasukan",
  "penerimaan",
  "total_penerimaan",
  "kas_masuk",
  "total_infaq",
  "total_infak",
  "pengeluaran",
  "total_pengeluaran",
  "jumlah_pengeluaran",
  "kas_keluar",
  "saldo_akhir",
  "saldo akhir",
];

function rowHasKasValue(row: SheetRow | null | undefined) {
  return Boolean(row && KAS_KEYS.some((key) => hasValue(row, [key])));
}

function firstKasRow(...values: unknown[]) {
  for (const value of values) {
    const row = toRow(value);
    if (row && rowHasKasValue(row)) return row;
  }

  return null;
}

function firstRow(...values: unknown[]) {
  for (const value of values) {
    const row = toRow(value);
    if (row) return row;
  }

  return null;
}

function getNestedRows(result: DashboardApiResponse, keys: string[]) {
  for (const key of keys) {
    const directRows = toRows(result[key]);
    if (directRows.length) return directRows;

    const nestedRows = toRows(result.data?.[key]);
    if (nestedRows.length) return nestedRows;
  }

  return [];
}

export async function getDashboardSlides(fallbackSlides: AnySlide[], tanggalUpdate = DEFAULT_TANGGAL_UPDATE) {
  const result = await fetchDashboardApi(tanggalUpdate);
  const tanggalAktif =
    result.tanggal_update ||
    getString(result.pengaturan, ["tanggal_update_aktif", "tanggal update aktif"], tanggalUpdate);

  const kajianRows = getNestedRows(result, [
    "kajian",
    "kajian_jumat",
    "kajianJumat",
    "jadwal_kajian",
    "jadwalKajian",
  ]);

  const ringkasanRows = getNestedRows(result, [
    "ringkasan",
    "summary",
    "rekap",
  ]);

  const ringkasanKeyValueRow = keyValueRowsToObject(ringkasanRows);

  // Untuk laporan kas, dahulukan sheet ringkasan agar angka di dashboard sama
  // dengan ringkasan Excel: Total Pemasukan, Total Pengeluaran, dan Saldo Akhir.
  const kasRow = firstKasRow(
    ringkasanKeyValueRow,
    result.ringkasan,
    result.data?.ringkasan,
    result.kas_jumat,
    result.kasJumat,
    result.data?.kas_jumat,
    result.data?.kasJumat
  );

  const donasiRow = firstRow(
    result.donasi_palestina,
    result.donasiPalestina,
    result.data?.donasi_palestina,
    result.data?.donasiPalestina
  );

  const kajianSlides = mapKajianSlides(kajianRows, tanggalAktif);
  const kasSlide = mapKasSlide(kasRow, tanggalAktif, fallbackSlides);
  const donationSlide = mapDonationSlide(donasiRow, tanggalAktif, fallbackSlides);

  // Himbauan/konten slide tetap dari project, bukan dari Apps Script.
  const reminderSlides = fallbackSlidesByType(fallbackSlides, "reminder");

  return [
    ...kajianSlides,
    kasSlide,
    donationSlide,
    ...reminderSlides,
  ].filter((slide) => slide.active);
}
