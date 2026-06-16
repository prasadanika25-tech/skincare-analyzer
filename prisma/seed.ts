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
        await prisma.ingredient.create({
          data: {
            name: ingredient.name,
            safetyScore: Number(ingredient.safetyScore),
            benefits: ingredient.benefits,
            risks: ingredient.risks,
            category: ingredient.category,
          },
        });
      }

      console.log("Ingredients inserted!");
      await prisma.$disconnect();
    });
}

main();