import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const avatarColors: Record<string, { bg: string; text: string }> = {
  purple: { bg: "bg-purple-100", text: "text-purple-800" },
  teal:   { bg: "bg-teal-100",   text: "text-teal-800"   },
  coral:  { bg: "bg-orange-100", text: "text-orange-800" },
  blue:   { bg: "bg-blue-100",   text: "text-blue-800"   },
  green:  { bg: "bg-green-100",  text: "text-green-800"  },
  amber:  { bg: "bg-amber-100",  text: "text-amber-800"  },
  red:    { bg: "bg-red-100",    text: "text-red-800"    },
};
