import Link from "next/link";
import { cookies } from "next/headers";
import { isAdminFromCookieStore } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe, { RecipeDocument } from "@/models/Recipe";
import CategoryIcon from "@/components/CategoryIcon";

async function getRecipes() {
  await connectToDatabase();
  const recipes = (await Recipe.find().sort({ updatedAt: -1 }).lean()) as RecipeDocument[];
  return recipes;
}

export default async function RecipesPage() {
  const cookieStore = await cookies();
  const isAdmin = isAdminFromCookieStore(cookieStore);
  const recipes = await getRecipes();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-4xl font-semibold font-mono">All recipes</h1>
        <div className="flex items-center gap-4">
        <Link href="/" className="rounded-lg bg-lime px-4 py-2 font-medium text-white transition hover:bg-emerald-700">
          <p className="text-white">Home</p>
        </Link>
        {isAdmin ? (
          <Link
            href="/recipes/new"
            className="rounded-lg bg-lime px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
          >
            <p className="text-white">Add recipe</p>
          </Link>
        ) : (
          <Link
            href="/admin?next=/recipes/new"
            className="rounded-lg border border-emerald-600 px-4 py-2 font-medium text-emerald-700 transition hover:bg-emerald-50"
          >
            Admin login
          </Link>
        )}
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-zinc-600">
          No recipes yet. Add your first vegan recipe.
        </div>
      ) : (
        <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <article
              key={recipe._id}
              className="group rounded-xl bg-background overflow-hidden hover:border-accent/60 transition shadow-lg"
            >
              <Link href={`/recipes/${recipe._id}`}>
                <div className="h-64 bg-mint/40 flex items-center justify-center">
                  <CategoryIcon category={recipe.category} className="text-8xl text-avocado" />
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/recipes/${recipe._id}`} className="font-semibold text-xl group-hover:text-accent font-mono">
                    {recipe.title}
                  </Link>
                  {recipe.category && (
                    <span className="text-xs text-zinc-600 border border-zinc-300 rounded-full px-2 py-1">
                      {recipe.category}
                    </span>
                  )}
                </div>

                {recipe.subtitle && (
                  <p className="mt-1 text-sm text-zinc-600 text-left">{recipe.subtitle}</p>
                )}

                <p className="mt-2 text-xs text-zinc-500">
                  Prep {recipe.prepTime}m | Cook {recipe.cookTime}m | Serves {recipe.servings}
                </p>

                {recipe.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span key={`${recipe._id}-${tag}`} className="text-xs rounded-full bg-nectarine text-white px-2 py-1">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/recipes/${recipe._id}`}
                    className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium hover:bg-zinc-100"
                  >
                    View
                  </Link>
                  <Link
                    href={`/recipes/${recipe._id}/edit`}
                    className="rounded-md border border-zinc-300 px-3 py-1 text-sm font-medium hover:bg-zinc-100"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
