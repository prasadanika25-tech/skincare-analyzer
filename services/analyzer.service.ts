import { prisma } from "@/lib/prisma";

export async function analyzeIngredients(input: string) {
  const ingredientNames = input
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);

  const allIngredients = await prisma.ingredient.findMany();

  const matchedIngredients = allIngredients.filter((ingredient) =>
    ingredientNames.includes(ingredient.name.toLowerCase())
  );

  const averageScore =
    matchedIngredients.reduce(
      (sum, ingredient) => sum + ingredient.safetyScore,
      0
    ) / (matchedIngredients.length || 1);

  const foundNames = matchedIngredients.map(
    (ingredient) => ingredient.name.toLowerCase()
  );

  const unknownIngredients = ingredientNames.filter(
    (name) => !foundNames.includes(name)
  );

  return {
    score: Math.round(averageScore),
    matchedIngredients,
    foundCount: matchedIngredients.length,
    totalCount: ingredientNames.length,
    unknownIngredients,
  };
}