"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { Lock, ShieldCheck, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const profile = useStore((s) => s.profile);
  const setName = useStore((s) => s.setName);
  const resetAllData = useStore((s) => s.resetAllData);
  const [name, setLocalName] = useState(profile.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSaveName() {
    setName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function handleDeleteEverything() {
    resetAllData();
    setConfirmingDelete(false);
  }

  return (
    <div className="space-y-5 pt-2 pb-4 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-plum">Settings</h1>
        <p className="text-plum-soft text-sm mt-1">Your space, your rules.</p>
      </div>

      <Card>
        <p className="text-sm font-medium text-plum-soft mb-2">Your name</p>
        <p className="text-xs text-plum-soft/70 mb-3">
          This is just how we greet you — nothing more.
        </p>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setLocalName(e.target.value)}
            className="flex-1 rounded-2xl border border-plum/10 bg-white/70 px-4 py-2.5 text-sm text-plum focus:outline-none focus:border-rose/50"
          />
          <Button onClick={handleSaveName} size="sm">
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={17} className="text-sage" />
          <p className="text-sm font-semibold text-plum">Privacy</p>
        </div>
        <ul className="space-y-2 text-sm text-plum-soft leading-relaxed">
          <li className="flex gap-2">
            <Lock size={14} className="mt-1 shrink-0 text-plum-soft/60" />
            All of your entries are private and stored only for you — never shared or
            made public.
          </li>
          <li className="flex gap-2">
            <Lock size={14} className="mt-1 shrink-0 text-plum-soft/60" />
            There are no public profiles, leaderboards, or ways for anyone else to see
            your data.
          </li>
          <li className="flex gap-2">
            <Lock size={14} className="mt-1 shrink-0 text-plum-soft/60" />
            You can delete any single entry, or everything at once, at any time.
          </li>
        </ul>
      </Card>

      <Card className="border-rose/20">
        <p className="text-sm font-semibold text-plum mb-1">Delete everything</p>
        <p className="text-xs text-plum-soft/80 mb-4">
          This permanently removes every check-in, log, and reflection from this device.
          This can't be undone.
        </p>
        {!confirmingDelete ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmingDelete(true)}
            className="gap-1.5"
          >
            <Trash2 size={14} /> Delete all my data
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="danger" size="sm" onClick={handleDeleteEverything}>
              Yes, delete everything
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-plum-soft/50 px-6 pt-2">
        little space is not a substitute for professional medical or mental health care.
      </p>
    </div>
  );
}
