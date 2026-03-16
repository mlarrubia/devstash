"use client";

import { useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Action buttons — animate in/out */}
      <div
        className={cn(
          "flex flex-col items-end gap-2 transition-all duration-200",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <button className="flex items-center gap-2 rounded-full bg-muted border border-border px-4 py-2 text-sm font-medium shadow-md hover:bg-muted/80 transition-colors">
          <FolderPlus className="h-4 w-4" />
          New Collection
        </button>
        <button className="flex items-center gap-2 rounded-full bg-muted border border-border px-4 py-2 text-sm font-medium shadow-md hover:bg-muted/80 transition-colors">
          <Plus className="h-4 w-4" />
          New Item
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-200"
        aria-label="Open actions"
      >
        <Plus
          className={cn(
            "h-6 w-6 transition-transform duration-200",
            open && "rotate-45"
          )}
        />
      </button>

      {/* Backdrop to close */}
      {open && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
