"use client";

import { Info } from "lucide-react";

export default function Announcement() {
  return (
    <main className="flex-1 p-8 flex items-center justify-center overflow-hidden">
      <div className="w-full h-full glass rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>

        <h2 className="text-4xl lg:text-6xl font-oswald font-bold text-white mb-6 uppercase tracking-wider text-center">
          Pengumuman
        </h2>
        <div className="text-2xl lg:text-4xl text-gray-300 text-center max-w-5xl leading-relaxed">
          "Barangsiapa yang membangun masjid karena Allah, maka Allah akan membangunkan
          baginya semisal itu di surga."
          <br />
          <span className="block mt-6 text-xl lg:text-3xl text-primary font-semibold">
            (HR. Bukhari & Muslim)
          </span>
        </div>

        <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full border border-white/10">
          <Info size={24} className="text-secondary" />
          <span className="text-xl text-white font-medium">
            Laporan Kas Masjid: Rp 15.500.000
          </span>
        </div>
      </div>
    </main>
  );
}
