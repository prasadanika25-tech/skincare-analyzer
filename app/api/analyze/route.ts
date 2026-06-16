import { NextResponse } from "next/server";
import { analyzeIngredients } from "@/services/analyzer.service";

export async function POST(request: Request) {
  const body = await request.json();

  const result = await analyzeIngredients(
    body.ingredients
  );

  return NextResponse.json(result);
}