import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { recipeInputSchema } from "@/lib/recipeSchema";
import Recipe from "@/models/Recipe";

const IMAGE_PLACEHOLDER = "placeholder://no-image";

type Params = {
  params: Promise<{ id: string }>;
};

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid recipe ID." }, { status: 400 });
  }

  await connectToDatabase();
  const recipe = await Recipe.findById(id).lean();

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  }

  return NextResponse.json({ recipe });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid recipe ID." }, { status: 400 });
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
  const recipe = await Recipe.findByIdAndUpdate(id, recipeData, {
    returnDocument: "after",
    runValidators: true,
  }).lean();

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  }

  return NextResponse.json({ recipe });
}
