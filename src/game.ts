import type { Card } from "./generated/prisma/client.js";

export type PlayReason = "FREE" | "RANK" | "SHIRITORI" | "ALBUM";

/** 山札をシャッフルして手札を配る */
export function dealCard(allCards: Card[], handSize = 9): { playerHands: Card[]; cpuHands: Card[] } {
  const deck = [...allCards] // 元の配列を壊さないためにシャローコピー
  .map(card => ({ card: card, score: Math.random()})) // 各カードにランダムな数値を付与
  .sort((a, b) => a.score - b.score) // その数値でソート
  .map(({ card }) => card); // カードだけを取り出す

  return { 
    playerHands: deck.slice(0, handSize),
    cpuHands: deck.slice(handSize, handSize*2)}
}

/** カードが場に出せるか判定 出せる場合は理由を返す */
export function canPlayCard(card: Card, fieldCard: Card | null): PlayReason | null {
  if (!fieldCard) return "FREE";
  if (card.rank <= fieldCard.rank)  return "RANK";
  if (card.init === fieldCard.last) return "SHIRITORI";
  if (card.album === fieldCard.album) return "ALBUM";
  return null
}

/** CPUの手札から最初に出せる1枚を選ぶ（なければ null） */
export function chooseCpuCard(cpuHands: Card[], fieldCard: Card | null): { card: Card; reason: PlayReason } | null {
  for ( const card of cpuHands ) {
    const reason: PlayReason | null = canPlayCard(card, fieldCard)
    if (reason) return { card, reason } 
  }
  return null;
}

export function formatCard(card: Card): string {
  return `[Rank:${String(card.rank).padStart(2, '0')}] ${card.music} ${card.album}`
}