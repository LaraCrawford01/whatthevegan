import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminFromCookieStore } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { recipeInputSchema } from "@/lib/recipeSchema";
import Recipe from "@/models/Recipe";

const IMAGE_PLACEHOLDER = "placeholder://no-image";

export async function GET() {
  await connectToDatabase();

  const recipes = await Recipe.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ recipes });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isAdminFromCookieStore(cookieStore)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = recipeInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await connectToDatabase();
  const recipeData = {
    ...parsed.data,
    // Backward compatibility if an older compiled schema still expects `image`.
    image: parsed.data.image?.trim() || IMAGE_PLACEHOLDER,
  };
  const recipe = await Recipe.create(recipeData);

  return NextResponse.json({ recipe }, { status: 201 });
}
