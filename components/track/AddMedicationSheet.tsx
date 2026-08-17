"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { MedicationFrequency } from "@/lib/types";

const FREQUENCIES: MedicationFrequency[] = [
  "Daily",
  "Twice daily",
  "Three times daily",
  "As needed",
  "Weekly",
];

export function AddMedicationSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addMedication = useStore((s) => s.addMedication);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("08:30");
  const [frequency, setFrequency] = useState<MedicationFrequency>("Daily");

  function reset() {
    setName("");
    setDosage("");
    setTime("08:30");
    setFrequency("Daily");
  }

  function handleSubmit() {
    if (!name.trim()) return;
    addMedication({ name: name.trim(), dosage: dosage.trim(), time, frequency });
    reset();
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Add a medication"
      subtitle="This is just for your own gentle record-keeping."
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-plum-soft mb-1.5 block">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sertraline"
            className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-plum-soft mb-1.5 block">
            Dosage
          </label>
          <input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g. 50mg"
            className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-plum-soft mb-1.5 block">
              Usual time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum focus:outline-none focus:border-rose/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-plum-soft mb-1.5 block">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as MedicationFrequency)}
              className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum focus:outline-none focus:border-rose/50"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full"
          disabled={!name.trim()}
        >
          Save medication
        </Button>
      </div>
    </Sheet>
  );
}
