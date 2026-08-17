"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  StressEntry,
  Medication,
  MedicationLog,
  MedicationLogStatus,
  FoodEntry,
  YogaEntry,
  Reflection,
  FavoriteMessage,
  Profile,
  TriggerTag,
} from "./types";
import { uid, todayStr } from "./utils";

interface AppState {
  hydrated: boolean;
  profile: Profile;
  stressEntries: StressEntry[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  foodEntries: FoodEntry[];
  yogaEntries: YogaEntry[];
  reflections: Reflection[];
  favorites: FavoriteMessage[];

  setHydrated: () => void;
  setName: (name: string) => void;

  addStressEntry: (
    level: number,
    tags: TriggerTag[],
    note?: string
  ) => void;
  deleteStressEntry: (id: string) => void;

  addMedication: (
    med: Omit<Medication, "id" | "createdAt">
  ) => void;
  archiveMedication: (id: string) => void;
  deleteMedication: (id: string) => void;

  logMedication: (
    medicationId: string,
    status: MedicationLogStatus,
    date?: string
  ) => void;

  addFoodEntry: (
    entry: Omit<FoodEntry, "id" | "createdAt">
  ) => void;
  deleteFoodEntry: (id: string) => void;

  setYogaForToday: (
    entry: Partial<YogaEntry> & { didYoga: boolean }
  ) => void;

  upsertReflection: (
    date: string,
    data: Partial<Reflection>
  ) => void;

  toggleFavorite: (
    message: string,
    category: FavoriteMessage["category"]
  ) => void;

  resetAllData: () => void;
}

const emptyState = {
  stressEntries: [] as StressEntry[],
  medications: [] as Medication[],
  medicationLogs: [] as MedicationLog[],
  foodEntries: [] as FoodEntry[],
  yogaEntries: [] as YogaEntry[],
  reflections: [] as Reflection[],
  favorites: [] as FavoriteMessage[],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,

      profile: {
        name: "love",
        createdAt: new Date().toISOString(),
      },

      ...emptyState,

      setHydrated: () => set({ hydrated: true }),

      setName: (name) =>
        set((s) => ({
          profile: {
            ...s.profile,
            name: name.trim() || "love",
          },
        })),

      addStressEntry: (level, tags, note) =>
        set((s) => ({
          stressEntries: [
            {
              id: uid(),
              level,
              tags,
              note: note?.trim() || undefined,
              createdAt: new Date().toISOString(),
            },
            ...s.stressEntries,
          ],
        })),

      deleteStressEntry: (id) =>
        set((s) => ({
          stressEntries: s.stressEntries.filter(
            (e) => e.id !== id
          ),
        })),

      addMedication: (med) =>
        set((s) => ({
          medications: [
            ...s.medications,
            {
              ...med,
              id: uid(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      archiveMedication: (id) =>
        set((s) => ({
          medications: s.medications.map((m) =>
            m.id === id
              ? { ...m, archived: true }
              : m
          ),
        })),

      deleteMedication: (id) =>
        set((s) => ({
          medications: s.medications.filter(
            (m) => m.id !== id
          ),
          medicationLogs: s.medicationLogs.filter(
            (l) => l.medicationId !== id
          ),
        })),

      logMedication: (
        medicationId,
        status,
        date
      ) =>
        set((s) => {
          const d = date ?? todayStr();
          const now = new Date();

          const existingIdx =
            s.medicationLogs.findIndex(
              (l) =>
                l.medicationId === medicationId &&
                l.date === d
            );

          const entry: MedicationLog = {
            id:
              existingIdx >= 0
                ? s.medicationLogs[existingIdx].id
                : uid(),

            medicationId,
            status,
            date: d,

            time: `${String(
              now.getHours()
            ).padStart(2, "0")}:${String(
              now.getMinutes()
            ).padStart(2, "0")}`,

            createdAt: now.toISOString(),
          };

          if (existingIdx >= 0) {
            const copy = [
              ...s.medicationLogs,
            ];

            copy[existingIdx] = entry;

            return {
              medicationLogs: copy,
            };
          }

          return {
            medicationLogs: [
              entry,
              ...s.medicationLogs,
            ],
          };
        }),

      addFoodEntry: (entry) =>
        set((s) => ({
          foodEntries: [
            {
              ...entry,
              id: uid(),
              createdAt: new Date().toISOString(),
            },
            ...s.foodEntries,
          ],
        })),

      deleteFoodEntry: (id) =>
        set((s) => ({
          foodEntries: s.foodEntries.filter(
            (e) => e.id !== id
          ),
        })),

      setYogaForToday: (entry) =>
        set((s) => {
          const date = todayStr();

          const idx = s.yogaEntries.findIndex(
            (y) => y.date === date
          );

          const full: YogaEntry = {
            id:
              idx >= 0
                ? s.yogaEntries[idx].id
                : uid(),

            date,

            createdAt:
              idx >= 0
                ? s.yogaEntries[idx].createdAt
                : new Date().toISOString(),

            didYoga: entry.didYoga,
            duration: entry.duration,
            type: entry.type,
            note: entry.note,
          };

          if (idx >= 0) {
            const copy = [
              ...s.yogaEntries,
            ];

            copy[idx] = full;

            return {
              yogaEntries: copy,
            };
          }

          return {
            yogaEntries: [
              full,
              ...s.yogaEntries,
            ],
          };
        }),

      upsertReflection: (date, data) =>
        set((s) => {
          const idx =
            s.reflections.findIndex(
              (r) => r.date === date
            );

          const now =
            new Date().toISOString();

          if (idx >= 0) {
            const copy = [
              ...s.reflections,
            ];

            copy[idx] = {
              ...copy[idx],
              ...data,
              updatedAt: now,
            };

            return {
              reflections: copy,
            };
          }

          return {
            reflections: [
              {
                id: uid(),
                date,
                createdAt: now,
                updatedAt: now,
                ...data,
              },
              ...s.reflections,
            ],
          };
        }),

      toggleFavorite: (
        message,
        category
      ) =>
        set((s) => {
          const exists =
            s.favorites.some(
              (f) => f.message === message
            );

          if (exists) {
            return {
              favorites:
                s.favorites.filter(
                  (f) =>
                    f.message !== message
                ),
            };
          }

          return {
            favorites: [
              {
                message,
                category,
                favoritedAt:
                  new Date().toISOString(),
              },
              ...s.favorites,
            ],
          };
        }),

      resetAllData: () =>
        set({
          ...emptyState,
        }),
    }),

    {
      name: "little-space-storage-v2",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
