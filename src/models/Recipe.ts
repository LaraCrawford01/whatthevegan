import { Schema, model, models } from "mongoose";

export type RecipeDocument = {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
  tags: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  featured: boolean;
  featuredOrder: number | null;
  ingredients: string[];
  instructions: string[];
  notes: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

const recipeSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    image: { type: String, trim: true, default: "" },
    tags: { type: [String], required: true },
    prepTime: { type: Number, required: true, min: 0 },
    cookTime: { type: Number, required: true, min: 0 },
    servings: { type: Number, required: true, min: 1 },
    featured: { type: Boolean, required: true, default: false },
    featuredOrder: { type: Number, default: null },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    notes: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

const Recipe = models.Recipe || model("Recipe", recipeSchema);

export default Recipe;
