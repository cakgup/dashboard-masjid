"use client";

import { useEffect, useState } from "react";
import { AnySlide } from "@/types";
import { DASHBOARD_REFRESH_INTERVAL_MS } from "@/config/dashboardApi";
import { getDashboardSlides } from "@/lib/dashboardSheets";
import KajianSlide from "./KajianSlide";
import CashReportSlide from "./CashReportSlide";
import DonationSlide from "./DonationSlide";
import ReminderSlide from "./ReminderSlide";
// Import other slides when ready

const DUMMY_SLIDES: AnySlide[] = [
  {
    id: "1",
    type: "kajian",
    duration: 15000,
    active: true,
    judul: "Kajian Ba'da Dzuhur",
    tema: "Kajian Kitab Irsyadul Mu'minin",
    pemateri: "Ustadz Dr. Ahmad Husnul Hakim",
    waktu: "Rabu, 20 Mei 2026, pukul 12.15 WIB",
    lokasi: "Ruang Utama Masjid Al Amanah",
  },
  {
    id: "1b",
    type: "kajian",
    duration: 15000,
    active: true,
    judul: "Kajian Ba'da Dzuhur",
    tema: "Kajian Kitab Bulughul Maram",
    pemateri: "Ustadz Dr. Agus Setiawan, Lc., MA",
    waktu: "Kamis, 21 Mei 2026, pukul 12.15 WIB",
    lokasi: "Ruang Utama Masjid Al Amanah",
  },
  {
    id: "2",
    type: "kas",
    duration: 15000,
    active: true,
    periode: "Mei 2026",
    saldoAwal: 15000000,
    pemasukan: 7500000,
    pengeluaran: 3250000,
    saldoAkhir: 19250000,
    keterangan: "Penggunaan dana untuk operasional masjid, kebersihan, dan kegiatan lainnya.",
  },
  {
    id: "3",
    type: "donation",
    duration: 15000,
    active: true,
    program: "Donasi Kemanusiaan Palestina",
    target: 50000000,
    terkumpul: 32500000,
    periode: "Mei 2026",
    keterangan: "Donasi akan disalurkan melalui lembaga resmi sesuai ketetapan pengurus masjid.",
  },
  {
    id: "4",
    type: "reminder",
    duration: 15000,
    active: true,
    baris: [
      [{ text: "terima kasih telah ", bold: false }, { text: "menonaktifkan", bold: true }],
      [{ text: "alat komunikasi", bold: false }],
    ],
    imagePath: "/dashboard-masjid/himbauan-hp.png",
  },
  {
    id: "5",
    type: "reminder",
    duration: 15000,
    active: true,
    baris: [
      [{ text: "terima kasih telah ", bold: false }, { text: "menjaga kebersihan", bold: true }],
      [{ text: "di Masjid Al Amanah Kementerian Keuangan", bold: false }],
    ],
    imagePath: "/dashboard-masjid/himbauan-kebersihan.png",
  },
  {
    id: "6",
    type: "reminder",
    duration: 15000,
    active: true,
    baris: [
      [{ text: "pastikan barang bawaan anda ", bold: false }, { text: "aman", bold: true }],
      [{ text: "dan dalam ", bold: false }, { text: "pengawasan", bold: true }],
    ],
    imagePath: "/dashboard-masjid/himbauan-barang.png",
  },
];

export default function SlideContainer() {
  // Hanya tampilkan slide yang active: true
  const [ACTIVE_SLIDES, setActiveSlides] = useState<AnySlide[]>(
    DUMMY_SLIDES.filter((s) => s.active)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardSlides = async () => {
      try {
        // Ambil data dari Apps Script; biarkan Apps Script membaca tanggal dari sheet
        const slides = await getDashboardSlides(DUMMY_SLIDES);

        if (!isMounted || slides.length === 0) return;

        setActiveSlides(slides);
        setCurrentIndex((prev) => (prev >= slides.length ? 0 : prev));
      } catch (error) {
        console.error("Gagal mengambil data dashboard dari Google Sheets:", error);
        // Jika API gagal, layout tetap tampil menggunakan data fallback bawaan.
      }
    };

    loadDashboardSlides();

    const refreshTimer = setInterval(loadDashboardSlides, DASHBOARD_REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    if (ACTIVE_SLIDES.length === 0) return;
    const currentSlide = ACTIVE_SLIDES[currentIndex];
    
    // Timer for transition fade out
    const fadeOutTimer = setTimeout(() => {
      setFade(false);
    }, currentSlide.duration - 1000); // Start fading out 1s before switching

    // Timer for slide switch
    const switchTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVE_SLIDES.length);
      setFade(true); // Fade back in for the new slide
    }, currentSlide.duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(switchTimer);
    };
  }, [currentIndex, ACTIVE_SLIDES]);

  const renderSlide = (slide: AnySlide) => {
    switch (slide.type) {
      case "kajian":
        return <KajianSlide data={slide} />;
      case "kas":
        return <CashReportSlide data={slide} />;
      case "donation":
        return <DonationSlide data={slide} />;
      case "reminder":
        return <ReminderSlide data={slide} />;
      default:
        return <div className="text-white text-2xl">Slide type not supported yet.</div>;
    }
  };

  return (
    <main className="flex-1 p-8 flex items-center justify-center overflow-hidden">
      <div 
        className={`w-full h-full glass rounded-3xl p-8 flex flex-col items-center justify-center relative shadow-2xl border border-white/10 transition-opacity duration-1000 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        {ACTIVE_SLIDES[currentIndex] ? renderSlide(ACTIVE_SLIDES[currentIndex]) : null}
      </div>
    </main>
  );
}
