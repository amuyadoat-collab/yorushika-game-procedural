import { PrismaClient } from "../src/generated/prisma/client.js";
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();
// URL形式から、通常のファイル絶対パスに変換する
const __filename = fileURLToPath(import.meta.url); // "file:///src/card-seed.js" -> "/src/card-seed.js"
// ファイル名を除いた「フォルダ（ディレクトリ）のパス」を取得する
const __dirname = path.dirname(__filename); // "/src/card-seed.js" ->  "/src/"

async function main() {
  console.log('シードデータの登録を開始します...');

  // 1. パスを取得 csvファイルのパスを取得
  const csvPath = path.join(__dirname, 'songs.csv'); // "/src/songs.csv" 

  // 2. 存在チェック 取得したパスが存在するか同期的に検証
  if (!fs.existsSync(csvPath)) {
    throw new Error(`エラー: ${csvPath} が見つかりません。`);
  }

  // 3. CSVファイルの読み込みとパース 文字列として取得し配列に変換
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.split(/\r?\n/); // 正規表現を用いて、行ごとの配列に変換 [ 一行目, 二行目, ... ]
  // ヘッダー行を取得してスキップ
  const headers = lines[0].split(','); // [id, rank, music, ...]
  const dataLines = lines.slice(1); // [ 二行目, 三行目, ... ]

  // 4. データベースへ登録

  let createdCount = 0  // 登録されたデータの件数

  for (const line of dataLines) {
    // 空行はスキップ
    if (!line.trim()) continue;

    const values = line.split(','); // [1, 1, '言って', '夏草が邪魔をする', ...]

    const id = values[0]?.trim();
    const rank = values[1]?.trim();
    const music = values[2]?.trim();
    const album = values[3]?.trim();
    const init = values[4]?.trim();
    const last = values[5]?.trim();
    const artist = values[6]?.trim() || 'ヨルシカ';

    // 更新 or 新規作成
    await prisma.card.upsert({
      where: { id: parseInt(id, 10) },
      update: {
        rank: parseInt(rank, 10),
        music: music,
        album: album,
        init: init,
        last: last,
        artist: artist,
      },
      create: {
        id: parseInt(id, 10),
        rank: parseInt(rank, 10),
        music: music,
        album: album,
        init: init,
        last: last,
        artist: artist,
      },
    });

    createdCount++;
  }

  console.log(`シードデータ（Cardモデル: ${createdCount}件）の登録が完了しました。`);
}

// シード処理の実行
main()
.catch((e) => {
  console.error('シード処理中にエラーが発生しました:',e); // エラー内容を表示
  process.exit(1); // 異常終了（ステータスコード1）としてプログラムを強制終了
})
.finally(async () => {
  await prisma.$disconnect(); // データベースとの接続を切断
});
