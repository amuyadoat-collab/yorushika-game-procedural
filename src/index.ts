import "dotenv/config"; 
import { startCliGame } from "./cli.js";
import { PrismaClient } from "./generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  const cards = await prisma.card.findMany();
  if (cards.length === 0) {
    console.error("カードデータが空です。先に `npx prisma db seed` を実行してください。");
    process.exit(1);
  }
  await startCliGame(cards);
}

main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});