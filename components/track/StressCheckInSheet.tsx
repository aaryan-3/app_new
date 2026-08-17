"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { StressSlider } from "@/components/ui/StressSlider";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { TRIGGER_TAGS, TriggerTag } from "@/lib/types";
import { stressMessageFor } from "@/lib/messages";

export function StressCheckInSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addStressEntry = useStore((s) => s.addStressEntry);
  const [level, setLevel] = useState(5);
  const [tags, setTags] = useState<TriggerTag[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggleTag(tag: TriggerTag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit() {
    addStressEntry(level, tags, note);
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setLevel(5);
      setTags([]);
      setNote("");
    }, 300);
  }

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title="How are you feeling?"
      subtitle="No pressure — just a moment for you."
    >
      {submitted ? (
        <div className="py-6 text-center animate-fade-up">
          <p className="font-display text-xl text-plum mb-2">
            {stressMessageFor(level)}
          </p>
          <p className="text-plum-soft text-sm mb-6">Thank you for checking in.</p>
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <StressSlider value={level} onChange={setLevel} />

          <div>
            <p className="text-sm font-medium text-plum-soft mb-2">
              What might be contributing? (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {TRIGGER_TAGS.map((tag) => (
                <Chip key={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)}>
                  {tag}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-plum-soft mb-2 block">
              A note, if you'd like (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Whatever's on your mind..."
              rows={3}
              className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50 resize-none"
            />
          </div>

          <Button onClick={handleSubmit} size="lg" className="w-full">
            Save check-in
          </Button>
        </div>
      )}
    </Sheet>
  );
}
