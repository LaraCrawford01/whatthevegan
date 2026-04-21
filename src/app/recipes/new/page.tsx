import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminFromCookieStore } from "@/lib/adminAuth";
import RecipeForm from "@/components/RecipeForm";

export default async function NewRecipePage() {
  const cookieStore = await cookies();
  if (!isAdminFromCookieStore(cookieStore)) {
    redirect("/admin?next=/recipes/new");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-700">Add recipe</h1>
        <p className="text-zinc-600">Save a new vegan recipe to your collection.</p>
      </div>

      <RecipeForm mode="create" />

      <Link href="/recipes" className="text-sm font-medium text-emerald-700 hover:underline">
        Back to recipes
      </Link>
    </main>
  );
}
