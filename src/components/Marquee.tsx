"use client";

export default function Marquee() {
  return (
    <div className="w-full h-12 lg:h-16 bg-primary text-white flex items-center overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap text-xl lg:text-2xl font-bold font-oswald uppercase tracking-wide">
        Selamat datang di Masjid Al Amanah Kementerian Keuangan &nbsp; • &nbsp; Mari luruskan dan rapatkan
        shaf sebelum shalat dimulai &nbsp; • &nbsp; Harap menonaktifkan telepon genggam
        selama berada di dalam masjid &nbsp; • &nbsp; Kajian rutin setiap ba'da Dhuhur
        &nbsp; • &nbsp; Salurkan Infaq dan Sedekah terbaik Anda melalui rekening BSI:
        7-3700-3700-5 a/n Masjid Al Amanah
      </div>
    </div>
  );
}
