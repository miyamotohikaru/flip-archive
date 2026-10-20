/**
 * スタート画面を見たかどうかの記録。
 * layout（サーバー）からも読むので、"use client" の部品とは別に置く。
 */
export const INTRO_KEY = "flip-intro-seen";

/** スタート画面を開き直すときに投げる合図。ヘッダーの INTRO から送る。 */
export const INTRO_OPEN_EVENT = "flip:intro-open";

/** layout の <head> に置く。描画より前に、見たことがあるかを読んで html に印を付ける。 */
export const INTRO_PRELUDE = `try{if(localStorage.getItem("${INTRO_KEY}"))document.documentElement.classList.add("intro-seen")}catch(e){}`;
