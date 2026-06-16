import { Ingredient } from "./ingredient";

export interface AnalysisResult {
  score: number;
  ingredients: Ingredient[];
}
