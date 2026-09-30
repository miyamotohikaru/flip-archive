// tools/shrink-plate.py が書き出す。直接いじらない。
// 絵の中身から作った版番号。URLに付けて、古い絵が居座るのを防ぐ。
export const PLATE_ART_VERSION: Record<string, string> = {
  "01": "ff26da95b3",
  "02": "6c225c92bb",
  "03": "795627f0ed",
  "04": "afa44f46f9",
  "05": "3247bdfb15",
  "06": "d2bc0edcf2",
  "07": "b63797de72"
} as const;
