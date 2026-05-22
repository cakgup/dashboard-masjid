// Konfigurasi API Google Apps Script untuk data dashboard yang berubah setiap Jumat.
// Catatan: jadwal shalat tetap dari API MyQuran dan konten himbauan tetap static.

export const DASHBOARD_API_URL =
  "https://script.google.com/macros/s/AKfycbwCgyD0gEHL-iIKgZw7N5laMjjDbfVuV1RGr71jqTi4uCsWVeFPbu9nAM1VEc4Y8lip/exec";

// Kosongkan agar Apps Script membaca `tanggal_update_aktif` dari sheet `pengaturan`.
export const DEFAULT_TANGGAL_UPDATE = "";

// Refresh data Google Sheets setiap 5 menit.
export const DASHBOARD_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
