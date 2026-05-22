export type SlideType = 'kajian' | 'kas' | 'donation' | 'prayer' | 'hadith' | 'reminder' | 'misc';

export interface BaseSlide {
  id: string;
  type: SlideType;
  duration: number; // in milliseconds
  active: boolean;
}

export interface KajianData extends BaseSlide {
  type: 'kajian';
  judul: string;
  tema: string;
  pemateri: string;
  waktu: string;
  lokasi: string;
}

export interface KasData extends BaseSlide {
  type: 'kas';
  periode: string;
  saldoAwal: number;
  pemasukan: number;
  pengeluaran: number;
  saldoAkhir: number;
  keterangan: string;
}

export interface DonationData extends BaseSlide {
  type: 'donation';
  program: string;
  target: number;
  terkumpul: number;
  periode: string;
  keterangan: string;
}

export interface ReminderTextSegment {
  text: string;
  bold: boolean;
}

export interface ReminderData extends BaseSlide {
  type: 'reminder';
  baris: ReminderTextSegment[][];
  imagePath: string;
}

// Additional slide types can be defined here...
export type AnySlide = KajianData | KasData | DonationData | ReminderData;
