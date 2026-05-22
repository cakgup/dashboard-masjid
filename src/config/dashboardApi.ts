// Konfigurasi API Google Apps Script untuk data dashboard yang berubah setiap Jumat.
// Catatan penting:
// - Link /home/projects/.../edit adalah link EDITOR Apps Script, bukan endpoint API.
// - Dashboard harus memanggil URL Web App yang berakhiran /exec.
// - URL editor di bawah hanya disimpan sebagai dokumentasi agar mudah dilacak.

export const APPS_SCRIPT_PROJECT_EDIT_URL =
  "https://script.google.com/u/0/home/projects/1C6CnNE8S2VGaNxZVOus3SnN57jvCcf2kyZ-RY1W8D-f5GE0JBkwDgmzE/edit";

export const DASHBOARD_API_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_API_URL ||
  "https://script.google.com/macros/s/AKfycbwCgyD0gEHL-iIKgZw7N5laMjjDbfVuV1RGr71jqTi4uCsWVeFPbu9nAM1VEc4Y8lip/exec";

// Kosongkan agar Apps Script membaca `tanggal_update_aktif` dari sheet `pengaturan`.
export const DEFAULT_TANGGAL_UPDATE = "";

// Refresh data Google Sheets setiap 5 menit.
export const DASHBOARD_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
