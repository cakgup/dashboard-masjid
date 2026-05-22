import Header from "@/components/Header";
import SlideContainer from "@/components/slides/SlideContainer";
import PrayerTimes from "@/components/PrayerTimes";
import Marquee from "@/components/Marquee";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full bg-black relative z-0">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 z-[-2] bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/dashboard-masjid/bg.jpg')" }}
      ></div>

      {/* Background Decorative Pattern (Optional subtle glow) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-glow blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[rgba(245,158,11,0.15)] blur-[120px]"></div>
      </div>

      <Header />
      <SlideContainer />

      {/* BOTTOM SECTION */}
      <footer className="mt-auto flex flex-col">
        <PrayerTimes />
        <Marquee />
      </footer>
    </div>
  );
}

