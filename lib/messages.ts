import { LoveCategory } from "./types";

export const GREETING_MESSAGES: string[] = [
  "Take today one moment at a time.",
  "You don't have to have it all figured out today.",
  "Whatever today holds, you're allowed to go slow.",
  "You showed up. That's already enough.",
  "One breath, one moment, one small step.",
  "It's okay to take up space today.",
  "You're doing better than you think you are.",
  "Today doesn't have to be perfect to be good.",
  "Be as kind to yourself as you are to everyone else.",
  "You are held, even on the hard days.",
];

export const HIGH_STRESS_MESSAGES: string[] = [
  "That sounds like a difficult moment. Be gentle with yourself.",
  "This feeling is real, and it will pass. You're not alone in it.",
  "You don't need to fix this right now. Just breathe.",
  "It makes sense that this feels like a lot. You're doing your best.",
  "Hard moments don't erase all the good ones. This is just one part of today.",
];

export const MODERATE_STRESS_MESSAGES: string[] = [
  "Thank you for checking in with yourself.",
  "Noticing how you feel is a quiet act of care.",
  "However today feels, it's okay to feel it.",
];

export const LOW_STRESS_MESSAGES: string[] = [
  "It's nice that this moment feels a little lighter.",
  "Hold onto this feeling for as long as it stays.",
  "Glad this moment feels okay. You deserve that.",
];

export const YOGA_SKIP_MESSAGE =
  "That's okay. Rest is part of taking care of yourself too.";

export const MISSED_TRACKING_MESSAGE =
  "You don't need to catch up. Just start from today ❤️";

export const MEDICATION_LATER_MESSAGE =
  "No pressure — we'll gently remind you again a little later.";

export const LOVE_MESSAGES: Record<LoveCategory, string[]> = {
  Anxiety: [
    "This feeling is temporary, even when it doesn't feel that way.",
    "You are safe in this moment.",
    "You don't have to solve everything today.",
    "Your mind is trying to protect you. You can thank it and rest anyway.",
    "One thing at a time. That's all this moment is asking of you.",
    "It's okay to not be okay right now.",
    "You've survived every anxious moment so far. This one is no different.",
  ],
  Overwhelmed: [
    "You don't have to carry all of it at once.",
    "It's okay to put some of it down for today.",
    "Small steps still count.",
    "You are allowed to rest before you're finished.",
    "Not everything needs to happen right now.",
    "One task. One breath. One moment. That's all you owe today.",
    "It's okay if today was simply about getting through.",
  ],
  Confidence: [
    "You've gotten through difficult days before.",
    "You are more capable than your doubts let you believe.",
    "You don't need to be perfect to be proud of yourself.",
    "Your effort matters, even when the results are quiet.",
    "You are allowed to take up space and be seen.",
    "You have handled hard things with more grace than you give yourself credit for.",
    "Confidence isn't the absence of fear — and you're still here.",
  ],
  "Self-worth": [
    "You are enough exactly as you are.",
    "Your worth isn't measured by how productive today was.",
    "You are lovable even on your low days.",
    "You don't have to earn rest or love.",
    "You are more than your hardest moments.",
    "The people who love you don't need you to be different.",
    "You are allowed to like yourself.",
  ],
  Random: [
    "You are so deeply loved, even from a distance.",
    "Someone is proud of you today, even if they haven't said it yet.",
    "You make the people around you feel safer just by being you.",
    "This is your gentle reminder to drink some water and unclench your jaw.",
    "You are exactly where you need to be right now.",
    "Your softness is not a weakness.",
    "You are worth showing up for — especially by yourself.",
  ],
};

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function stressMessageFor(level: number): string {
  if (level >= 7) return randomFrom(HIGH_STRESS_MESSAGES);
  if (level >= 4) return randomFrom(MODERATE_STRESS_MESSAGES);
  return randomFrom(LOW_STRESS_MESSAGES);
}
