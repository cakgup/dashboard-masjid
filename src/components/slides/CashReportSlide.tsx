"use client";

import { KasData } from "@/types";
import { Wallet, TrendingUp, TrendingDown, Landmark } from "lucide-react";

export default function CashReportSlide({ data }: { data: KasData }) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl shrink-0 mt-4">
      <h2 className="text-3xl lg:text-5xl font-oswald font-bold text-white mb-2 uppercase tracking-wider text-center flex items-center gap-4 drop-shadow-md">
        <Landmark size={36} className="text-blue-400" />
        Laporan Kas Masjid
      </h2>
      <p className="text-xl lg:text-2xl text-secondary mb-6 font-medium tracking-widest uppercase">
        Periode: {data.periode}
      </p>

      <div className="grid grid-cols-2 gap-5 w-full mb-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center backdrop-blur-sm shadow-lg">
          <p className="text-gray-400 text-sm lg:text-base uppercase tracking-widest mb-1 font-semibold">Saldo Awal</p>
          <p className="text-3xl lg:text-4xl font-oswald font-bold text-white tracking-wide">
            {formatRupiah(data.saldoAwal)}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center backdrop-blur-sm shadow-lg">
          <p className="text-gray-400 text-sm lg:text-base uppercase tracking-widest mb-1 font-semibold">Saldo Akhir</p>
          <p className="text-3xl lg:text-4xl font-oswald font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] tracking-wide">
            {formatRupiah(data.saldoAkhir)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 w-full mb-6">
        <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="bg-emerald-500/20 p-2.5 rounded-full mb-2">
            <TrendingUp size={24} className="text-emerald-400" />
          </div>
          <p className="text-emerald-200/80 text-sm lg:text-base uppercase tracking-widest mb-1 font-semibold">Pemasukan</p>
          <p className="text-3xl lg:text-4xl font-oswald font-bold text-emerald-400 tracking-wide">
            {formatRupiah(data.pemasukan)}
          </p>
        </div>
        
        <div className="bg-red-900/30 border border-red-500/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="bg-red-500/20 p-2.5 rounded-full mb-2">
            <TrendingDown size={24} className="text-red-400" />
          </div>
          <p className="text-red-200/80 text-sm lg:text-base uppercase tracking-widest mb-1 font-semibold">Pengeluaran</p>
          <p className="text-3xl lg:text-4xl font-oswald font-bold text-red-400 tracking-wide">
            {formatRupiah(data.pengeluaran)}
          </p>
        </div>
      </div>

      <div className="w-full bg-black/50 rounded-xl p-4 border border-white/5 text-center text-gray-300 text-base lg:text-lg italic backdrop-blur-sm">
        "{data.keterangan}"
      </div>
    </div>
  );
}
