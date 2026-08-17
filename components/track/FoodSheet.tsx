"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { MealType } from "@/lib/types";
import { todayStr, nowTimeStr } from "@/lib/utils";

const MEALS: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export function FoodSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addFoodEntry = useStore((s) => s.addFoodEntry);
  const [meal, setMeal] = useState<MealType>("Breakfast");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState(nowTimeStr());

  function reset() {
    setDescription("");
    setNote("");
    setTime(nowTimeStr());
    setMeal("Breakfast");
  }

  function handleSubmit() {
    if (!description.trim()) return;
    addFoodEntry({
      meal,
      description: description.trim(),
      note: note.trim() || undefined,
      time,
      date: todayStr(),
    });
    reset();
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Log a bite"
      subtitle="No calories, no judgment — just noticing."
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-plum-soft mb-2">Meal</p>
          <div className="flex flex-wrap gap-2">
            {MEALS.map((m) => (
              <Chip key={m} active={meal === m} onClick={() => setMeal(m)}>
                {m}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-plum-soft mb-1.5 block">
            What did you have?
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Toast with peanut butter"
            className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-plum-soft mb-1.5 block">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum focus:outline-none focus:border-rose/50"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-plum-soft mb-1.5 block">
            How did it feel? (optional)
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Comforting, rushed, satisfying..."
            className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50"
          />
        </div>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full"
          disabled={!description.trim()}
        >
          Save
        </Button>
      </div>
    </Sheet>
  );
}
