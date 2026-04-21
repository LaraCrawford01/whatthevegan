import { z } from "zod";

const recipeCategories = [
  "Condiments",
  "Breakfast",
  "Lunch",
  "Dessert",
  "Snack",
  "Dinner",
  "Dip Sauce",
  "Soup",
] as const;

export const recipeInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(80, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  subtitle: z
    .string()
    .trim()
    .min(1, "Subtitle is required")
    .max(200, "Subtitle is too long"),
  image: z
    .string()
    .trim()
    .max(300, "Image path is too long")
    .optional()
    .transform((value) => value ?? ""),
  tags: z.array(z.string().trim().min(1)).min(1, "At least one tag is required"),
  prepTime: z.number().int().min(0, "Prep time cannot be negative"),
  cookTime: z.number().int().min(0, "Cook time cannot be negative"),
  servings: z.number().int().min(1, "Servings must be at least 1"),
  featured: z.boolean(),
  featuredOrder: z.number().int().min(1, "Featured order must be at least 1").nullable(),
  ingredients: z
    .array(z.string().trim().min(1))
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(z.string().trim().min(1))
    .min(1, "At least one instruction is required"),
  notes: z
    .string()
    .trim()
    .min(1, "Notes are required")
    .max(3000, "Notes are too long"),
  category: z.enum(recipeCategories, {
    error: "Please choose a valid category.",
  }),
}).superRefine((data, ctx) => {
  if (data.featured && data.featuredOrder === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["featuredOrder"],
      message: "Featured order is required when the recipe is featured.",
    });
  }
});

export type RecipeInput = z.infer<typeof recipeInputSchema>;
