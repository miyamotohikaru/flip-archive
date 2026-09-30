// tools/shrink-plate.py が書き出す。直接いじらない。
// 絵の中身から作った版番号。URLに付けて、古い絵が居座るのを防ぐ。
export const PLATE_ART_VERSION: Record<string, string> = {
  "01": "ff26da95b3",
  "02": "6e24eddbf6",
  "03": "83fcd7c3ba",
  "04": "f38f68e532",
  "05": "3247bdfb15",
  "06": "09ad2542ca",
  "07": "b63797de72"
} as const;
