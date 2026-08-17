"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { formatFriendlyDate } from "@/lib/utils";

export function ReflectionSheet({
  open,
  onClose,
  date,
}: {
  open: boolean;
  onClose: () => void;
  date: string;
}) {
  const reflections = useStore((s) => s.reflections);
  const upsertReflection = useStore((s) => s.upsertReflection);
  const existing = reflections.find((r) => r.date === date);

  const [feeling, setFeeling] = useState(5);
  const [wentWell, setWentWell] = useState("");
  const [wasDifficult, setWasDifficult] = useState("");
  const [proudOf, setProudOf] = useState("");
  const [whatHelped, setWhatHelped] = useState("");
  const [letGoOf, setLetGoOf] = useState("");

  useEffect(() => {
    if (open) {
      setFeeling(existing?.overallFeeling ?? 5);
      setWentWell(existing?.wentWell ?? "");
      setWasDifficult(existing?.wasDifficult ?? "");
      setProudOf(existing?.proudOf ?? "");
      setWhatHelped(existing?.whatHelped ?? "");
      setLetGoOf(existing?.letGoOf ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, date]);

  function handleSubmit() {
    upsertReflection(date, {
      overallFeeling: feeling,
      wentWell: wentWell.trim() || undefined,
      wasDifficult: wasDifficult.trim() || undefined,
      proudOf: proudOf.trim() || undefined,
      whatHelped: whatHelped.trim() || undefined,
      letGoOf: letGoOf.trim() || undefined,
    });
    onClose();
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="A few thoughts before the day ends"
      subtitle={formatFriendlyDate(date)}
    >
      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-plum-soft mb-2 block">
            Overall, how did today feel? {feeling}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={feeling}
            onChange={(e) => setFeeling(Number(e.target.value))}
            className="w-full accent-rose"
          />
        </div>

        <ReflectionField
          label="What went well?"
          value={wentWell}
          onChange={setWentWell}
          placeholder="Even something small counts..."
        />
        <ReflectionField
          label="What was difficult?"
          value={wasDifficult}
          onChange={setWasDifficult}
          placeholder="It's okay to name it."
        />
        <ReflectionField
          label="What are you proud of?"
          value={proudOf}
          onChange={setProudOf}
          placeholder="However small..."
        />
        <ReflectionField
          label="What helped?"
          value={whatHelped}
          onChange={setWhatHelped}
          placeholder="A person, a moment, a habit..."
        />
        <ReflectionField
          label="What do you want to let go of?"
          value={letGoOf}
          onChange={setLetGoOf}
          placeholder="You can leave it here."
        />

        <Button onClick={handleSubmit} size="lg" className="w-full">
          Save reflection
        </Button>
      </div>
    </Sheet>
  );
}

function ReflectionField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-plum-soft mb-1.5 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50 resize-none"
      />
    </div>
  );
}
