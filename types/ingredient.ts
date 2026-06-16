export interface Ingredient {
  id: string;
  name: string;
  safetyScore: number;
  benefits: string;
  risks: string;
  category?: string;
}