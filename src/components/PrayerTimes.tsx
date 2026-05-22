"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

type PrayerTimeItem = { name: string; time: string };

const FALLBACK_PRAYER_TIMES: PrayerTimeItem[] = [
  { name: "Imsak", time: "04:15" },
  { name: "Subuh", time: "04:25" },
  { name: "Syuruq", time: "05:42" },
  { name: "Dzuhur", time: "11:41" },
  { name: "Ashar", time: "15:02" },
  { name: "Maghrib", time: "17:47" },
  { name: "Isya", time: "18:59" },
];

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeItem[]>(FALLBACK_PRAYER_TIMES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const year = format(today, "yyyy");
        const month = format(today, "MM");
        const day = format(today, "dd");

        // ID 1301 = Kota Jakarta (Bimas Islam Kemenag RI via myquran.com)
        const response = await fetch(
          `https://api.myquran.com/v2/sholat/jadwal/1301/${year}/${month}/${day}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status && result.data && result.data.jadwal) {
          const j = result.data.jadwal;
          setPrayerTimes([
            { name: "Imsak",   time: j.imsak },
            { name: "Subuh",   time: j.subuh },
            { name: "Syuruq",  time: j.terbit },
            { name: "Dzuhur",  time: j.dzuhur },
            { name: "Ashar",   time: j.ashar },
            { name: "Maghrib", time: j.maghrib },
            { name: "Isya",    time: j.isya },
          ]);
        } else {
          console.warn("Format data API MyQuran tidak sesuai:", result);
        }
      } catch (error) {
        console.error("Gagal mengambil jadwal shalat:", error);
        // Biarkan fallback data tetap tampil
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrayerTimes();

    // Refresh setiap 1 jam
    const interval = setInterval(fetchPrayerTimes, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-7 w-full h-32 lg:h-40 bg-surface/90 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {prayerTimes.map((prayer, index) => {
        // Find next prayer - simple logic based on current hour
        const currentHour = new Date().getHours();
        const prayerHour = parseInt(prayer.time.split(":")[0]);
        // Simplistic highlight logic for display purposes
        const isNext = (currentHour < prayerHour) && index === prayerTimes.findIndex(p => parseInt(p.time.split(":")[0]) > currentHour) || (currentHour >= 20 && index === 1); 

        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-center border-r border-white/5 last:border-r-0 relative transition-all duration-500
              ${
                isNext
                  ? "bg-secondary/10 shadow-[inset_0_0_50px_rgba(245,158,11,0.15)]"
                  : "hover:bg-white/5"
              }`}
          >
            {isNext && (
              <div className="absolute top-0 w-full h-1 bg-secondary shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            )}
            <span
              className={`text-2xl lg:text-3xl font-oswald font-bold uppercase tracking-widest ${
                isNext ? "text-secondary" : "text-gray-400"
              }`}
            >
              {prayer.name}
            </span>
            <span
              className={`text-4xl lg:text-6xl font-bold mt-2 ${
                isNext ? "text-white" : "text-gray-200"
              } ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-none transition-all duration-500'}`}
            >
              {prayer.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}
