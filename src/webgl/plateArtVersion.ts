// tools/shrink-plate.py が書き出す。直接いじらない。
// 絵の中身から作った版番号。URLに付けて、古い絵が居座るのを防ぐ。
export const PLATE_ART_VERSION: Record<string, string> = {
  "01": "7679ee00a5",
  "02": "85527a569e",
  "03": "896a6ea8f8",
  "04": "1fc17f1cfb",
  "05": "97199be8bf",
  "06": "3c3192a33d",
  "07": "0bd81c0473"
} as const;
