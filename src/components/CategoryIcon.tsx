import { RiCupLine } from "react-icons/ri";
import { GiKetchup, GiChocolateBar } from "react-icons/gi";
import { PiHamburgerBold, PiBowlFoodLight, PiBowlSteamLight } from "react-icons/pi";
import { LuEggFried, LuDessert } from "react-icons/lu";
import { LiaFillDripSolid } from "react-icons/lia";


type CategoryIconProps = {
  category?: string;
  className?: string;
};

function normalizeCategory(category?: string) {
  return (category ?? "").trim().toLowerCase();
}

export default function CategoryIcon({ category, className }: CategoryIconProps) {
  const normalized = normalizeCategory(category);

  if (normalized.includes("condiment")) {
    return <GiKetchup className={className} />;
  }

  if (normalized.includes("breakfast")) {
    return <LuEggFried className={className} />;
  }

  if (normalized.includes("lunch")) {
    return <PiHamburgerBold className={className} />;
  }

  if (normalized.includes("dessert")) {
    return <LuDessert className={className} />;
  }

  if (normalized.includes("snack")) {
    return <GiChocolateBar className={className} />;
  }

  if (normalized.includes("dinner") || normalized.includes("diiner")) {
    return <PiBowlFoodLight className={className} />;
  }

  if (normalized.includes("dip sauce") || normalized.includes("dip")) {
    return <LiaFillDripSolid className={className} />;
  }

  if (normalized.includes("soup")) {
    return <PiBowlSteamLight className={className} />;
  }

  if (normalized.includes("beverage")) {
    return <RiCupLine className={className} />;
  }

  return <PiBowlFoodLight className={className} />;
}
