import { Search, Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TopBar() {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight">DevStash</span>
      </div>

      <div className="flex-1 max-w-sm mx-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8 h-8 bg-muted/50 border-border text-sm"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <FolderPlus className="h-4 w-4" />
          New Collection
        </Button>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
