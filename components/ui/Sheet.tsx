"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, subtitle, children }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-plum/30 backdrop-blur-[2px] z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed z-50 bg-cream left-0 right-0 bottom-0 sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[85vh] sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-cream/95 backdrop-blur-sm px-6 pt-5 pb-4 flex items-start justify-between border-b border-plum/5 rounded-t-[2rem]">
              <div>
                <h2 className="font-display text-xl text-plum">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-plum-soft mt-0.5">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 -mr-2 -mt-1 rounded-full hover:bg-plum/5 text-plum-soft transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
