import { useState, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

export function useSortableSections(initialOrder: string[]) {
  const [sectionOrder, setSectionOrder] = useState<string[]>(initialOrder);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((prev) => {
        const oldIndex = prev.indexOf(String(active.id));
        const newIndex = prev.indexOf(String(over.id));
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  return { sectionOrder, handleDragEnd };
}
