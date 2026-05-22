"use client";

import { ReminderData, ReminderTextSegment } from "@/types";

export default function ReminderSlide({ data }: { data: ReminderData }) {
  const renderLine = (segments: ReminderTextSegment[]) => {
    if (!segments || segments.length === 0) return null;
    return segments.map((seg, i) => 
      seg.bold ? (
        <span key={i} className="font-bold font-oswald text-4xl xl:text-5xl text-secondary tracking-widest uppercase ml-2 align-middle">{seg.text}</span>
      ) : (
        <span key={i} className="text-3xl xl:text-4xl align-middle">{seg.text}</span>
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[95%] xl:max-w-7xl h-full">
      <div className="flex flex-row items-center justify-center gap-10 xl:gap-16 bg-black/40 p-10 xl:p-16 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-md w-fit">
        {/* Logo/Icon – no frame, blends into background */}
        <div className="w-52 h-52 xl:w-64 xl:h-64 shrink-0 flex items-center justify-center">
          <img 
            src={data.imagePath} 
            alt="Ikon Himbauan" 
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0.3";
            }}
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col text-left justify-center gap-3 xl:gap-5">
          {data.baris.map((line, idx) => (
            <p key={idx} className="text-gray-200 font-medium tracking-wide leading-tight whitespace-nowrap">
              {renderLine(line)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
