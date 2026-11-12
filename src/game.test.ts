import { describe, it, expect } from "@jest/globals"

describe("テスト環境の動作確認", () => {
  it("Jestが正常に動作する", () => {
    expect(1 + 1).toBe(2)
  });
});