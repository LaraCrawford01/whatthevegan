import Link from "next/link";
import { cookies } from "next/headers";
import {
  PiPlant,
  PiCarrot,
  PiTShirt,
  PiBookOpenText,
  PiUsers,
} from "react-icons/pi";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe, { RecipeDocument } from "@/models/Recipe";
import { isAdminFromCookieStore } from "@/lib/adminAuth";
import CategoryIcon from "@/components/CategoryIcon";

async function getFeaturedRecipes() {
  await connectToDatabase();
  const featured = (await Recipe.find({ featured: true })
    .sort({ featuredOrder: 1, updatedAt: -1 })
    .limit(6)
    .lean()) as RecipeDocument[];

  return featured;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAdmin = isAdminFromCookieStore(cookieStore);
  const featured = await getFeaturedRecipes();

  return (
    <main className="min-h-screen mt-16 bg-background text-foreground text-center flex flex-col">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="px-4 border border-avocado/20 inline-block rounded-full bg-lime/10">
          <span className="text-xs text-lime font-semibold inline-flex items-center gap-2">
            <PiPlant />
            100% Plant-Based
          </span>
        </div>

        <h1 className="mt-3 text-4xl md:text-6xl font-light font-mono leading-snug">
          Easy, tasty vegan recipes <br />
          <span className="text-lime">without the fluff.</span>
        </h1>
        <p className="mt-4 text-zinc-600 max-w-xl text-xl text-center mx-auto">
          Explore mouthwatering plant-based recipes and express your values with
          our eco-friendly t-shirt collection
        </p>

        <div className="mt-8 flex gap-4 items-center justify-center flex-wrap">
          <Link
            href="/recipes"
            className="inline-flex items-center rounded-l px-6 py-3 text-sm font-semibold bg-lime hover:bg-avocado gap-2 transition"
          >
            <PiCarrot className="text-xl  text-white" />
            <span className=" text-white">Browse recipes</span>
          </Link>
          <Link
            href={isAdmin ? "/recipes/new" : "/admin?next=/recipes/new"}
            className="inline-flex items-center rounded-l px-6 py-3 text-sm font-semibold border border-foreground hover:bg-lime/20 hover:text-white gap-2 transition"
          >
            <PiTShirt className="text-xl" />
            <span>{isAdmin ? "Add recipe" : "Admin login"}</span>
          </Link>
        </div>
      </section>
      <section className="mx-auto px-4 py-16 ">
        <div className="max-w-6xl mt-8 grid gap-6 md:grid-cols-3 items-stretch">
          <div className="h-full rounded-lg p-6 bg-white shadow-xl flex flex-col">
            <div className="self-center inline-flex items-center justify-center p-4 rounded-full bg-lime/10 mb-4">
              <PiBookOpenText className="text-3xl text-lime" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 font-mono">
              Delicious Recipes
            </h2>
            <p className="text-muted">
              Discover a variety of easy-to-make vegan recipes that are both
              nutritious and flavorful.
            </p>
          </div>

          <div className="h-full rounded-lg p-6 bg-white shadow-xl flex flex-col">
            <div className="bg-lime/10 p-4 self-center inline-flex items-center justify-center rounded-full mb-4">
              <PiTShirt className="text-3xl text-lime" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 font-mono">
              Eco-Friendly Apparel
            </h2>
            <p className="text-muted">
              Curated plant-based recipes in one place, with admin tools for
              adding new dishes quickly.
            </p>
          </div>

          <div className="h-full rounded-lg p-6 bg-white shadow-xl flex flex-col">
            <div className="bg-lime/10 self-center inline-flex items-center justify-center p-4 rounded-full  mb-4">
              <PiUsers className="text-3xl text-lime" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 font-mono">
              Join Our Community
            </h2>
            <p className="text-muted">
              Connect with like-minded individuals who are passionate about
              plant-based living.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-full bg-mint/40 py-16 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-4xl font-semibold font-mono">
              Featured recipes
            </h2>
            <Link href="/recipes" className="text-accent hover:underline">
              Browse all →
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <Link
                key={r._id}
                href={`/recipes/${r._id}`}
                className="group rounded-xl bg-background overflow-hidden hover:border-accent/60 transition shadow-lg"
              >
                <div className="h-64 bg-mint/40 flex items-center justify-center">
                  <CategoryIcon category={r.category} className="text-8xl text-avocado" />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-xl group-hover:text-accent font-mono">
                      {r.title}
                    </h3>
                    {r.category && (
                      <span className="text-xs text-muted border border-border rounded-full px-2 py-1">
                        {r.category}
                      </span>
                    )}
                  </div>

                  {r.subtitle && (
                    <p className="mt-1 text-sm text-muted text-left">
                      {r.subtitle}
                    </p>
                  )}

                  {r.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-xs rounded-full bg-nectarine text-white px-2 py-1"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
