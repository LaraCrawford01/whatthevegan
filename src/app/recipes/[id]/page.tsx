import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import CategoryIcon from "@/components/CategoryIcon";

type Params = {
  params: Promise<{ id: string }>;
};

async function getRecipe(id: string) {
  await connectToDatabase();
  return Recipe.findById(id).lean();
}

export default async function RecipeDetailPage({ params }: Params) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-emerald-700">
            {recipe.category}
          </p>
          <h1 className="text-4xl font-bold text-emerald-700">{recipe.title}</h1>
          <p className="mt-2 text-zinc-600">{recipe.subtitle}</p>
        </div>
        <Link
          href={`/recipes/${recipe._id}/edit`}
          className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium hover:bg-zinc-100"
        >
          Edit
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {recipe.tags.map((tag: string) => (
          <span
            key={`${recipe._id}-${tag}`}
            className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-3">
        <div className="h-80 rounded-lg bg-mint/40 flex items-center justify-center">
          <CategoryIcon category={recipe.category} className="text-9xl text-avocado" />
        </div>
      </section>

      <div className="grid gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 md:grid-cols-3">
        <p>
          <span className="font-semibold">Prep:</span> {recipe.prepTime} min
        </p>
        <p>
          <span className="font-semibold">Cook:</span> {recipe.cookTime} min
        </p>
        <p>
          <span className="font-semibold">Servings:</span> {recipe.servings}
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-xl font-semibold">Ingredients</h2>
        <ul className="list-disc space-y-1 pl-5 text-zinc-700">
          {recipe.ingredients.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-xl font-semibold">Instructions</h2>
        <ol className="list-decimal space-y-2 pl-5 text-zinc-700">
          {recipe.instructions.map((step: string) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-2 text-xl font-semibold">Notes</h2>
        <p className="text-zinc-700">{recipe.notes}</p>
      </section>

      <Link href="/recipes" className="text-sm font-medium text-emerald-700 hover:underline">
        Back to recipes
      </Link>
    </main>
  );
}
