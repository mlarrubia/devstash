import { Star, MoreHorizontal, Code, Sparkles, Terminal, StickyNote, Link2, File, Image as ImageIcon } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: Link2,
  File,
  Image: ImageIcon,
};

interface ItemType {
  id: string;
  icon: string;
  color: string;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  isFavorite: boolean;
  itemCount: number;
  defaultTypeId: string;
}

interface CollectionCardProps {
  collection: Collection;
  typeIds: string[];
  types: ItemType[];
}

export default function CollectionCard({ collection, typeIds, types }: CollectionCardProps) {
  const defaultType = types.find((t) => t.id === collection.defaultTypeId);
  const accentColor = defaultType?.color ?? "#6b7280";

  const collectionTypes = typeIds
    .map((id) => types.find((t) => t.id === id))
    .filter((t): t is ItemType => Boolean(t));

  return (
    <div
      className="rounded-lg border border-border bg-card p-4 hover:bg-muted/20 transition-colors cursor-pointer"
      style={{ borderLeftColor: accentColor, borderLeftWidth: "3px" }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-medium text-sm leading-tight">{collection.name}</h3>
        <div className="flex items-center gap-1 shrink-0">
          {collection.isFavorite && (
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
          )}
          <button className="p-0.5 rounded hover:bg-muted/60 text-muted-foreground transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-2">{collection.itemCount} items</p>

      {collection.description && (
        <p className="text-xs text-muted-foreground/70 line-clamp-2 mb-3">
          {collection.description}
        </p>
      )}

      {collectionTypes.length > 0 && (
        <div className="flex items-center gap-1.5 mt-1">
          {collectionTypes.map((type) => {
            const Icon = iconMap[type.icon] ?? File;
            return (
              <Icon key={type.id} className="h-3.5 w-3.5" style={{ color: type.color }} />
            );
          })}
        </div>
      )}
    </div>
  );
}
