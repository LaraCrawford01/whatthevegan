"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type RecipeFormValues = {
  slug: string;
  title: string;
  subtitle: string;
  tagsText: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  featured: boolean;
  featuredOrder: string;
  ingredientsText: string;
  instructionsText: string;
  notes: string;
  category: string;
};

type RecipeFormProps = {
  mode: "create" | "edit";
  recipeId?: string;
  initialValues?: RecipeFormValues;
};

const categoryOptions = [
  "Condiments",
  "Breakfast",
  "Lunch",
  "Dessert",
  "Snack",
  "Dinner",
  "Dip Sauce",
  "Soup",
] as const;

const emptyValues: RecipeFormValues = {
  slug: "",
  title: "",
  subtitle: "",
  tagsText: "vegan",
  prepTime: "10",
  cookTime: "15",
  servings: "2",
  featured: false,
  featuredOrder: "",
  ingredientsText: "",
  instructionsText: "",
  notes: "",
  category: "",
};

export default function RecipeForm({
  mode,
  recipeId,
  initialValues,
}: RecipeFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<RecipeFormValues>(initialValues ?? emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = useMemo(
    () => (mode === "create" ? "Add recipe" : "Save changes"),
    [mode],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const url = mode === "create" ? "/api/recipes" : `/api/recipes/${recipeId}`;
    const method = mode === "create" ? "POST" : "PATCH";
    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      image: "",
      tags: form.tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      prepTime: Number(form.prepTime),
      cookTime: Number(form.cookTime),
      servings: Number(form.servings),
      featured: form.featured,
      featuredOrder:
        form.featured && form.featuredOrder.trim()
          ? Number(form.featuredOrder)
          : null,
      ingredients: form.ingredientsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      instructions: form.instructionsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      notes: form.notes.trim(),
      category: form.category.trim(),
    };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error?.formErrors?.[0] ?? payload?.error ?? "Failed to save recipe.");
      setIsSubmitting(false);
      return;
    }

    router.push("/recipes");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="space-y-1">
        <label htmlFor="slug" className="block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          value={form.slug}
          onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
          className="w-full rounded-lg border border-zinc-300 p-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          className="w-full rounded-lg border border-zinc-300 p-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="subtitle" className="block text-sm font-medium">
          Subtitle
        </label>
        <textarea
          id="subtitle"
          rows={2}
          value={form.subtitle}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, subtitle: event.target.value }))
          }
          className="w-full rounded-lg border border-zinc-300 p-2"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label htmlFor="prepTime" className="block text-sm font-medium">
            Prep time (min)
          </label>
          <input
            id="prepTime"
            type="number"
            min={0}
            value={form.prepTime}
            onChange={(event) => setForm((prev) => ({ ...prev, prepTime: event.target.value }))}
            className="w-full rounded-lg border border-zinc-300 p-2"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="cookTime" className="block text-sm font-medium">
            Cook time (min)
          </label>
          <input
            id="cookTime"
            type="number"
            min={0}
            value={form.cookTime}
            onChange={(event) => setForm((prev) => ({ ...prev, cookTime: event.target.value }))}
            className="w-full rounded-lg border border-zinc-300 p-2"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="servings" className="block text-sm font-medium">
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min={1}
            value={form.servings}
            onChange={(event) => setForm((prev) => ({ ...prev, servings: event.target.value }))}
            className="w-full rounded-lg border border-zinc-300 p-2"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="tagsText" className="block text-sm font-medium">
          Tags (comma separated)
        </label>
        <input
          id="tagsText"
          value={form.tagsText}
          onChange={(event) => setForm((prev) => ({ ...prev, tagsText: event.target.value }))}
          className="w-full rounded-lg border border-zinc-300 p-2"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, featured: event.target.checked }))
            }
          />
          Featured recipe
        </label>

        <div className="space-y-1">
          <label htmlFor="featuredOrder" className="block text-sm font-medium">
            Featured order
          </label>
          <input
            id="featuredOrder"
            type="number"
            min={1}
            value={form.featuredOrder}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, featuredOrder: event.target.value }))
            }
            disabled={!form.featured}
            className="w-full rounded-lg border border-zinc-300 p-2 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="ingredientsText" className="block text-sm font-medium">
          Ingredients (one per line)
        </label>
        <textarea
          id="ingredientsText"
          rows={6}
          value={form.ingredientsText}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, ingredientsText: event.target.value }))
          }
          className="w-full rounded-lg border border-zinc-300 p-2 font-mono text-sm"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="instructionsText" className="block text-sm font-medium">
          Instructions (one per line)
        </label>
        <textarea
          id="instructionsText"
          rows={8}
          value={form.instructionsText}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, instructionsText: event.target.value }))
          }
          className="w-full rounded-lg border border-zinc-300 p-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          className="w-full rounded-lg border border-zinc-300 p-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          className="w-full rounded-lg border border-zinc-300 p-2"
          required
        >
          <option value="">Select a category</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
