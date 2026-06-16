import { prisma } from "@/lib/prisma";

export async function analyzeIngredients(input: string) {
  const aliases: Record<string, string> = {
    "vitamin c": "ascorbic acid",
    "vitamin e": "tocopherol",
    "pro vitamin b5": "panthenol",
  };

  const ingredientNames = input
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0)
    .map((name) => aliases[name] || name);

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

  let riskLevel = "Low";

  if (averageScore < 70) {
    riskLevel = "High";
  } else if (averageScore < 90) {
    riskLevel = "Moderate";
  }

  let summary = "";

  if (riskLevel === "Low") {
    summary =
      "This product appears to contain mostly safe ingredients.";
  } else if (riskLevel === "Moderate") {
    summary =
      "This product contains a mix of beneficial and potentially irritating ingredients.";
  } else {
    summary =
      "This product contains ingredients that may increase the risk of irritation.";
  }

  let skinType = "All Skin Types";

  const ingredientText = matchedIngredients
    .map((ingredient) => ingredient.name.toLowerCase())
    .join(" ");

  if (
    ingredientText.includes("salicylic acid") ||
    ingredientText.includes("niacinamide")
  ) {
    skinType = "Oily Skin";
  }

  if (
    ingredientText.includes("glycerin") ||
    ingredientText.includes("hyaluronic acid") ||
    ingredientText.includes("ceramides")
  ) {
    skinType = "Dry Skin";
  }

  if (
    ingredientText.includes("panthenol") ||
    ingredientText.includes("allantoin") ||
    ingredientText.includes("aloe vera")
  ) {
    skinType = "Sensitive Skin";
  }

  const benefits = [
    ...new Set(
      matchedIngredients.map(
        (ingredient) => ingredient.benefits
      )
    ),
  ];

  const risks = [
    ...new Set(
      matchedIngredients.map(
        (ingredient) => ingredient.risks
      )
    ),
  ].filter(
    (risk) => risk.toLowerCase() !== "none"
  );

  return {
    score: Math.round(averageScore),
    riskLevel,
    skinType,
    summary,
    benefits,
    risks,
    matchedIngredients,
    foundCount: matchedIngredients.length,
    totalCount: ingredientNames.length,
    unknownIngredients,
  };
}