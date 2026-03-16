import Link from "next/link";
import { Pin, Clock } from "lucide-react";
import { mockCollections, mockItems, mockItemTypes } from "@/lib/mock-data";
import StatsCards from "@/components/dashboard/StatsCards";
import CollectionCard from "@/components/dashboard/CollectionCard";
import ItemCard from "@/components/dashboard/ItemCard";

// Compute which item type IDs appear in each collection
const collectionTypeIds: Record<string, string[]> = {};
mockItems.forEach((item) => {
  item.collectionIds.forEach((colId) => {
    if (!collectionTypeIds[colId]) collectionTypeIds[colId] = [];
    if (!collectionTypeIds[colId].includes(item.itemTypeId)) {
      collectionTypeIds[colId].push(item.itemTypeId);
    }
  });
});

const pinnedItems = mockItems.filter((i) => i.isPinned);
const recentItems = [...mockItems]
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  .slice(0, 10);

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your developer knowledge hub</p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Collections */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Collections</h2>
          <Link
            href="/collections"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCollections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              typeIds={collectionTypeIds[col.id] ?? []}
              types={mockItemTypes}
            />
          ))}
        </div>
      </section>

      {/* Pinned */}
      {pinnedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Pinned</h2>
          </div>
          <div className="space-y-2">
            {pinnedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                type={mockItemTypes.find((t) => t.id === item.itemTypeId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Recent</h2>
        </div>
        <div className="space-y-2">
          {recentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type={mockItemTypes.find((t) => t.id === item.itemTypeId)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
