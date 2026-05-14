export interface OperationalData {
  id: number;
  line: string;
  suhu: number;
  berat: number;
  group: string;
  shift: number;
  kualitas: string;
  date?: string;
}

export interface MasterData {
  groups: string[];
  shifts: number[];
  lines: string[];
}
