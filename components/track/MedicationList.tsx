"use client";

import { useState } from "react";
import { Check, Clock3, X, Plus, Pill } from "lucide-react";
import { useStore } from "@/lib/store";
import { todayStr, formatTime12, cn } from "@/lib/utils";
import { AddMedicationSheet } from "./AddMedicationSheet";
import { MEDICATION_LATER_MESSAGE } from "@/lib/messages";

export function MedicationList({ date = todayStr() }: { date?: string }) {
  const medications = useStore((s) => s.medications);
  const logs = useStore((s) => s.medicationLogs);
  const logMedication = useStore((s) => s.logMedication);

  const [addOpen, setAddOpen] = useState(false);
  const [laterMsgFor, setLaterMsgFor] = useState<string | null>(null);

  // Filter outside the Zustand selector so the selector
  // always returns the same array reference from the store.
  const activeMedications = medications.filter((m) => !m.archived);

  return (
    <div className="space-y-3">
      {activeMedications.length === 0 && (
        <div className="text-center py-8 px-4 rounded-2xl bg-white/50 border border-dashed border-plum/15">
          <Pill
            className="mx-auto mb-2 text-plum-soft/50"
            size={24}
          />

          <p className="text-sm text-plum-soft mb-3">
            No medications added yet. Add one whenever you're ready.
          </p>

          <button
            onClick={() => setAddOpen(true)}
            className="text-sm font-medium text-rose-deep hover:underline"
          >
            + Add a medication
          </button>
        </div>
      )}

      {activeMedications.map((med) => {
        const log = logs.find(
          (l) => l.medicationId === med.id && l.date === date
        );

        return (
          <div
            key={med.id}
            className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/60 border border-white/70"
          >
            <div className="min-w-0">
              <p className="font-medium text-plum text-sm truncate">
                {med.name}
              </p>

              <p className="text-xs text-plum-soft">
                {med.dosage} &middot; {formatTime12(med.time)} &middot;{" "}
                {med.frequency}
              </p>

              {laterMsgFor === med.id && (
                <p className="text-xs text-sage mt-1 animate-fade-up">
                  {MEDICATION_LATER_MESSAGE}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <ActionButton
                active={log?.status === "taken"}
                activeClass="bg-sage text-white"
                onClick={() => {
                  logMedication(med.id, "taken", date);
                  setLaterMsgFor(null);
                }}
                label="Mark taken"
              >
                <Check size={15} />
              </ActionButton>

              <ActionButton
                active={log?.status === "later"}
                activeClass="bg-peach text-white"
                onClick={() => {
                  logMedication(med.id, "later", date);
                  setLaterMsgFor(med.id);
                }}
                label="Remind later"
              >
                <Clock3 size={15} />
              </ActionButton>

              <ActionButton
                active={log?.status === "skipped"}
                activeClass="bg-plum-soft text-white"
                onClick={() => {
                  logMedication(med.id, "skipped", date);
                  setLaterMsgFor(null);
                }}
                label="Mark skipped"
              >
                <X size={15} />
              </ActionButton>
            </div>
          </div>
        );
      })}

      {activeMedications.length > 0 && (
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-rose-deep hover:underline mt-1"
        >
          <Plus size={15} />
          Add another medication
        </button>
      )}

      <AddMedicationSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}

function ActionButton({
  active,
  activeClass,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  activeClass: string;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90",
        active
          ? activeClass
          : "bg-plum/5 text-plum-soft hover:bg-plum/10"
      )}
    >
      {children}
    </button>
  );
}

