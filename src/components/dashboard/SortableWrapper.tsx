import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SortableWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  gripClassName?: string;
}

export function SortableWrapper({ id, children, className, gripClassName }: SortableWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative group/drag", isDragging && "opacity-50", className)}
    >
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover/drag:opacity-100 cursor-grab active:cursor-grabbing",
          gripClassName
        )}
        aria-label="Arrastar card"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {children}
    </div>
  );
}
