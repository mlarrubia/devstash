"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link2,
  File,
  Image as ImageIcon,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Folder,
  ChevronDown,
} from "lucide-react";
import { mockItemTypes, mockCollections, mockUser, mockItems } from "@/lib/mock-data";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: Link2,
  File,
  Image: ImageIcon,
};

const typeCounts = mockItems.reduce<Record<string, number>>((acc, item) => {
  acc[item.itemTypeId] = (acc[item.itemTypeId] || 0) + 1;
  return acc;
}, {});

const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
const recentCollections = mockCollections.filter((c) => !c.isFavorite);

function SidebarContent({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const userInitials =
    mockUser.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "U";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-3">
        {/* Types header with collapse toggle */}
        <div
          className={cn(
            "px-3 mb-1 flex items-center",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Types
            </span>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        <nav className="space-y-0.5 px-2">
          {mockItemTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? File;
            const count = typeCounts[type.id] ?? 0;
            return (
              <Link
                key={type.id}
                href={`/items/${type.name}s`}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                {!collapsed && (
                  <>
                    <span className="flex-1 capitalize">{type.name}s</span>
                    {count > 0 && (
                      <span className="text-xs text-muted-foreground/60">{count}</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="my-3 border-t border-border" />

        {/* Collections header with toggle */}
        {!collapsed && (
          <button
            onClick={() => setCollectionsOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 mb-1 group"
          >
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Collections
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-muted-foreground transition-all duration-300",
                !collectionsOpen && "-rotate-90"
              )}
            />
          </button>
        )}

        {/* Animated collections content */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            collectionsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            {/* Favorites */}
            {favoriteCollections.length > 0 && (
              <div className="px-2">
                {!collapsed && (
                  <div className="flex items-center gap-1.5 px-2 py-1 mb-0.5">
                    <Star className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">
                      Favorites
                    </span>
                  </div>
                )}
                <div className="space-y-0.5">
                  {favoriteCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors",
                        collapsed && "justify-center"
                      )}
                    >
                      <Folder className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{col.name}</span>
                          <Star className="h-3 w-3 text-yellow-400 shrink-0" />
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            {recentCollections.length > 0 && !collapsed && (
              <div className="px-2 mt-2">
                <div className="flex items-center gap-1.5 px-2 py-1 mb-0.5">
                  <span className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium">
                    Recent
                  </span>
                </div>
                <div className="space-y-0.5">
                  {recentCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <Folder className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span className="flex-1 truncate">{col.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User area */}
      <div className={cn("border-t border-border p-3", collapsed && "p-2")}>
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
            {userInitials}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{mockUser.name}</div>
                <div className="text-xs text-muted-foreground truncate">{mockUser.email}</div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-56 p-0 bg-background">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border shrink-0 transition-all duration-300 overflow-hidden",
          collapsed ? "w-14" : "w-56"
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={toggleCollapsed} />
      </aside>
    </>
  );
}
