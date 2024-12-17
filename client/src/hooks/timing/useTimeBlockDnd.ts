import {
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

import { TimeBlockResponse } from '@/types/time-block.types';
import { timeBlockService } from '@/services/time-block.service';

export function useTimeBlockDnd(
	blocks: TimeBlockResponse[] | undefined,
	setBlocks: Dispatch<SetStateAction<TimeBlockResponse[] | undefined>>
) {
	const sensors = useSensors(
			useSensor(PointerSensor),
			useSensor(KeyboardSensor)
	);

	const queryClient = useQueryClient();

	const updateOrderMutation = useMutation({
			mutationKey: ['update time block order'],
			mutationFn: (ids: string[]) => timeBlockService.updateOrderTimeBlock(ids),
			onSuccess() {
					queryClient.invalidateQueries({ queryKey: ['time-blocks'] });
			},
	});

	const handleDragEnd = (event: DragEndEvent) => {
			const { active, over } = event;

			if (active.id !== over?.id && blocks) {
					const oldIndex = blocks.findIndex(block => block.id === active.id);
					const newIndex = blocks.findIndex(block => block.id === (over?.id || ''));

					if (oldIndex >= 0 && newIndex >= 0) {
							const updatedBlocks = arrayMove(blocks, oldIndex, newIndex);
							setBlocks(updatedBlocks);
							updateOrderMutation.mutate(updatedBlocks.map(block => block.id));
					}
			}
	};

	return { handleDragEnd, sensors };
}