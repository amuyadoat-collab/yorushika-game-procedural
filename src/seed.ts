import { PrismaClient } from './generated/prisma/client.js';
import * as fs from 'fs'
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🌱 シードデータの登録を開始します...');

  // songs.csvのパスを設定
  const csvPath = path.join(__dirname, 'songs.csv');
  
  if (!fs.existsSync(csvPath)) {
    throw new Error(`エラー: ${csvPath} が見つかりません。`);
  }

  // CSVファイルの読み込みとパース
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.split(/\r?\n/);
  
  // ヘッダー行（id,rank,music,album,init,last,artistなど）を取得してスキップ
  const headers = lines[0].split(',');
  const dataLines = lines.slice(1);

  let createdCount = 0;

  for (const line of dataLines) {
    // 空行はスキップ
    if (!line.trim()) continue;

    // カンマ区切りで分割（簡易パース。値にカンマが含まれる場合は適宜調整してください）
    const values = line.split(',');
    
    // スキーマの定義に合わせてマッピング
    // id, rank, music, album, init, last, artist
    const id = values[0]?.trim();
    const rank = values[1]?.trim();
    const music = values[2]?.trim();
    const album = values[3]?.trim();
    const init = values[4]?.trim();
    const last = values[5]?.trim();
    const artist = values[6]?.trim() || 'ヨルシカ'; // デフォルト値

    if (!id || !music) continue;

    // データベースへの登録（重複エラーを防ぐため upsert を使用）
    await prisma.card.upsert({
      where: { id: id }, // もし id が String でなく Int の場合は parseInt(id, 10) に変更してください
      update: {
        rank,
        music,
        album,
        init,
        last,
        artist,
      },
      create: {
        id,
        rank,
        music,
        album,
        init,
        last,
        artist,
      },
    });

    createdCount++;
  }

  console.log(`✅ シードデータ（Cardモデル: ${createdCount}件）の登録が完了しました。`);
}

main()
  .catch((e) => {
    console.error('❌ シード処理中にエラーが発生しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
