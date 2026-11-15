import { describe, test, expect } from "@jest/globals"
import type { Card } from "./generated/prisma/client.js";
import { canPlayCard, chooseCpuCard, dealCard } from "./game.js";

describe("MVP/CLI版 ロジック検証", () => {
  // ダミーカード
  const mockCards: Card[] = [
    { id: 1, rank: 1, music: "言って", album: "夏草が邪魔をする", init: "い", last: "て", artist: "ヨルシカ" },
    { id: 2, rank: 2, music: "ただ君に晴れ", album: "負け犬にアンコールはいらない", init: "た", last: "れ", artist: "ヨルシカ" },
    { id: 3, rank: 3, music: "爆弾魔", album: "負け犬にアンコールはいらない", init: "ば", last: "ま", artist: "ヨルシカ" },
    { id: 26, rank: 26, music: "テレパス", album: "テレパス", init: "て", last: "す", artist: "ヨルシカ" },
];
  describe("dealCard（手札配布））", () => {
    test("指定した枚数ずつ重複なく配られる", () => {
      // 指定した枚数のカードが配られるか      
      const { playerHands, cpuHands } = dealCard(mockCards, 2);
      expect(playerHands.length).toBe(2);
      expect(cpuHands.length).toBe(2);
      // 両者の手札に重複なくカードが配られたかどうか
      const allIds = [...playerHands, ...cpuHands].map((c) => c.id);
      expect(new Set(allIds).size).toBe(4);
    });
  });
  describe("canPlayCard（カード出し判定）", () => {
    test("場にカードがないとき FREE で出せる", () => {
      expect(canPlayCard(mockCards[0], null)).toBe("FREE");
    });
    test("場のカードよりランクが小さい（強い）場合は RANK で出せる", () => {
      expect(canPlayCard(mockCards[0], mockCards[1])).toBe("RANK");
    });
    test("しりとりが繋がる場合はランクが弱くても SHIRITORI で出せる", () => {
      expect(canPlayCard(mockCards[3], mockCards[0])).toBe("SHIRITORI");
    });
    test("同じアルバムの場合はランクが弱くても ALBUM で出せる", () => {
      expect(canPlayCard(mockCards[2], mockCards[1])).toBe("ALBUM");
    });
    test("どの条件も満たさない場合は null を返す", () => {
      expect(canPlayCard(mockCards[1], mockCards[0])).toBeNull();
    });
  });
  describe("chooseCpuCard（CPUのカード選択）", () => {
    test("カードが出せるとき、出したカードと理由を返す", () => {
      const cpuHands = mockCards.slice(1);
      const fieldCard = mockCards[0]
      const result = chooseCpuCard(cpuHands, fieldCard);
      expect(result?.card.music).toBe("テレパス");
      expect(result?.reason).toBe("SHIRITORI");
    });
    test("出せるカードがない場合は null を返す", () => {
      const cpuHands = mockCards.slice(1, 3);
      const fieldCard = mockCards[0];
      expect(chooseCpuCard(cpuHands, fieldCard)).toBeNull()
    });
  });
});