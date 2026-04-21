import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import RecipeForm from "@/components/RecipeForm";

type Params = {
  params: Promise<{ id: string }>;
};

async function getRecipe(id: string) {
  await connectToDatabase();
  return Recipe.findById(id).lean();
}

export default async function EditRecipePage({ params }: Params) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-700">Edit recipe</h1>
        <p className="text-zinc-600">Update your saved vegan recipe details.</p>
      </div>

      <RecipeForm
        mode="edit"
        recipeId={id}
        initialValues={{
          slug: recipe.slug,
          title: recipe.title,
          subtitle: recipe.subtitle,
          tagsText: recipe.tags.join(", "),
          prepTime: String(recipe.prepTime),
          cookTime: String(recipe.cookTime),
          servings: String(recipe.servings),
          featured: Boolean(recipe.featured),
          featuredOrder: recipe.featuredOrder ? String(recipe.featuredOrder) : "",
          ingredientsText: recipe.ingredients.join("\n"),
          instructionsText: recipe.instructions.join("\n"),
          notes: recipe.notes,
          category: recipe.category,
        }}
      />

      <Link href="/recipes" className="text-sm font-medium text-emerald-700 hover:underline">
        Back to recipes
      </Link>
    </main>
  );
}
