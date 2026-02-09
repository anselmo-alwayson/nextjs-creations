import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SortableCardProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SortableCard({ id, children, className }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("relative group/drag", isDragging && "opacity-50", className)}
    >
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover/drag:opacity-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Search className="h-3.5 w-3.5" />
        </div>
        <button
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground cursor-grab active:cursor-grabbing"
          aria-label="Arrastar card"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </Card>
  );
}