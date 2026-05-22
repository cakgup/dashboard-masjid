"use client";

import { DonationData } from "@/types";


export default function DonationSlide({ data }: { data: DonationData }) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const progressPercentage = Math.min(Math.round((data.terkumpul / data.target) * 100), 100);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl shrink-0">

      <h2 className="text-4xl lg:text-5xl font-oswald font-bold text-white mb-2 uppercase tracking-widest text-center leading-tight drop-shadow-md">
        {data.program}
      </h2>
      <p className="text-lg lg:text-xl text-gray-300 mb-6 font-medium tracking-widest uppercase">
        Periode: {data.periode}
      </p>

      <div className="w-full bg-black/40 w-full rounded-[2rem] p-6 lg:p-8 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-center shrink-0 mb-4">
        {/* Decorative background glow for donation */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]"></div>

        <div className="grid grid-cols-2 gap-6 mb-8 w-full">
          <div className="flex flex-col items-center justify-center text-center bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">

            <p className="text-gray-400 text-sm lg:text-base uppercase tracking-widest font-semibold mb-2">Target Donasi</p>
            <p className="text-3xl lg:text-4xl font-oswald font-bold text-white tracking-wide">
              {formatRupiah(data.target)}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center text-center bg-white/5 p-6 rounded-2xl border border-blue-500/20 shadow-lg relative overflow-hidden">
            {/* Subtle glow for the collected amount */}
            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>

            <p className="text-blue-300 text-sm lg:text-base uppercase tracking-widest font-semibold mb-2 relative z-10">Telah Terkumpul</p>
            <p className="text-3xl lg:text-4xl font-oswald font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] tracking-wide relative z-10">
              {formatRupiah(data.terkumpul)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-white font-bold text-2xl mb-3 font-oswald">
            <span>Progress</span>
            <span className="text-secondary">{progressPercentage}%</span>
          </div>
          <div className="w-full h-8 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-secondary to-yellow-300 relative transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Shine effect on progress bar */}
              <div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-blue-500/20 rounded-xl p-4 border border-blue-500/30 text-center text-gray-300 text-base lg:text-lg italic backdrop-blur-sm">
        "{data.keterangan}"
      </div>
    </div>
  );
}
