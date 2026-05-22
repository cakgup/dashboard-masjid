/**
 * Google Apps Script untuk Dashboard Masjid
 * Project editor:
 * https://script.google.com/u/0/home/projects/1C6CnNE8S2VGaNxZVOus3SnN57jvCcf2kyZ-RY1W8D-f5GE0JBkwDgmzE/edit
 *
 * Cara pakai:
 * 1. Paste seluruh isi file ini ke Kode.gs pada project Apps Script tersebut.
 * 2. Isi SPREADSHEET_ID dengan ID Google Sheets dashboard masjid.
 * 3. Deploy sebagai Web App.
 * 4. Gunakan URL Web App yang berakhiran /exec pada src/config/dashboardApi.ts.
 */

const SPREADSHEET_ID = 'ISI_DENGAN_ID_SPREADSHEET_ANDA';

const SHEETS = {
  pengaturan: 'pengaturan',
  kajian: 'kajian',
  kasJumat: 'kas_jumat',
  donasiPalestina: 'donasi_palestina',
  ringkasan: 'ringkasan',
};

const TIMEZONE = 'Asia/Jakarta';

function jsonOutput_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'ISI_DENGAN_ID_SPREADSHEET_ANDA') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  throw new Error('SPREADSHEET_ID belum diisi dan script tidak terikat pada spreadsheet.');
}

function normalizeKey_(key) {
  return String(key || '')
    .trim()
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[\s\-./]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function normalizeValue_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, TIMEZONE, 'yyyy-MM-dd');
  }
  return value;
}

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  return sheet || null;
}

function readRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(normalizeKey_);

  return values.slice(1)
    .filter(row => row.some(cell => cell !== '' && cell !== null))
    .map(row => {
      const item = {};
      headers.forEach((header, index) => {
        if (header) item[header] = normalizeValue_(row[index]);
      });
      return item;
    });
}

function labelToKey_(label) {
  const key = normalizeKey_(label);

  if (!key) return '';
  if (key.includes('tanggal_update_aktif')) return 'tanggal_update_aktif';
  if (key.includes('label_periode')) return 'label_periode';
  if (key.includes('nama_masjid')) return 'nama_masjid';
  if (key.includes('saldo_awal')) return 'saldo_awal';
  if (key.includes('total_pemasukan') || key === 'pemasukan') return 'total_pemasukan';
  if (key.includes('total_pengeluaran') || key === 'pengeluaran') return 'total_pengeluaran';
  if (key.includes('saldo_akhir')) return 'saldo_akhir';
  if (key.includes('donasi_palestina_terkumpul')) return 'donasi_palestina_terkumpul';
  if (key.includes('target_donasi_palestina')) return 'target_donasi_palestina';
  if (key.includes('progress_donasi')) return 'progress_donasi';
  if (key.includes('jumlah_kajian_aktif')) return 'jumlah_kajian_aktif';
  if (key.includes('sumber_jadwal_shalat')) return 'sumber_jadwal_shalat';

  return key;
}

function readKeyValueSheet_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return {};

  const values = sheet.getDataRange().getValues();
  const result = {};

  // Mendukung 2 format:
  // 1. key | value
  // 2. Label bebas | Nilai, seperti: Tanggal Update Aktif | 2026-05-22
  values.forEach((row, index) => {
    if (index === 0) return;

    const first = row[0];
    const second = row[1];

    if (first !== '' && first !== null && second !== '' && second !== null) {
      result[labelToKey_(first)] = normalizeValue_(second);
    }
  });

  return result;
}

function getRowByTanggal_(rows, tanggalUpdate) {
  if (!rows.length) return null;

  const activeRows = rows.filter(row => {
    const status = String(row.status || 'aktif').trim().toLowerCase();
    const isActive = !['nonaktif', 'tidak aktif', 'inactive', 'false', '0'].includes(status);
    const tanggal = String(row.tanggal_update || '').trim();
    return isActive && (!tanggalUpdate || !tanggal || tanggal === tanggalUpdate);
  });

  return activeRows[0] || rows[0] || null;
}

function doGet(e) {
  try {
    const pengaturan = readKeyValueSheet_(SHEETS.pengaturan);
    const ringkasan = readKeyValueSheet_(SHEETS.ringkasan);

    const tanggalUpdate =
      (e && e.parameter && e.parameter.tanggal_update) ||
      pengaturan.tanggal_update_aktif ||
      ringkasan.tanggal_update_aktif ||
      '';

    const kajianRows = readRows_(SHEETS.kajian).filter(row => {
      const status = String(row.status || 'aktif').trim().toLowerCase();
      const isActive = !['nonaktif', 'tidak aktif', 'inactive', 'false', '0'].includes(status);
      const tanggal = String(row.tanggal_update || '').trim();
      return isActive && (!tanggalUpdate || !tanggal || tanggal === tanggalUpdate);
    });

    const kasRow = getRowByTanggal_(readRows_(SHEETS.kasJumat), tanggalUpdate);
    const donasiRow = getRowByTanggal_(readRows_(SHEETS.donasiPalestina), tanggalUpdate);

    return jsonOutput_({
      success: true,
      tanggal_update: tanggalUpdate,
      pengaturan: pengaturan,
      kajian: kajianRows,
      kas_jumat: kasRow,
      donasi_palestina: donasiRow,
      ringkasan: ringkasan,
    });
  } catch (error) {
    return jsonOutput_({
      success: false,
      message: error.message,
    });
  }
}

function testDoGet() {
  const result = doGet({ parameter: { tanggal_update: '2026-05-22' } });
  Logger.log(result.getContent());
}
