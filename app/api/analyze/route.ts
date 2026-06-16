import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const ingredientNames = body.ingredients
    .split(",")
    .map((item: string) => item.trim());

  const matchedIngredients = await prisma.ingredient.findMany({
    where: {
      name: {
        in: ingredientNames,
      },
    },
  });

  const averageScore =
    matchedIngredients.reduce(
      (sum, ingredient) => sum + ingredient.safetyScore,
      0
    ) / (matchedIngredients.length || 1);

  return NextResponse.json({
    score: Math.round(averageScore),
    matchedIngredients,
  });
}