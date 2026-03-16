import { Package, FolderOpen, Star, Bookmark } from "lucide-react";
import { mockItems, mockCollections } from "@/lib/mock-data";

const stats = [
  {
    label: "Total Items",
    value: mockItems.length,
    Icon: Package,
    colorClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
  },
  {
    label: "Collections",
    value: mockCollections.length,
    Icon: FolderOpen,
    colorClass: "text-purple-400",
    bgClass: "bg-purple-400/10",
  },
  {
    label: "Favorite Items",
    value: mockItems.filter((i) => i.isFavorite).length,
    Icon: Star,
    colorClass: "text-yellow-400",
    bgClass: "bg-yellow-400/10",
  },
  {
    label: "Favorite Collections",
    value: mockCollections.filter((c) => c.isFavorite).length,
    Icon: Bookmark,
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-400/10",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, Icon, colorClass, bgClass }) => (
        <div
          key={label}
          className="rounded-lg border border-border bg-card p-4 flex items-center gap-4"
        >
          <div
            className={`h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${bgClass}`}
          >
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
