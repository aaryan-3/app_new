import {
  StressEntry,
  Medication,
  MedicationLog,
  FoodEntry,
  YogaEntry,
  Reflection,
  TriggerTag,
} from "./types";
import { uid, todayStr, daysAgoStr } from "./utils";

function dateAt(daysAgo: number, hh: number, mm: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

export function seedMedications(): Medication[] {
  return [
    {
      id: uid(),
      name: "Sertraline",
      dosage: "50mg",
      time: "08:30",
      frequency: "Daily",
      createdAt: dateAt(30, 8, 0),
    },
    {
      id: uid(),
      name: "Vitamin D",
      dosage: "1000 IU",
      time: "08:30",
      frequency: "Daily",
      createdAt: dateAt(30, 8, 0),
    },
  ];
}

export function seedData(meds: Medication[]) {
  const stressEntries: StressEntry[] = [];
  const medicationLogs: MedicationLog[] = [];
  const foodEntries: FoodEntry[] = [];
  const yogaEntries: YogaEntry[] = [];
  const reflections: Reflection[] = [];

  const tagPool: TriggerTag[][] = [
    ["Work", "Overthinking"],
    ["Sleep"],
    ["Relationships"],
    ["Social", "Sensory overload"],
    ["Caffeine"],
    [],
    ["Work"],
  ];

  for (let day = 13; day >= 1; day--) {
    const date = daysAgoStr(day);
    const baseLevel = 3 + Math.round(Math.sin(day / 2) * 2 + Math.random() * 2);
    const morningLevel = Math.max(1, Math.min(10, baseLevel - 1));
    const afternoonLevel = Math.max(1, Math.min(10, baseLevel + 1));

    if (Math.random() > 0.15) {
      stressEntries.push({
        id: uid(),
        level: morningLevel,
        tags: tagPool[day % tagPool.length],
        note: undefined,
        createdAt: dateAt(day, 9, 15),
      });
    }
    if (Math.random() > 0.3) {
      stressEntries.push({
        id: uid(),
        level: afternoonLevel,
        tags: tagPool[(day + 2) % tagPool.length],
        createdAt: dateAt(day, 15, 40),
      });
    }
    if (Math.random() > 0.5) {
      stressEntries.push({
        id: uid(),
        level: Math.max(1, Math.min(10, baseLevel - 2)),
        tags: [],
        createdAt: dateAt(day, 20, 5),
      });
    }

    for (const med of meds) {
      medicationLogs.push({
        id: uid(),
        medicationId: med.id,
        status: Math.random() > 0.12 ? "taken" : "skipped",
        date,
        time: med.time,
        createdAt: dateAt(day, 8, 35),
      });
    }

    if (Math.random() > 0.2) {
      foodEntries.push({
        id: uid(),
        meal: "Breakfast",
        description: ["Oats with banana", "Toast and eggs", "Yogurt and granola", "Chai and paratha"][day % 4],
        time: "09:00",
        date,
        createdAt: dateAt(day, 9, 0),
      });
    }
    if (Math.random() > 0.15) {
      foodEntries.push({
        id: uid(),
        meal: "Lunch",
        description: ["Dal rice and salad", "Sandwich and soup", "Khichdi", "Veggie wrap"][day % 4],
        time: "13:30",
        date,
        createdAt: dateAt(day, 13, 30),
      });
    }
    if (Math.random() > 0.25) {
      foodEntries.push({
        id: uid(),
        meal: "Dinner",
        description: ["Roti and sabzi", "Pasta", "Soup and bread", "Rice and curry"][day % 4],
        time: "20:00",
        date,
        createdAt: dateAt(day, 20, 0),
      });
    }

    const didYoga = Math.random() > 0.45;
    yogaEntries.push({
      id: uid(),
      didYoga,
      duration: didYoga ? [10, 15, 20, 30][day % 4] : undefined,
      type: didYoga ? ["Gentle flow", "Stretching", "Breathwork", "Yin yoga"][day % 4] : undefined,
      date,
      createdAt: dateAt(day, 18, 0),
    });

    if (Math.random() > 0.5) {
      reflections.push({
        id: uid(),
        date,
        overallFeeling: Math.max(1, Math.min(10, 10 - baseLevel)),
        wentWell: [
          "Had a calm morning with tea before work.",
          "Talked to a friend and felt lighter.",
          "Got through a hard meeting without spiraling.",
        ][day % 3],
        wasDifficult: [
          "Felt overstimulated by evening.",
          "Trouble focusing in the afternoon.",
          "",
        ][day % 3],
        proudOf: "Showing up for myself today.",
        whatHelped: ["A short walk", "Deep breathing", "Music", "Quiet time alone"][day % 4],
        letGoOf: "",
        createdAt: dateAt(day, 21, 30),
        updatedAt: dateAt(day, 21, 30),
      });
    }
  }

  // Today: a couple of check-ins to feel alive on first load
  stressEntries.push({
    id: uid(),
    level: 4,
    tags: ["Work"],
    note: "Busy morning, but manageable.",
    createdAt: dateAt(0, 9, 20),
  });

  return { stressEntries, medicationLogs, foodEntries, yogaEntries, reflections };
}
