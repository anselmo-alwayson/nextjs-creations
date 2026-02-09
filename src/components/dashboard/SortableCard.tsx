import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
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
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover/drag:opacity-100 cursor-grab active:cursor-grabbing"
        aria-label="Arrastar card"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {children}
    </Card>
  );
}
