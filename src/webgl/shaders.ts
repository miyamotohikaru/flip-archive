/**
 * CASE図版（PLATE）のシェーダー。
 *
 * 実物の写真は権利処理が必要なため、図鑑側の図版はすべて生成物とする。
 * ただし共通のパターン生成器で描き分けるのではなく、
 * **CASEごとに固有の作図プログラム**を持たせる。
 *
 * 各プログラムは《変容前の配置》と《配置操作の実行後》の二状態を持ち、
 * uProgress がそのあいだを移す。図版そのものが配置操作を実演する。
 */

export const plateVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const plateFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uSeed;
  uniform float uProgress;   // 配置操作の進行 0→1
  uniform float uPlate;      // どのCASEの作図プログラムか 0..6
  uniform float uFade;       // 帯の端でのフェード
  uniform float uAppear;     // 初回出現
  uniform vec2  uSize;       // 版面のワールド寸法
  uniform vec3  uPaper;
  uniform vec3  uInk;
  uniform vec3  uAccent;
  uniform float uGrain;
  uniform float uFocus;     // 帯の中で手前に読まれている版
  uniform sampler2D uLabel; // 版面に刷る事例名
  uniform float uLabelAspect;
  uniform float uHasLabel;
  uniform float uLabelScale;  // 版が小さく出る画面では、文字だけ大きくする

  varying vec2 vUv;

  const float PI = 3.14159265359;

  // ---- 描き味の共通量 ---------------------------------------------------
  float AA;                 // 1ピクセルぶんの作画単位
  float INK;                // 図のインク
  float ACC;                // 朱で差す部分
  float LIN;                // 補助線

  float hash11(float n) { return fract(sin(n * 127.1) * 43758.5453123); }
  float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y);
  }

  // ---- SDF -------------------------------------------------------------
  float sdBox(vec2 p, vec2 h) {
    vec2 d = abs(p) - h;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }
  float sdSeg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
  }
  float fillOf(float d) { return 1.0 - smoothstep(-AA, AA, d); }
  float strokeOf(float d, float w) { return 1.0 - smoothstep(w - AA, w + AA, abs(d)); }

  float box(vec2 p, vec2 c, vec2 h) { return fillOf(sdBox(p - c, h)); }
  float frame(vec2 p, vec2 c, vec2 h, float w) { return strokeOf(sdBox(p - c, h), w); }
  float seg(vec2 p, vec2 a, vec2 b, float w) { return strokeOf(sdSeg(p, a, b), w); }
  float ring(vec2 p, vec2 c, float r, float w) { return strokeOf(length(p - c) - r, w); }
  float dashed(vec2 p, vec2 c, vec2 h, float w, float period) {
    return frame(p, c, h, w) * step(0.42, fract((p.x + p.y) * period));
  }

  // 版面の作画領域
  const vec2 AREA_H = vec2(0.290, 0.370);
  const vec2 AREA_C = vec2(0.0, -0.010);

  // ======================================================================
  // 01 待庵の躙口 — 入口の寸法が、身体の振る舞いを変える
  //   変容前: 立って通れる開口。直立のまま、広い床へ入る。
  //   実行後: 開口が膝の高さまで下がり、身体が折れ、床が二畳に締まる。
  // ======================================================================
  void plateNijiri(vec2 p, float t) {
    float ground = -0.286;
    float wx = -0.060;          // 壁の位置
    float wt = 0.013;           // 壁の厚み

    // 外と内をつなぐ地面
    LIN += seg(p, vec2(-0.290, ground), vec2(0.290, ground), 0.0016);

    // 室内。天井が下がり、床が二畳に締まる。
    float ceil = mix(0.300, 0.166, t);
    float back = mix(0.290, 0.196, t);
    INK += box(p, vec2((wx + back) * 0.5, (ground + ceil) * 0.5),
                  vec2((back - wx) * 0.5, (ceil - ground) * 0.5)) * 0.055;
    LIN += seg(p, vec2(wx, ceil), vec2(back, ceil), 0.0013);
    LIN += seg(p, vec2(back, ground), vec2(back, ceil), 0.0013);

    // 畳。実行後に二枚だけ敷かれる。
    for (int i = 0; i < 2; i++) {
      float fi = float(i);
      vec2 c = vec2(0.008 + fi * 0.122, ground + 0.022);
      LIN += frame(p, c, vec2(0.058, 0.018), 0.0013) * t;
      INK += box(p, c, vec2(0.058, 0.018)) * t * 0.08;
    }

    // 壁。開口のぶんだけ抜く。
    float wallTop = 0.300;
    float openH = mix(0.128, 0.040, t);            // 開口の半分の高さ
    float openY = mix(ground + 0.132, ground + 0.050, t);
    float wall = box(p, vec2(wx, (ground + wallTop) * 0.5),
                        vec2(wt, (wallTop - ground) * 0.5));
    float hole = box(p, vec2(wx, openY), vec2(wt + 0.004, openH));
    INK += max(wall - hole, 0.0) * 0.30;
    LIN += (strokeOf(sdBox(p - vec2(wx, (ground + wallTop) * 0.5),
                           vec2(wt, (wallTop - ground) * 0.5)), 0.0013)
            ) * max(1.0 - hole, 0.0);
    // 鴨居と敷居。開口の上下を朱で押さえる。
    ACC += seg(p, vec2(wx - wt - 0.004, openY + openH),
                  vec2(wx + wt + 0.004, openY + openH), 0.0022);
    ACC += seg(p, vec2(wx - wt - 0.004, openY - openH),
                  vec2(wx + wt + 0.004, openY - openH), 0.0022);

    // 開口の高さを測る寸法線
    float mx = wx + 0.052;
    LIN += seg(p, vec2(mx, openY - openH), vec2(mx, openY + openH), 0.0009);
    LIN += seg(p, vec2(mx - 0.008, openY + openH), vec2(mx + 0.008, openY + openH), 0.0009);
    LIN += seg(p, vec2(mx - 0.008, openY - openH), vec2(mx + 0.008, openY - openH), 0.0009);

    // 客。直立のまま通れる姿勢から、身をかがめる姿勢へ。
    float sx = mix(-0.196, -0.150, t);
    vec2 foot = vec2(sx, ground);
    vec2 hip = foot + mix(vec2(0.0, 0.104), vec2(0.010, 0.052), t);
    vec2 neck = hip + mix(vec2(0.0, 0.098), vec2(0.060, 0.026), t);
    vec2 head = neck + mix(vec2(0.0, 0.036), vec2(0.030, 0.006), t);
    // 脚
    vec2 knee = mix(foot + vec2(0.002, 0.052), foot + vec2(0.030, 0.030), t);
    INK += seg(p, foot, knee, 0.0110);
    INK += seg(p, knee, hip, 0.0110);
    // 胴と腕
    INK += seg(p, hip, neck, 0.0145);
    INK += seg(p, neck, neck + mix(vec2(0.010, -0.058), vec2(0.046, -0.030), t), 0.0080);
    // 頭
    INK += fillOf(length(p - head) - 0.025);

    // 外の敷石。露地から躙口へ寄る。
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      vec2 c = vec2(-0.252 + fi * 0.060, ground - 0.030);
      LIN += frame(p, c, vec2(0.022, 0.010), 0.0011);
    }
  }

  // ======================================================================
  // 02 《泉》 — 出品と、展示見送りと、誌面
  //   変容前: 展示室の枠に作品が整列し、外に量産品がひとつ置かれている。
  //   実行後: 量産品は枠へ入らず、写真と記事として誌面の側に置かれる。
  // ======================================================================
  void plateFountain(vec2 p, float t) {
    // 展示室
    vec2 rc = vec2(-0.028, 0.170);
    vec2 rh = vec2(0.196, 0.152);
    LIN += frame(p, rc, rh, 0.0016);
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      float col = mod(fi, 4.0), row = floor(fi / 4.0);
      vec2 c = rc + vec2((col - 1.5) * 0.098, 0.068 - row * 0.130);
      float hh = 0.028 + 0.018 * hash11(fi * 3.1 + uSeed);
      INK += box(p, c, vec2(0.026, hh));
    }
    // 空いたままの一区画。除外の決定がここに残る。
    vec2 slot = rc + vec2(1.5 * 0.098, -0.062);
    LIN += dashed(p, slot, vec2(0.040, 0.046), 0.0013, 46.0);
    ACC += (seg(p, slot + vec2(-0.026, -0.030), slot + vec2(0.026, 0.030), 0.0016)
          + seg(p, slot + vec2(-0.026, 0.030), slot + vec2(0.026, -0.030), 0.0016)) * t;

    // 誌面。写真の枠と、本文の段。
    vec2 pc = vec2(0.010, -0.212);
    vec2 ph = vec2(0.196, 0.140);
    LIN += frame(p, pc, ph, 0.0014) * t;
    INK += box(p, pc, ph) * t * 0.05;
    for (int i = 0; i < 7; i++) {
      float y = pc.y - 0.100 + float(i) * 0.024;
      float w = 0.070 - 0.004 * hash11(float(i) * 2.3 + uSeed);
      LIN += seg(p, vec2(pc.x + 0.046, y), vec2(pc.x + 0.046 + w * 2.0, y), 0.0010) * t;
    }

    // 量産品。枠の外から、誌面の写真の中へ。
    vec2 from = vec2(0.222, 0.026);
    vec2 to = pc + vec2(-0.104, 0.024);
    vec2 c = mix(from, to, t);
    float body = box(p, c, vec2(0.040, 0.027));
    body += box(p, c + vec2(0.0, 0.032), vec2(0.026, 0.009));
    INK += body;
    ACC += body * t;
    LIN += frame(p, c, vec2(0.056, 0.052), 0.0013) * t;
    LIN += seg(p, c + vec2(-0.048, -0.031), c + vec2(0.048, -0.031), 0.0012);
  }

  // ======================================================================
  // 03 Before I Die — 同じ書き出しと、空欄
  //   変容前: 壁に、同じ書き出しの行と空欄だけが規則的に並ぶ。
  //   実行後: 空欄が別々の筆跡で埋まり、隣の行へ返す言葉が現れる。
  // ======================================================================
  void plateWall(vec2 p, float t) {
    LIN += frame(p, AREA_C, AREA_H, 0.0014);
    INK += box(p, AREA_C, AREA_H) * 0.07;

    for (int r = 0; r < 8; r++) {
      float fr = float(r);
      float y = 0.306 - fr * 0.084;
      for (int k = 0; k < 2; k++) {
        float fk = float(k);
        float x0 = -0.258 + fk * 0.274;

        // 印刷された書き出し。どの行でも同じ長さ。
        INK += box(p, vec2(x0 + 0.040, y + 0.016), vec2(0.040, 0.0052)) * 0.72;
        // 空欄の罫
        LIN += seg(p, vec2(x0, y - 0.010), vec2(x0 + 0.232, y - 0.010), 0.0011);

        // 書き込まれた手。行ごとに長さも高さも揃わない。
        float h = hash11(fr * 5.7 + fk * 2.3 + uSeed);
        float on = smoothstep(h * 0.55, h * 0.55 + 0.30, t) * step(0.14, h);
        float w = 0.050 + 0.150 * hash11(fr * 3.1 + fk * 7.9 + uSeed);
        for (int s = 0; s < 7; s++) {
          float fs = float(s);
          if (fs * 0.030 > w) break;
          float jitter = (hash11(fr * 11.0 + fk * 3.0 + fs + uSeed) - 0.5) * 0.010;
          vec2 a = vec2(x0 + 0.004 + fs * 0.030, y - 0.002 + jitter);
          vec2 b = vec2(a.x + 0.022, y - 0.002 - jitter);
          INK += seg(p, a, b, 0.0022) * on;
        }
      }
    }

    // 先に書かれた答えへ、次の人が返す矢印。
    vec2 a0 = vec2(-0.084, 0.222);
    vec2 a1 = vec2(0.020, 0.060);
    ACC += seg(p, a0, a1, 0.0015) * smoothstep(0.55, 0.95, t);
    ACC += seg(p, a1, a1 + vec2(-0.016, 0.018), 0.0015) * smoothstep(0.65, 0.95, t);
    ACC += seg(p, a1, a1 + vec2(0.006, 0.024), 0.0015) * smoothstep(0.65, 0.95, t);
  }

  // ======================================================================
  // 04 Key4All — 同じ一台へ、大勢の鍵
  //   変容前: 一台の車に、一本の鍵だけが結ばれている。
  //   実行後: 散らばる鍵すべてが同じ一台へ結ばれ、車の位置が動く。
  // ======================================================================
  void plateKeys(vec2 p, float t) {
    // 車。実行後には位置が変わり、元の位置には破線が残る。
    vec2 carFrom = vec2(-0.120, 0.086);
    vec2 carTo = vec2(0.112, -0.118);
    vec2 car = mix(carFrom, carTo, t);
    LIN += dashed(p, carFrom, vec2(0.062, 0.030), 0.0012, 44.0) * t;
    ACC += seg(p, carFrom, car, 0.0012) * t * 0.7;

    // 鍵。円周に散らす。
    for (int i = 0; i < 11; i++) {
      float fi = float(i);
      float a = fi / 11.0 * 6.2831 + 0.4 + hash11(fi + uSeed) * 0.22;
      float rad = 0.276 + 0.048 * hash11(fi * 3.3 + uSeed);
      vec2 k = vec2(cos(a) * rad * 0.86, sin(a) * rad);

      // 鍵の形。輪と、刻みのある軸。
      LIN += ring(p, k, 0.013, 0.0013);
      vec2 dir = normalize(car - k);
      INK += seg(p, k + dir * 0.012, k + dir * 0.036, 0.0024);
      INK += seg(p, k + dir * 0.030, k + dir * 0.030 + vec2(-dir.y, dir.x) * 0.010, 0.0022);

      // 車へ結ぶ線。変容前は一本だけ。
      float link = (i == 0) ? 1.0 : t * smoothstep(fi / 14.0, fi / 14.0 + 0.45, t);
      float w = (i == 0) ? 0.0013 : 0.0011;
      LIN += seg(p, k + dir * 0.040, car - dir * 0.062, w) * link;
    }

    // 車体
    INK += box(p, car, vec2(0.062, 0.022));
    INK += box(p, car + vec2(-0.004, 0.026), vec2(0.036, 0.016));
    LIN += ring(p, car + vec2(-0.040, -0.026), 0.013, 0.0016);
    LIN += ring(p, car + vec2(0.040, -0.026), 0.013, 0.0016);
    ACC += frame(p, car, vec2(0.082, 0.058), 0.0013) * t;
  }

  // ======================================================================
  // 05 r/place — 一画素ずつ、同じ画面へ
  //   変容前: 空の格子。置けるのは一画素で、次まで待つ。
  //   実行後: 画素が埋まり、上書きの跡と、隣り合う図柄の境界が現れる。
  // ======================================================================
  void plateCanvas(vec2 p, float t) {
    vec2 gh = vec2(0.268, 0.268);
    vec2 gc = vec2(0.0, 0.046);
    LIN += frame(p, gc, gh, 0.0014);

    float n = 14.0;
    float cell = gh.x * 2.0 / n;

    // 格子
    for (int i = 1; i < 14; i++) {
      float d = -gh.x + float(i) * cell;
      LIN += seg(p, vec2(gc.x + d, gc.y - gh.y), vec2(gc.x + d, gc.y + gh.y), 0.0006) * 0.5;
      LIN += seg(p, vec2(gc.x - gh.x, gc.y + d), vec2(gc.x + gh.x, gc.y + d), 0.0006) * 0.5;
    }

    // 画素。一枚ずつ置かれ、一部は上書きされる。
    for (int y = 0; y < 14; y++) {
      for (int x = 0; x < 14; x++) {
        float fx = float(x), fy = float(y);
        float h = hash21(vec2(fx, fy) + uSeed);
        if (h < 0.34) continue;
        float order = hash21(vec2(fy, fx) * 1.7 + uSeed);
        float on = smoothstep(order * 0.72, order * 0.72 + 0.26, t);
        vec2 c = gc + vec2(-gh.x + (fx + 0.5) * cell, -gh.y + (fy + 0.5) * cell);
        float sq = box(p, c, vec2(cell * 0.5 - 0.0012, cell * 0.5 - 0.0012));
        // 上書きされた画素は、下の層が残って薄く見える
        float over = step(0.86, h);
        INK += sq * on * mix(0.88, 0.34, over);
        LIN += frame(p, c, vec2(cell * 0.5 - 0.0012, cell * 0.5 - 0.0012), 0.0010) * on * over;
      }
    }

    // 隣り合う図柄のあいだに引かれた境界。誰も指示していない線。
    float grow = smoothstep(0.45, 1.0, t);
    ACC += seg(p, gc + vec2(-0.268, 0.070), gc + vec2(-0.038, 0.070), 0.0018) * grow;
    ACC += seg(p, gc + vec2(-0.038, 0.070), gc + vec2(-0.038, -0.268), 0.0018) * grow;
    ACC += seg(p, gc + vec2(0.114, 0.268), gc + vec2(0.114, -0.106), 0.0018) * grow;

    // 待機。次の一画素まで置けない時間。
    LIN += seg(p, vec2(-0.268, -0.330), vec2(0.268, -0.330), 0.0010);
    float wait = mix(0.0, 0.536, fract(t * 1.6));
    ACC += seg(p, vec2(-0.268, -0.330), vec2(-0.268 + wait, -0.330), 0.0020) * t;
    for (int i = 0; i < 6; i++) {
      float x = -0.268 + float(i) * 0.1072;
      LIN += seg(p, vec2(x, -0.330), vec2(x, -0.316), 0.0009);
    }
  }

  // ======================================================================
  // 06 Love is in the Bin — 額の中の裁断
  //   変容前: 額に収まった一枚。落札の記録が並ぶ。
  //   実行後: 下半分が短冊になり、額の内側に残る。
  // ======================================================================
  void plateShred(vec2 p, float t) {
    vec2 fc = vec2(0.0, 0.030);
    vec2 fh = vec2(0.205, 0.230);
    float cut = fc.y + 0.010;

    // 上半分は残る
    INK += box(p, vec2(fc.x, (cut + fc.y + fh.y - 0.020) * 0.5),
                  vec2(fh.x - 0.026, (fc.y + fh.y - 0.020 - cut) * 0.5)) * 0.88;

    // 下半分。変容前は一枚の面、実行後だけ短冊に割れる。
    float hLow = (cut - (fc.y - fh.y + 0.020)) * 0.5;
    vec2 cLow = vec2(fc.x, (cut + fc.y - fh.y + 0.020) * 0.5);
    INK += box(p, cLow, vec2(fh.x - 0.026, hLow)) * 0.88 * (1.0 - t);
    for (int i = 0; i < 13; i++) {
      float fi = float(i);
      float x = fc.x - 0.1656 + fi * 0.0276;
      float drop = (0.026 + 0.048 * hash11(fi * 4.1 + uSeed)) * t;
      vec2 c = vec2(x, cLow.y - drop);
      INK += box(p, c, vec2(0.0104, hLow)) * 0.88 * t;
    }

    // 裁断の線
    ACC += seg(p, vec2(fc.x - fh.x + 0.020, cut), vec2(fc.x + fh.x - 0.020, cut), 0.0018) * t;

    // 額の下に開いた口
    LIN += seg(p, vec2(fc.x - 0.176, fc.y - fh.y + 0.020),
                  vec2(fc.x + 0.176, fc.y - fh.y + 0.020), 0.0013) * t;

    // 額。短冊より手前に描く。
    LIN += frame(p, fc, fh, 0.0026);
    LIN += frame(p, fc, fh - 0.014, 0.0010);

    // 落札の記録
    LIN += seg(p, vec2(-0.24, -0.320), vec2(0.24, -0.320), 0.0009);
    INK += box(p, vec2(-0.180, -0.300), vec2(0.038, 0.008));
    ACC += box(p, vec2(0.075, -0.300), vec2(0.145, 0.010)) * t;
  }

  // ======================================================================
  // 07 Pokémon GO — 同じ街路に、別の目的が重なる
  //   変容前: 街区の格子を、目的地へまっすぐ抜ける経路。
  //   実行後: 同じ格子に捕獲点と補給地点が重なり、経路が寄り道で折れる。
  // ======================================================================
  void plateStreets(vec2 p, float t) {
    LIN += frame(p, AREA_C, AREA_H, 0.0012) * 0.6;

    // 街区。道路は変えない。
    for (int i = 0; i < 5; i++) {
      float x = -0.232 + float(i) * 0.116;
      LIN += seg(p, vec2(x, -0.372), vec2(x, 0.352), 0.0013);
    }
    for (int i = 0; i < 6; i++) {
      float y = -0.330 + float(i) * 0.136;
      LIN += seg(p, vec2(-0.290, y), vec2(0.290, y), 0.0013);
    }
    // 街区の内側
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 5; j++) {
        vec2 c = vec2(-0.174 + float(i) * 0.116, -0.262 + float(j) * 0.136);
        INK += box(p, c, vec2(0.046, 0.052)) * 0.07;
      }
    }

    // 出発点と目的地。どちらも動かない。
    vec2 a = vec2(-0.232, -0.330);
    vec2 b = vec2(0.232, 0.352);
    INK += box(p, a, vec2(0.014, 0.014));
    LIN += ring(p, b, 0.020, 0.0014);
    INK += box(p, b, vec2(0.009, 0.009));

    // 重なる目的。捕獲点と補給地点。
    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      float gx = floor(hash11(fi * 2.7 + uSeed) * 5.0);
      float gy = floor(hash11(fi * 5.3 + uSeed) * 6.0);
      vec2 c = vec2(-0.232 + gx * 0.116, -0.330 + gy * 0.136)
             + vec2((hash11(fi * 7.1 + uSeed) - 0.5) * 0.070, 0.0);
      float on = smoothstep(fi / 12.0, fi / 12.0 + 0.40, t);
      float kind = step(0.62, hash11(fi * 9.7 + uSeed));
      // 捕獲点は朱の小円、補給地点は抜きの角
      ACC += fillOf(length(p - c) - 0.0105) * on * (1.0 - kind);
      LIN += frame(p, c, vec2(0.014, 0.014), 0.0014) * on * kind;
      LIN += ring(p, c, 0.030, 0.0008) * on * 0.5;
    }

    // 経路。まっすぐ抜ける道筋から、寄り道で折れる道筋へ。
    for (int i = 0; i < 20; i++) {
      float s = float(i) / 19.0;
      // 変容前: 街路に沿って最短で抜ける
      vec2 d0 = vec2(mix(a.x, b.x, clamp(s * 1.6, 0.0, 1.0)),
                     mix(a.y, b.y, clamp((s - 0.38) * 1.6, 0.0, 1.0)));
      // 実行後: 同じ格子の上で、寄り道して進む
      float w = sin(s * 9.4 + uSeed) * 0.098;
      vec2 d1 = vec2(mix(a.x, b.x, s) + w, mix(a.y, b.y, s) - w * 0.62);
      vec2 c = mix(d0, d1, t);
      INK += box(p, c, vec2(0.0075, 0.0075)) * 0.8;
    }
  }

  // ======================================================================
  void main() {
    float ar = uSize.x / uSize.y;
    vec2 p = vUv - 0.5;
    vec2 pa = vec2(p.x * ar, p.y);

    AA = fwidth(pa.x) * 0.85 + 1e-6;

    float t = uProgress;
    float te = t * t * (3.0 - 2.0 * t);

    INK = 0.0; ACC = 0.0; LIN = 0.0;

    float id = uPlate;
    if      (id < 0.5) plateNijiri(pa, te);
    else if (id < 1.5) plateFountain(pa, te);
    else if (id < 2.5) plateWall(pa, te);
    else if (id < 3.5) plateKeys(pa, te);
    else if (id < 4.5) plateCanvas(pa, te);
    else if (id < 5.5) plateShred(pa, te);
    else               plateStreets(pa, te);

    // ---- 紙 ----
    vec3 col = uPaper;
    float grain = vnoise(vUv * 430.0) * 0.55 + vnoise(vUv * 1150.0) * 0.45;
    col -= (grain - 0.5) * uGrain;
    col -= (vnoise(vUv * 3.0 + uSeed * 3.0) - 0.5) * 0.014;

    // ---- 版面の柱 ----
    float hx = 0.5 * ar - 0.040;
    float hy = 0.462;

    float head = box(pa, vec2(-hx + 0.026, hy - 0.020), vec2(0.026, 0.0072));
    // 版番号を刻む。図版ごとに本数が変わる。
    for (int k = 0; k < 7; k++) {
      float on = step(float(k), uPlate);
      float gap = step(5.0, float(k)) * 0.010;
      head += box(pa, vec2(-hx + 0.068 + float(k) * 0.0125 + gap, hy - 0.020),
                  vec2(0.0042, 0.0072)) * on;
    }
    head *= 1.0 - uHasLabel;   // 名前を刷る版では、刻みに代えて名前を置く

    // 版面の名前。左上の柱に、通し番号と事例名を刷る。
    float label = 0.0;
    if (uHasLabel > 0.5) {
      float lh = 0.034 * uLabelScale;
      float lw = lh * uLabelAspect;
      vec2 luv = (pa - vec2(-hx + 0.012, hy - 0.020 - lh * 0.5)) / vec2(lw, lh);
      if (luv.x > 0.0 && luv.x < 1.0 && luv.y > 0.0 && luv.y < 1.0) {
        label = smoothstep(0.12, 0.62, texture2D(uLabel, luv).a);
      }
    }
    float headRule = seg(pa, vec2(-hx, hy - 0.048), vec2(hx, hy - 0.048), 0.0008);

    float scaleBar = seg(pa, vec2(hx - 0.116, -hy + 0.024), vec2(hx, -hy + 0.024), 0.0008);
    float divs = 2.0 + mod(uPlate, 4.0);
    for (int k = 0; k < 6; k++) {
      if (float(k) > divs) break;
      float fx = hx - 0.116 + float(k) * (0.116 / divs);
      scaleBar += seg(pa, vec2(fx, -hy + 0.024), vec2(fx, -hy + 0.038), 0.0008);
    }

    // 四隅のトンボ
    vec2 th = vec2(hx, hy);
    vec2 aq = abs(pa);
    float ticks = strokeOf(aq.y - th.y, 0.0011) * step(aq.x, th.x) * step(th.x - 0.046, aq.x)
                + strokeOf(aq.x - th.x, 0.0011) * step(aq.y, th.y) * step(th.y - 0.046, aq.y);

    LIN += headRule * 0.55 + clamp(scaleBar, 0.0, 1.0) * 0.6;

    // ---- 合成 ----
    col = mix(col, uInk, clamp(INK, 0.0, 1.0) * 0.92);
    col = mix(col, uInk, clamp(LIN, 0.0, 1.0) * 0.62);
    col = mix(col, uInk, clamp(head, 0.0, 1.0) * 0.90);
    col = mix(col, uInk, clamp(label, 0.0, 1.0) * 0.92);
    col = mix(col, uInk, clamp(ticks, 0.0, 1.0) * 0.34);
    col = mix(col, uAccent, clamp(ACC, 0.0, 1.0) * 0.94);

    // 帯の中で「いまどの版の話か」を示す小さな鉤
    float mk = strokeOf(sdSeg(pa, vec2(-hx, hy), vec2(-hx + 0.030, hy)), 0.0020)
             + strokeOf(sdSeg(pa, vec2(-hx, hy), vec2(-hx, hy - 0.030)), 0.0020);
    col = mix(col, uAccent, clamp(mk, 0.0, 1.0) * uFocus);

    // ---- 版の小口 ----
    vec2 hs = vec2(0.5 * ar, 0.5);
    float sd = sdBox(pa, hs);
    float alpha = 1.0 - smoothstep(-AA, AA, sd);
    col = mix(col, uInk, (1.0 - smoothstep(0.0, 0.0032, -sd)) * 0.16);

    alpha *= uFade * uAppear;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

/** 版の落ち影。板が空間に浮いていることを地の側で示す。 */
export const shadowVertexShader = plateVertexShader;

export const shadowFragmentShader = /* glsl */ `
  precision highp float;
  uniform vec2 uSize;      // 影の板の寸法
  uniform vec2 uPlate;     // 版面の寸法
  uniform float uFade;
  uniform float uAppear;
  varying vec2 vUv;

  float sdBox(vec2 p, vec2 h) {
    vec2 d = abs(p) - h;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    // 右下へわずかに落とす
    float d = sdBox(p - vec2(0.012, -0.016), uPlate * 0.5);
    float a = (1.0 - smoothstep(0.0, 0.075, d)) * 0.20;
    a *= uFade * uAppear;
    if (a < 0.002) discard;
    gl_FragColor = vec4(0.07, 0.065, 0.06, a);
  }
`;
