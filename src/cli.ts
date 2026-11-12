import { Card } from "./generated/prisma/client.js";
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { canPlayCard, chooseCpuCard, dealCard, formatCard, PlayReason } from "./game.js";

export async function startCliGame(allCards: Card[]): Promise<void> {
  const rl = readline.createInterface({ input, output });
  let { playerHands, cpuHands}:  { playerHands: Card[]; cpuHands: Card[] } = dealCard(allCards, 9);
  let fieldCard: Card | null = null;
  let isPlayerTurn = true;
  let turnNum = 1;

  while (playerHands.length > 0 && cpuHands.length > 0) {
    console.log("--------------------------------------------------")
    console.log(`${turnNum}回目`)
    console.log(`現在の場: ${fieldCard ? formatCard(fieldCard) : "なし（自由に出せます）"}`)
    console.log(`CPU残り手札: ${cpuHands.length}枚\n`);
    
    // あなたのターン
    if (isPlayerTurn) {
      
      console.log("あなたの手札:");
      playerHands.forEach((c,i) => console.log(`${i + 1}: ${formatCard(c)}`));
      console.log("0: パス（場を流す）");
      
      const answer = await rl.question("\n出すカードの番号を入力してください > ");
      const num = Number(answer.trim());

      // パスしたときの処理
      if (num === 0) {
        console.log("あなたはパスしました。場が流れます。\n");
        fieldCard = null; // 場が流れる
        isPlayerTurn = false; // ターンが変わる

      // パス以外の処理  
      } else {
        const selected = playerHands[num - 1];
        // 無効な選択時の処理
        if (!selected) {
          console.log("無効な番号です。もう一度選んでください。\n");
          await rl.question("[Enterキーを押して戻る]");
          continue;
        }
        const reason = canPlayCard(selected, fieldCard);
        // ルール違反の選択をしたときの処理
        if (!reason) {
          console.log("⚠️ そのカードは場に出せません！条件を確認してください。\n");
          await rl.question("[Enterキーを押して戻る]");
          continue;       
        }
        // 手札のカードが場に出たときの処理
        playerHands = playerHands.filter((c) => c.id !== selected.id); // 手札の更新
        fieldCard = selected; // 場の更新
        isPlayerTurn = false; // ターンが変わる

        console.log("\nあなたが出したカード:")
        console.log(`条件:${reason}\n${formatCard(selected)}\n`);
      }
    }
    // CPUのターン
    if (!isPlayerTurn) {
      const cpuPutCard:  {card: Card; reason: PlayReason } | null  = chooseCpuCard(cpuHands, fieldCard);
      if (!cpuPutCard) {
        console.log("CPUはパスしました。場が流れます。\n");
        fieldCard = null;  // 場が流れる       
      } else {
        cpuHands = cpuHands.filter((c) => c.id !== cpuPutCard.card.id);
        fieldCard = cpuPutCard.card;
        console.log("CPUが出したカード:")
        console.log(`条件:${cpuPutCard.reason}\n${formatCard(cpuPutCard.card)}\n`);
      }
      isPlayerTurn = true; // ターンが変わる
      turnNum++
    }
  }
  console.log("==================================================");
  console.log(playerHands.length === 0 ? "あなたの勝利です" : "CPUの勝利です")
  rl.close();
}