"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { YOGA_SKIP_MESSAGE } from "@/lib/messages";

export function YogaSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const setYogaForToday = useStore((s) => s.setYogaForToday);
  const [didYoga, setDidYoga] = useState<boolean | null>(null);
  const [duration, setDuration] = useState(15);
  const [type, setType] = useState("");
  const [note, setNote] = useState("");

  function reset() {
    setDidYoga(null);
    setDuration(15);
    setType("");
    setNote("");
  }

  function handleSubmit(yes: boolean) {
    setYogaForToday({
      didYoga: yes,
      duration: yes ? duration : undefined,
      type: yes ? type.trim() || undefined : undefined,
      note: note.trim() || undefined,
    });
    if (!yes) {
      setDidYoga(false);
    } else {
      reset();
      onClose();
    }
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  return (
    <Sheet open={open} onClose={handleClose} title="Movement & rest">
      {didYoga === false ? (
        <div className="py-6 text-center animate-fade-up">
          <p className="font-display text-xl text-plum mb-6">{YOGA_SKIP_MESSAGE}</p>
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-plum-soft">Did you move your body today?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" onClick={() => setDidYoga(true)} className="py-3.5">
              Yes, I did
            </Button>
            <Button variant="outline" onClick={() => handleSubmit(false)} className="py-3.5">
              Not today
            </Button>
          </div>

          {didYoga === true && (
            <div className="space-y-4 animate-fade-up">
              <div>
                <label className="text-sm font-medium text-plum-soft mb-1.5 block">
                  Duration: {duration} min
                </label>
                <input
                  type="range"
                  min={5}
                  max={90}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-sage"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-plum-soft mb-1.5 block">
                  Type (optional)
                </label>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g. Gentle flow, stretching, breathwork"
                  className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-plum-soft mb-1.5 block">
                  Note (optional)
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How did it feel?"
                  className="w-full rounded-2xl border border-plum/10 bg-white/70 px-4 py-3 text-sm text-plum placeholder:text-plum-soft/50 focus:outline-none focus:border-rose/50"
                />
              </div>
              <Button onClick={() => handleSubmit(true)} size="lg" className="w-full">
                Save
              </Button>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
