export type TriggerTag =
  | "Work"
  | "Sleep"
  | "Relationships"
  | "Overthinking"
  | "Social"
  | "Sensory overload"
  | "Food"
  | "Caffeine"
  | "Other";

export const TRIGGER_TAGS: TriggerTag[] = [
  "Work",
  "Sleep",
  "Relationships",
  "Overthinking",
  "Social",
  "Sensory overload",
  "Food",
  "Caffeine",
  "Other",
];

export interface StressEntry {
  id: string;
  level: number; // 1-10
  tags: TriggerTag[];
  note?: string;
  createdAt: string; // ISO timestamp
}

export type MedicationFrequency =
  | "Daily"
  | "Twice daily"
  | "Three times daily"
  | "As needed"
  | "Weekly";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:mm, primary reminder time
  frequency: MedicationFrequency;
  archived?: boolean;
  createdAt: string;
}

export type MedicationLogStatus = "taken" | "skipped" | "later";

export interface MedicationLog {
  id: string;
  medicationId: string;
  status: MedicationLogStatus;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm actually logged
  createdAt: string;
}

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface FoodEntry {
  id: string;
  meal: MealType;
  description: string;
  note?: string;
  time: string; // HH:mm
  date: string; // yyyy-MM-dd
  createdAt: string;
}

export interface YogaEntry {
  id: string;
  didYoga: boolean;
  duration?: number; // minutes
  type?: string;
  note?: string;
  date: string; // yyyy-MM-dd
  createdAt: string;
}

export interface Reflection {
  id: string;
  date: string; // yyyy-MM-dd, one per day
  overallFeeling?: number; // 1-10
  wentWell?: string;
  wasDifficult?: string;
  proudOf?: string;
  whatHelped?: string;
  letGoOf?: string;
  createdAt: string;
  updatedAt: string;
}

export type LoveCategory =
  | "Anxiety"
  | "Overwhelmed"
  | "Confidence"
  | "Self-worth"
  | "Random";

export interface FavoriteMessage {
  message: string;
  category: LoveCategory;
  favoritedAt: string;
}

export interface Profile {
  name: string;
  createdAt: string;
}
