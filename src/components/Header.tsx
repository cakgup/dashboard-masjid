"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import * as hijriConverter from "hijri-converter";

type PrayerTime = { name: string; time: string };

const DEFAULT_PRAYER_TIMES: PrayerTime[] = [
  { name: "Subuh", time: "04:25" },
  { name: "Dzuhur", time: "11:41" },
  { name: "Ashar", time: "15:02" },
  { name: "Maghrib", time: "17:47" },
  { name: "Isya", time: "18:59" },
];

export default function Header() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [hijriDate, setHijriDate] = useState<string>("Loading...");
  const [iqomahReminder, setIqomahReminder] = useState<string | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>(DEFAULT_PRAYER_TIMES);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchJadwalShalat = async () => {
      try {
        const today = new Date();
        const year = format(today, "yyyy");
        const month = format(today, "MM");
        const day = format(today, "dd");

        const apiUrl = `https://api.myquran.com/v2/sholat/jadwal/1301/${year}/${month}/${day}`;
        console.log("🔗 Fetching from:", apiUrl);

        const response = await fetch(apiUrl);
        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ API Response:", result);

        if (result.status && result.data && result.data.jadwal) {
          const jadwalAPI = result.data.jadwal;
          console.log("📅 Jadwal dari API:", jadwalAPI);

          const newPrayerTimes: PrayerTime[] = [
            { name: "Subuh", time: jadwalAPI.subuh },
            { name: "Dzuhur", time: jadwalAPI.dzuhur },
            { name: "Ashar", time: jadwalAPI.ashar },
            { name: "Maghrib", time: jadwalAPI.maghrib },
            { name: "Isya", time: jadwalAPI.isya },
          ];
          console.log("🕐 Updated prayer times:", newPrayerTimes);
          setPrayerTimes(newPrayerTimes);
        } else {
          console.warn("⚠️ API response structure mismatch:", result);
        }
      } catch (error) {
        console.error("❌ Gagal mengambil jadwal shalat:", error);
      }
    };

    fetchJadwalShalat();
  }, []);

  useEffect(() => {
    const checkShalatTime = () => {
      const now = new Date();

      for (const prayer of prayerTimes) {
        const [prayerHour, prayerMin] = prayer.time.split(":").map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(prayerHour, prayerMin, 0);

        const oneMinuteBefore = new Date(prayerDate.getTime() - 60000);
        const oneMinuteAfter = new Date(prayerDate.getTime());

        if (now >= oneMinuteBefore && now < oneMinuteAfter) {
          setIqomahReminder(`IQOMAH ${prayer.name} 1 MENIT LAGI`);
          return;
        }
      }
      setIqomahReminder(null);
    };

    checkShalatTime();
    const interval = setInterval(checkShalatTime, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  useEffect(() => {
    const today = new Date();
    const hijri = hijriConverter.toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const monthNames = [
      "Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal",
      "Jumadil Akhir", "Rajab", "Syaban", "Ramadan", "Syawal", "Dzulkaidah", "Dzulhijjah"
    ];

    const hijriText = `${hijri.hd} ${monthNames[hijri.hm - 1]} ${hijri.hy} H`;
    setHijriDate(hijriText);
  }, []);

  return (
    <header className="flex justify-between items-center p-6 lg:p-8 glass border-b-0 shadow-lg">
      {iqomahReminder && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded">
          <div className="text-5xl lg:text-7xl font-oswald font-bold text-red-500 animate-pulse text-center drop-shadow-2xl">
            {iqomahReminder}
          </div>
        </div>
      )}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="w-28 h-28 shrink-0 rounded-full flex items-center justify-center border-2 border-primary/50 shadow-[0_0_15px_var(--primary-glow)] overflow-hidden bg-white">
          <img src="/dashboard-masjid/logo.png" alt="Logo Masjid Al Amanah" className="w-full h-full object-contain p-1" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="flex flex-col font-oswald tracking-wide uppercase leading-tight">
            <span className="text-3xl lg:text-4xl font-bold text-white">Masjid Al Amanah</span>
            <span className="text-xl lg:text-2xl font-medium text-secondary mt-1">Kementerian Keuangan Republik Indonesia</span>
          </h1>
          <div className="flex items-center gap-2 mt-2 text-gray-300 text-sm lg:text-base">
            <MapPin size={18} className="text-secondary shrink-0" />
            <span className="whitespace-nowrap">Jl. Lapangan Banteng Timur No. 2-4 Jakarta Pusat Kode Pos 10710</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center">
        <div className="flex items-center gap-3">
          <div className="text-7xl lg:text-8xl font-oswald font-bold text-white tracking-wider drop-shadow-lg leading-none">
            {currentTime ? format(currentTime, "HH:mm:ss") : "00:00:00"}
          </div>
          <div className="text-2xl lg:text-3xl font-semibold text-secondary">WIB</div>
        </div>
        <div className="flex items-center gap-3 mt-3 text-lg lg:text-xl text-gray-200">
          <Calendar size={20} className="text-secondary shrink-0" />
          <span className="font-semibold whitespace-nowrap">
            {currentTime ? format(currentTime, "EEEE, d MMMM yyyy", { locale: id }) : "-"}
          </span>
          <span className="text-gray-400 mx-2">|</span>
          <span className="font-semibold text-secondary whitespace-nowrap">{hijriDate}</span>
        </div>
      </div>
    </header>
  );
}
