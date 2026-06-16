import { prisma } from "@/lib/prisma";

export async function analyzeIngredients(input: string) {
  const ingredientNames = input
    .split(",")
    .map((item) => item.trim().toLowerCase());

  const allIngredients = await prisma.ingredient.findMany();

  const matchedIngredients = allIngredients.filter((ingredient) =>
    ingredientNames.includes(ingredient.name.toLowerCase())
  );

  const averageScore =
    matchedIngredients.reduce(
      (sum, ingredient) => sum + ingredient.safetyScore,
      0
    ) / (matchedIngredients.length || 1);

  return {
    score: Math.round(averageScore),
    matchedIngredients,
    foundCount: matchedIngredients.length,
    totalCount: ingredientNames.length,
  };
}