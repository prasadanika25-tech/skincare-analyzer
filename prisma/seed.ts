import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";

const prisma = new PrismaClient();

async function main() {
  const results: any[] = [];

  fs.createReadStream("data/ingredients.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const ingredient of results) {
        await prisma.ingredient.upsert({
          where: {
            name: ingredient.name,
          },
          update: {},
          create: {
            name: ingredient.name,
            safetyScore: Number(ingredient.safetyScore),
            benefits: ingredient.benefits,
            risks: ingredient.risks,
            category: ingredient.category,
          },
        });
      }

      console.log(`✅ ${results.length} ingredients processed`);
      await prisma.$disconnect();
    });
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});