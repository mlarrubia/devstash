import {
  Star,
  Pin,
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link2,
  File,
  Image as ImageIcon,
} from "lucide-react";

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
  name: string;
}

interface Item {
  id: string;
  title: string;
  description?: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: Date;
}

interface ItemCardProps {
  item: Item;
  type: ItemType | undefined;
}

export default function ItemCard({ item, type }: ItemCardProps) {
  const Icon = type ? (iconMap[type.icon] ?? File) : File;
  const color = type?.color ?? "#6b7280";

  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(item.createdAt);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer">
      <div
        className="h-9 w-9 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-medium truncate">{item.title}</span>
          {item.isFavorite && (
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
          )}
          {item.isPinned && (
            <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
        </div>

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{dateStr}</span>
    </div>
  );
}
