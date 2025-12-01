import { DrawnCard } from "./AIReader";

export interface LoveReadingResult {
  cardName: string;
  uprightOrReversed: "Upright" | "Reversed";
  loveMeaning: string;
  advice: string;
  keywords: string[];
}

const LOVE_MEANINGS: Record<string, { upright: string; reversed: string; advice: string }> = {
  "The Fool": {
    upright: "New beginnings in love, spontaneous romance, taking a leap of faith.",
    reversed: "Recklessness in love, fear of commitment, naivety.",
    advice: "Be open to new possibilities but don't ignore red flags.",
  },
  "The Magician": {
    upright: "Manifesting love, strong connection, taking action.",
    reversed: "Manipulation, trickery, poor communication.",
    advice: "You have the power to create the relationship you want. Be authentic.",
  },
  "The High Priestess": {
    upright: "Intuition, mystery, deep spiritual connection.",
    reversed: "Secrets, disconnected intuition, hidden agendas.",
    advice: "Trust your gut feelings about this person.",
  },
  "The Empress": {
    upright: "Fertility, nurturing love, abundance, sensuality.",
    reversed: "Dependence, smothering, lack of self-care.",
    advice: "Nurture yourself and your relationship will bloom.",
  },
  "The Lovers": {
    upright: "Deep connection, harmony, alignment of values.",
    reversed: "Disharmony, imbalance, misalignment.",
    advice: "Choose love that aligns with your true self.",
  },
  // Add generic fallback for others
  "default": {
    upright: "Positive energy in relationships, growth, and understanding.",
    reversed: "Challenges to overcome, need for reflection, internal blocks.",
    advice: "Focus on communication and honesty.",
  }
};

export async function getLoveReading(cardName: string, isUpright: boolean): Promise<LoveReadingResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const meaningData = LOVE_MEANINGS[cardName] || LOVE_MEANINGS["default"];
  const loveMeaning = isUpright ? meaningData.upright : meaningData.reversed;

  return {
    cardName,
    uprightOrReversed: isUpright ? "Upright" : "Reversed",
    loveMeaning,
    advice: meaningData.advice,
    keywords: ["Love", "Connection", "Destiny"] // Mock keywords
  };
}
