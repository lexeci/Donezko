import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';

// Custom hook for managing sortable time blocks
export function useTimeBlockSortable(itemId: UniqueIdentifier) {
    // Use the useSortable hook from dnd-kit
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: itemId });

    // Constructing style properties for the sortable item
    const sortableStyle: CSSProperties = {
        transform: CSS.Transform.toString(transform), // Apply transformation for dragging
        transition: transition || 'transform 0.2s ease', // Default transition if none provided
        cursor: 'normal', // Change cursor to indicate draggable item
    };

    return { attributes, listeners, setNodeRef, sortableStyle }; // Return relevant properties
}
