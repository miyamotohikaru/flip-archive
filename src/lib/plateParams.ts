import type { Case } from "@/data/types";
import { seedFromString } from "./seed";

/**
 * CASEごとの作図プログラム番号。
 * 図版は共通のパターン生成器ではなく、事例ごとに別の図として描く。
 */
const PLATE_PROGRAM: Record<string, number> = {
  "taian-nijiriguchi": 0, // 立って入る開口が、身をかがめる寸法まで下がる
  "fountain-duchamp": 1, // 展示室に入らなかった量産品が、誌面の写真に置かれる
  "before-i-die": 2, // 壁に並ぶ同じ書き出しと空欄が、別々の筆跡で埋まる
  key4all: 3, // 一本だけだった鍵と車の線が、散らばる鍵すべてから引かれる
  "r-place": 4, // 空の格子が一画素ずつ埋まり、上書きと境界が現れる
  "love-is-in-the-bin": 5, // 額の中の一枚が、下半分だけ短冊になる
  "pokemon-go": 6, // 同じ街路に捕獲点が重なり、経路が寄り道で折れる
};

export function plateParamsFor(c: Case) {
  return {
    seed: seedFromString(c.slug),
    plate: PLATE_PROGRAM[c.slug] ?? 0,
  };
}
