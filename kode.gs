const SPREADSHEET_ID = '1gAI1OVx3mbDXqt_zN8QA2g8Vj6UlLxtxyiezylcR4AU';
const TZ = 'Asia/Jakarta';

const SHEET = {
  PENGATURAN: 'pengaturan',
  RINGKASAN: 'ringkasan',
  KAJIAN: 'kajian',
  KAS_JUMAT: 'kas_jumat',
  DONASI_PALESTINA: 'donasi_palestina',
};

function doGet(e) {
  try {
    const bypassCache =
      e && e.parameter &&
      (e.parameter.cache === '0' || e.parameter.nocache === '1' || e.parameter.refresh === '1');

    const parameterTanggal =
      e && e.parameter && e.parameter.tanggal_update
        ? normalizeDate_(e.parameter.tanggal_update)
        : '';

    const cacheKey = 'dashboard-masjid-v20260523-' + (parameterTanggal || 'aktif');
    if (!bypassCache) {
      const cached = CacheService.getScriptCache().get(cacheKey);
      if (cached) return jsonText_(cached);
    }

    const pengaturan = readPengaturan_();
    const ringkasan = readRingkasan_();

    const tanggalUpdate =
      parameterTanggal ||
      ringkasan.tanggal_update_aktif ||
      pengaturan.tanggal_update_aktif ||
      '';

    const kajian = readKajianAktif_(tanggalUpdate);
    const kasRaw = readKasJumatRaw_(tanggalUpdate);
    const donasiRaw = readDonasiRaw_(tanggalUpdate);

    const pemasukanDariDetail =
      toNumber_(kasRaw.pemasukan_jumat) + toNumber_(kasRaw.pemasukan_lain);

    const saldoAwal = firstNumber_([
      kasRaw.saldo_awal,
      ringkasan.saldo_awal,
    ]);

    const totalPemasukan = firstNumber_([
      kasRaw.total_pemasukan,
      pemasukanDariDetail,
      kasRaw.pemasukan,
      ringkasan.total_pemasukan,
    ]);

    const totalPengeluaran = firstNumber_([
      kasRaw.total_pengeluaran,
      kasRaw.pengeluaran,
      ringkasan.total_pengeluaran,
    ]);

    // Saldo akhir dihitung cepat di Apps Script agar tidak menunggu/bergantung
    // pada formula spreadsheet. Rumusnya: saldo awal + pemasukan - pengeluaran.
    const saldoAkhirHitung = saldoAwal + totalPemasukan - totalPengeluaran;
    const saldoAkhir = firstNumber_([
      saldoAkhirHitung,
      kasRaw.saldo_akhir,
      ringkasan.saldo_akhir,
    ]);

    const donasiTerkumpul = firstNumber_([
      ringkasan.donasi_palestina_terkumpul,
      donasiRaw.terkumpul,
      donasiRaw.total_terkumpul,
    ]);

    const targetDonasi = firstNumber_([
      ringkasan.target_donasi_palestina,
      donasiRaw.target,
      donasiRaw.target_donasi,
    ]);

    const progressDonasiPersen = firstNumber_([
      ringkasan.progress_donasi,
      ringkasan.progress_donasi_palestina,
      donasiRaw.progress,
      donasiRaw.progress_persen,
      donasiRaw.persentase,
      targetDonasi > 0 ? (donasiTerkumpul / targetDonasi) * 100 : 0,
    ]);

    const progressDonasiRasio =
      targetDonasi > 0
        ? donasiTerkumpul / targetDonasi
        : progressDonasiPersen / 100;

    const jumlahKajianAktif = firstNumber_([
      ringkasan.jumlah_kajian_aktif,
      kajian.length,
    ]);

    // Keterangan diambil langsung dari sheet masing-masing, bukan dari teks default.
    // Pastikan sheet kas_jumat dan donasi_palestina memiliki salah satu kolom berikut.
    const keteranganKasJumat = pick_(kasRaw, [
      'keterangan',
      'deskripsi',
      'uraian',
      'keterangan_kas',
      'keterangan_penggunaan_dana',
    ]);

    const keteranganDonasiPalestina = pick_(donasiRaw, [
      'keterangan',
      'deskripsi',
      'uraian',
      'info_rekening',
      'informasi_rekening',
      'rekening',
    ]);

    const ringkasanOutput = {
      tanggal_update_aktif: tanggalUpdate,
      label_periode:
        ringkasan.label_periode ||
        pengaturan.label_periode ||
        formatTanggalIndonesia_(tanggalUpdate),
      nama_masjid:
        ringkasan.nama_masjid ||
        pengaturan.nama_masjid ||
        '',

      saldo_awal: saldoAwal,
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      saldo_akhir: saldoAkhir,
      saldo_awal_text: formatRupiah_(saldoAwal),
      total_pemasukan_text: formatRupiah_(totalPemasukan),
      total_pengeluaran_text: formatRupiah_(totalPengeluaran),
      saldo_akhir_text: formatRupiah_(saldoAkhir),

      donasi_palestina_terkumpul: donasiTerkumpul,
      target_donasi_palestina: targetDonasi,
      progress_donasi: roundNumber_(progressDonasiPersen, 2),
      progress_donasi_rasio: roundNumber_(progressDonasiRasio, 10),

      jumlah_kajian_aktif: jumlahKajianAktif,
      sumber_jadwal_shalat:
        ringkasan.sumber_jadwal_shalat ||
        pengaturan.sumber_jadwal_shalat ||
        'API MyQuran',
    };

    const kasJumatOutput = {
      tanggal_update: tanggalUpdate,
      label_periode: ringkasanOutput.label_periode,

      saldo_awal: saldoAwal,
      saldo_awal_text: formatRupiah_(saldoAwal),

      // Field utama untuk dashboard.
      pemasukan: totalPemasukan,
      total_pemasukan: totalPemasukan,
      total_pemasukan_text: formatRupiah_(totalPemasukan),
      pengeluaran: totalPengeluaran,
      total_pengeluaran: totalPengeluaran,
      total_pengeluaran_text: formatRupiah_(totalPengeluaran),
      saldo_akhir: saldoAkhir,
      saldo_akhir_text: formatRupiah_(saldoAkhir),

      // Field detail dari sheet kas_jumat, jika dibutuhkan.
      pemasukan_jumat: toNumber_(kasRaw.pemasukan_jumat),
      pemasukan_lain: toNumber_(kasRaw.pemasukan_lain),

      // Diambil dari sheet kas_jumat.
      keterangan: keteranganKasJumat,
      status: 'aktif',
      catatan: kasRaw.catatan || '',
    };

    const donasiPalestinaOutput = {
      tanggal_update: tanggalUpdate,
      target: targetDonasi,
      terkumpul: donasiTerkumpul,

      // Untuk kompatibilitas dengan kode lama dan baru.
      persentase: roundNumber_(progressDonasiRasio, 10),
      progress: roundNumber_(progressDonasiPersen, 2),
      progress_persen: roundNumber_(progressDonasiPersen, 2),

      jumlah_donatur: firstNumber_([
        ringkasan.jumlah_donatur,
        donasiRaw.jumlah_donatur,
      ]),

      // Diambil dari sheet donasi_palestina.
      keterangan: keteranganDonasiPalestina,
      status: 'aktif',
      catatan: donasiRaw.catatan || '',
    };

    const responseData = {
      success: true,
      source: 'Google Sheets',
      tanggal_update: tanggalUpdate,
      label_periode: ringkasanOutput.label_periode,

      pengaturan: {
        ...pengaturan,
        tanggal_update_aktif: tanggalUpdate,
        label_periode: ringkasanOutput.label_periode,
        nama_masjid: ringkasanOutput.nama_masjid,
        sumber_jadwal_shalat: ringkasanOutput.sumber_jadwal_shalat,
      },

      kajian: kajian,
      kas_jumat: kasJumatOutput,
      donasi_palestina: donasiPalestinaOutput,
      ringkasan: ringkasanOutput,
    };

    if (!bypassCache) {
      CacheService.getScriptCache().put(cacheKey, JSON.stringify(responseData), 45);
    }

    return json_(responseData);
  } catch (err) {
    return json_({
      success: false,
      message: err && err.message ? err.message : String(err),
      ringkasan: {},
      kajian: [],
      kas_jumat: null,
      donasi_palestina: null,
    });
  }
}

/* =========================
   READERS
========================= */

function readPengaturan_() {
  const sheet = getSheet_(SHEET.PENGATURAN);
  if (!sheet) return {};

  const data = readSheetData_(sheet);
  const result = {};

  data.rows.forEach(row => {
    const key = normalizeKey_(row[0]);
    if (!key) return;

    result[key] = normalizeValueByKey_(key, row[1], row.display[1]);
  });

  return result;
}

/**
 * Sheet ringkasan dibaca sebagai format label-value:
 * Kolom A = label
 * Kolom B dan seterusnya = nilai
 *
 * Contoh:
 * Tanggal Update Aktif       | 2026-05-22
 * Total Pemasukan            | Rp 34,382,925
 * Donasi Palestina Terkumpul | Rp 135.157.857
 */
function readRingkasan_() {
  const sheet = getSheet_(SHEET.RINGKASAN);
  if (!sheet) {
    throw new Error('Sheet "ringkasan" tidak ditemukan.');
  }

  const data = readSheetData_(sheet);
  const result = {};

  data.rows.forEach(row => {
    const label = String(row.display[0] || row[0] || '').trim();
    if (!label) return;

    const key = mapRingkasanLabelToKey_(label);
    if (!key) return;

    const cell = firstNonEmptyCellWithDisplay_(row.slice(1), row.display.slice(1));
    result[key] = normalizeValueByKey_(key, cell.raw, cell.display);
  });

  return result;
}

function readKasJumatRaw_(tanggalUpdate) {
  const rows = readTable_(SHEET.KAS_JUMAT);
  const activeRows = rows.filter(row => String(row.status || '').toLowerCase().trim() === 'aktif');

  return activeRows.find(row => {
    const tanggal = normalizeDate_(row.tanggal_update || row.tanggal || row.tgl_update || '');
    return tanggal === tanggalUpdate;
  }) || activeRows[0] || {};
}

function readDonasiRaw_(tanggalUpdate) {
  const rows = readTable_(SHEET.DONASI_PALESTINA);
  const activeRows = rows.filter(row => String(row.status || '').toLowerCase().trim() === 'aktif');

  return activeRows.find(row => {
    const tanggal = normalizeDate_(row.tanggal_update || row.tanggal || row.tgl_update || '');
    return tanggal === tanggalUpdate;
  }) || activeRows[0] || {};
}

function readKajianAktif_(tanggalUpdate) {
  const rows = readTable_(SHEET.KAJIAN);

  return rows
    .map(normalizeKajianRow_)
    .filter(item => {
      const status = String(item.status || '').toLowerCase().trim();
      const tanggal = normalizeDate_(item.tanggal_update || '');

      return status === 'aktif' && tanggal === tanggalUpdate;
    });
}

function readTable_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return [];

  const data = readSheetData_(sheet);
  if (data.values.length < 2) return [];

  const headers = data.rows[0].display.map(h => normalizeKey_(h));

  return data.rows
    .slice(1)
    .filter(row => row.some((cell, index) => !isEmpty_(cell) || !isEmpty_(row.display[index])))
    .map(row => {
      const item = {};

      headers.forEach((header, index) => {
        if (!header) return;
        const value = normalizeValueByKey_(header, row[index], row.display[index]);

        // Jika ada header duplikat, jangan menimpa nilai pertama yang sudah terisi.
        // Ini mencegah kolom bantu/formula tersembunyi menghapus angka utama.
        if (item[header] === undefined || isEmpty_(item[header])) {
          item[header] = value;
        }
      });

      return item;
    });
}

function normalizeKajianRow_(row) {
  const tanggalUpdate = normalizeDate_(pick_(row, [
    'tanggal_update',
    'tanggal',
    'tgl_update',
  ]));

  const tanggalKajianIso = normalizeDate_(pick_(row, [
    'tanggal_kajian',
    'tanggal_acara',
    'tanggal_pelaksanaan',
    'tgl_kajian',
  ]));

  const waktuRaw = pick_(row, ['waktu', 'jam', 'pukul']);

  return {
    tanggal_update: tanggalUpdate,
    judul: pick_(row, ['judul', 'judul_kajian', 'tema', 'tema_kajian', 'nama_kajian']),
    pemateri: pick_(row, ['pemateri', 'ustadz', 'ustaz', 'narasumber', 'penceramah']),

    // Format hari Indonesia untuk tampilan.
    tanggal_kajian: formatTanggalIndonesia_(tanggalKajianIso),

    // Versi ISO untuk kebutuhan teknis.
    tanggal_kajian_iso: tanggalKajianIso,

    waktu: normalizeWaktu_(waktuRaw),
    tempat: pick_(row, ['tempat', 'lokasi']),
    tema: pick_(row, ['tema', 'tema_kajian']),
    narahubung: pick_(row, ['narahubung', 'kontak', 'contact_person']),
    status: pick_(row, ['status']),
    catatan: pick_(row, ['catatan', 'keterangan', 'deskripsi']),
  };
}

/* =========================
   HELPERS
========================= */

function getSpreadsheet_() {
  if (!this.__DASHBOARD_MASJID_SS__) {
    this.__DASHBOARD_MASJID_SS__ = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return this.__DASHBOARD_MASJID_SS__;
}

function getSheet_(sheetName) {
  return getSpreadsheet_().getSheetByName(sheetName);
}

function readSheetData_(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), 1);
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const range = sheet.getRange(1, 1, lastRow, lastCol);
  const values = range.getValues();
  const displayValues = range.getDisplayValues();

  const rows = values.map((row, rowIndex) => {
    const item = row.slice();
    item.display = displayValues[rowIndex] || [];
    return item;
  });

  return { values: values, displayValues: displayValues, rows: rows };
}

function json_(data) {
  return jsonText_(JSON.stringify(data, null, 2));
}

function jsonText_(jsonText) {
  return ContentService
    .createTextOutput(jsonText)
    .setMimeType(ContentService.MimeType.JSON);
}

function mapRingkasanLabelToKey_(label) {
  const clean = normalizeKey_(label);

  const map = {
    tanggal_update_aktif: 'tanggal_update_aktif',
    tanggal_update: 'tanggal_update_aktif',
    label_periode: 'label_periode',
    periode: 'label_periode',
    nama_masjid: 'nama_masjid',

    saldo_awal: 'saldo_awal',
    total_pemasukan: 'total_pemasukan',
    pemasukan: 'total_pemasukan',
    total_pengeluaran: 'total_pengeluaran',
    pengeluaran: 'total_pengeluaran',
    saldo_akhir: 'saldo_akhir',

    donasi_palestina_terkumpul: 'donasi_palestina_terkumpul',
    donasi_terkumpul: 'donasi_palestina_terkumpul',
    total_donasi_palestina: 'donasi_palestina_terkumpul',
    target_donasi_palestina: 'target_donasi_palestina',
    target_donasi: 'target_donasi_palestina',
    progress_donasi: 'progress_donasi',
    progress_donasi_palestina: 'progress_donasi',
    persentase_donasi: 'progress_donasi',

    jumlah_donatur: 'jumlah_donatur',
    jumlah_kajian_aktif: 'jumlah_kajian_aktif',
    sumber_jadwal_shalat: 'sumber_jadwal_shalat',
  };

  return map[clean] || '';
}

function normalizeKey_(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, '_');
}

function normalizeValueByKey_(key, value, displayValue) {
  const cleanKey = normalizeKey_(key);
  const hasRawValue = !isEmpty_(value);
  const rawOrDisplay = hasRawValue ? value : displayValue;

  if ([
    'tanggal_update_aktif',
    'tanggal_update',
    'tanggal',
    'tgl_update',
    'tanggal_kajian',
    'tanggal_acara',
    'tanggal_pelaksanaan',
    'tgl_kajian',
  ].includes(cleanKey)) {
    return normalizeDate_(rawOrDisplay);
  }

  if ([
    'saldo_awal',
    'total_pemasukan',
    'pemasukan',
    'pemasukan_jumat',
    'pemasukan_lain',
    'total_pengeluaran',
    'pengeluaran',
    'saldo_akhir',
    'donasi_palestina_terkumpul',
    'target_donasi_palestina',
    'target_donasi',
    'target',
    'terkumpul',
    'total_terkumpul',
    'jumlah_donatur',
    'jumlah_kajian_aktif',
    'progress_donasi',
    'progress_donasi_palestina',
    'progress',
    'progress_persen',
    'persentase',
    'durasi_slide_detik',
  ].includes(cleanKey)) {
    return toNumber_(rawOrDisplay);
  }

  return String(!isEmpty_(displayValue) ? displayValue : (value || '')).trim();
}

function normalizeDate_(value) {
  if (!value) return '';

  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, TZ, 'yyyy-MM-dd');
  }

  if (typeof value === 'number' && Number.isFinite(value) && value > 20000 && value < 80000) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + Math.round(value) * 24 * 60 * 60 * 1000);
    return Utilities.formatDate(date, TZ, 'yyyy-MM-dd');
  }

  const text = String(value).trim();
  if (!text) return '';

  // Format ISO dari JSON/Date, contoh 2026-05-22T07:00:00.000Z.
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // Format dd/mm/yyyy, dd-mm-yyyy, atau m/d/yyyy dari locale spreadsheet.
  const dmyMatch = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    let first = Number(dmyMatch[1]);
    let second = Number(dmyMatch[2]);
    const year = dmyMatch[3];

    // Jika bagian kedua > 12, pola yang terbaca kemungkinan m/d/yyyy.
    // Contoh: 5/22/2026 => 2026-05-22.
    let day = first;
    let month = second;
    if (second > 12 && first <= 12) {
      day = second;
      month = first;
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // Format Indonesia, contoh: Jumat, 22 Mei 2026 atau 22 Mei 2026.
  const indonesiaMatch = text.match(/(?:senin|selasa|rabu|kamis|jumat|sabtu|minggu)?\s*,?\s*(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/i);
  if (indonesiaMatch) {
    const day = indonesiaMatch[1].padStart(2, '0');
    const month = monthNameToNumber_(indonesiaMatch[2]);
    const year = indonesiaMatch[3];

    if (month) return `${year}-${month}-${day}`;
  }

  return text;
}

function formatTanggalIndonesia_(value) {
  const iso = normalizeDate_(value);
  if (!iso) return '';

  const parts = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!parts) return iso;

  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);

  const date = new Date(year, month - 1, day);

  const hari = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];

  const bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return `${hari[date.getDay()]}, ${day} ${bulan[month - 1]} ${year}`;
}

function monthNameToNumber_(monthName) {
  const clean = normalizeKey_(monthName);

  const months = {
    januari: '01',
    feb: '02',
    februari: '02',
    maret: '03',
    mar: '03',
    april: '04',
    apr: '04',
    mei: '05',
    juni: '06',
    jun: '06',
    juli: '07',
    jul: '07',
    agustus: '08',
    agu: '08',
    september: '09',
    sep: '09',
    oktober: '10',
    okt: '10',
    november: '11',
    nov: '11',
    desember: '12',
    des: '12',
  };

  return months[clean] || '';
}

function normalizeWaktu_(value) {
  const text = String(value || '').trim();
  if (!text) return '';

  if (/\bWIB\b/i.test(text)) return text;

  const timeMatch = text.match(/^(\d{1,2})[:.](\d{2})$/);
  if (timeMatch) {
    return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]} WIB`;
  }

  return text;
}

/**
 * Konversi angka yang aman untuk format Indonesia maupun Inggris.
 *
 * Contoh yang didukung:
 * - Rp 7.497.047      -> 7497047
 * - Rp 7,497,047      -> 7497047
 * - Rp 34.382.925     -> 34382925
 * - Rp 34,382,925     -> 34382925
 * - 67,58%            -> 67.58
 * - 67.58%            -> 67.58
 * - 200000000         -> 200000000
 */
function toNumber_(value) {
  if (typeof value === 'number') return value;

  if (value === null || value === undefined || value === '') return 0;

  let text = String(value)
    .trim()
    .replace(/rp/gi, '')
    .replace(/%/g, '')
    .replace(/\s+/g, '')
    .replace(/[^\d.,\-]/g, '');

  if (!text) return 0;

  const hasComma = text.includes(',');
  const hasDot = text.includes('.');

  if (hasComma && hasDot) {
    const lastComma = text.lastIndexOf(',');
    const lastDot = text.lastIndexOf('.');
    const decimalSep = lastComma > lastDot ? ',' : '.';
    const thousandSep = decimalSep === ',' ? '.' : ',';
    const decimalPart = text.substring(text.lastIndexOf(decimalSep) + 1);

    if (decimalPart.length <= 2) {
      text = text
        .replace(new RegExp('\\' + thousandSep, 'g'), '')
        .replace(decimalSep, '.');
    } else {
      text = text.replace(/[.,]/g, '');
    }
  } else if (hasComma) {
    const parts = text.split(',');

    // 67,58 -> 67.58
    if (parts.length === 2 && parts[1].length <= 2) {
      text = parts[0] + '.' + parts[1];
    } else {
      // 7,497,047 -> 7497047
      text = text.replace(/,/g, '');
    }
  } else if (hasDot) {
    const parts = text.split('.');

    // 67.58 -> 67.58
    if (parts.length === 2 && parts[1].length <= 2) {
      text = text;
    } else {
      // 7.497.047 -> 7497047
      text = text.replace(/\./g, '');
    }
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : 0;
}

function firstNumber_(values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;

    const number = toNumber_(value);

    if (Number.isFinite(number) && number !== 0) {
      return number;
    }
  }

  return 0;
}

function firstNonEmptyCell_(cells) {
  for (const cell of cells) {
    if (!isEmpty_(cell)) return cell;
  }

  return '';
}

function firstNonEmptyCellWithDisplay_(rawCells, displayCells) {
  for (let i = 0; i < rawCells.length; i++) {
    const raw = rawCells[i];
    const display = displayCells[i];
    if (!isEmpty_(raw) || !isEmpty_(display)) {
      return { raw: raw, display: display };
    }
  }

  return { raw: '', display: '' };
}

function pick_(object, keys) {
  for (const key of keys) {
    if (!isEmpty_(object[key])) {
      return object[key];
    }
  }

  return '';
}

function isEmpty_(value) {
  return value === null || value === undefined || value === '';
}

function roundNumber_(value, decimals) {
  const number = Number(value || 0);
  const factor = Math.pow(10, decimals || 0);
  return Math.round(number * factor) / factor;
}

function formatRupiah_(value) {
  const number = toNumber_(value);
  return 'Rp ' + number.toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

/**
 * Fungsi tes dari editor Apps Script.
 */
function testDoGet() {
  const result = doGet({
    parameter: {
      tanggal_update: '2026-05-22',
      cache: '0',
    },
  });

  Logger.log(result.getContent());
}

/**
 * Fungsi tes khusus untuk memastikan parsing angka berjalan benar.
 */
function testToNumber() {
  const samples = [
    'Rp 7.497.047',
    'Rp 7,497,047',
    'Rp 34.382.925',
    'Rp 34,382,925',
    'Rp 14.831.589',
    'Rp 14,831,589',
    'Rp 135.157.857',
    'Rp 135,157,857',
    '67,58%',
    '67.58%',
    '200000000',
  ];

  samples.forEach(item => {
    Logger.log(item + ' => ' + toNumber_(item));
  });
}
