"use client";

import { KajianData } from "@/types";
import { User, Clock, MapPin } from "lucide-react";

export default function KajianSlide({ data }: { data: KajianData }) {
  return (
    <div className="flex flex-col items-center w-full max-w-6xl">

      <h2 className="text-4xl lg:text-5xl font-oswald font-bold text-white mb-4 uppercase tracking-widest text-center drop-shadow-md">
        {data.judul}
      </h2>
      
      <div className="bg-black/40 w-full rounded-[2rem] p-6 lg:p-8 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-center shrink-0">
        {/* Subtle decorative background glow */}
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-gray-400 uppercase tracking-widest font-semibold mb-2 text-lg">Tema Kajian</p>
          <h3 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-secondary via-yellow-200 to-secondary bg-clip-text text-transparent mb-6 text-center leading-tight">
            "{data.tema}"
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-2">
            <div className="flex flex-col items-center text-center bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/5 shadow-lg">
              <div className="bg-blue-500/20 p-3 rounded-full mb-3">
                <User size={24} className="text-blue-300" />
              </div>
              <p className="text-blue-300/80 text-xs lg:text-sm uppercase tracking-widest mb-1">Pemateri</p>
              <p className="text-white text-xl lg:text-2xl font-semibold">{data.pemateri}</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/5 shadow-lg">
              <div className="bg-secondary/20 p-3 rounded-full mb-3">
                <Clock size={24} className="text-secondary" />
              </div>
              <p className="text-secondary/80 text-xs lg:text-sm uppercase tracking-widest mb-1">Waktu</p>
              <p className="text-white text-xl lg:text-2xl font-semibold leading-snug">{data.waktu}</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/5 shadow-lg">
              <div className="bg-blue-500/20 p-3 rounded-full mb-3">
                <MapPin size={24} className="text-blue-300" />
              </div>
              <p className="text-blue-300/80 text-xs lg:text-sm uppercase tracking-widest mb-1">Lokasi</p>
              <p className="text-white text-xl lg:text-2xl font-semibold leading-snug">{data.lokasi}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
