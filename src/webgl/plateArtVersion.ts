// tools/shrink-plate.py が書き出す。直接いじらない。
// 絵の中身から作った版番号。URLに付けて、古い絵が居座るのを防ぐ。
export const PLATE_ART_VERSION: Record<string, string> = {
  "01": "ff26da95b3",
  "02": "676ce0bbca",
  "03": "6ffd4872de",
  "04": "2534589076",
  "05": "3247bdfb15",
  "06": "c35161dc1e",
  "07": "b63797de72"
} as const;
