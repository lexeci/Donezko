import { useFormContext } from 'react-hook-form'

import type {
	TimeBlockResponse,
	TypeTimeBlockFormState
} from '@/types/time-block.types'

import styles from './TimeBlocking.module.scss'
import { useDeleteTimeBlock } from './hooks/useDeleteTimeBlock'
import { useTimeBlockSortable } from './hooks/useTimeBlockSortable'
import { DragDropVerticalIcon, Loading03Icon, PencilEdit02Icon, WasteIcon } from 'hugeicons-react'

export function TimeBlock({ item }: { item: TimeBlockResponse }) {
	const { attributes, listeners, setNodeRef, style } = useTimeBlockSortable(
		item.id
	)
	const { reset } = useFormContext<TypeTimeBlockFormState>()
	const { deleteTimeBlock, isDeletePending } = useDeleteTimeBlock(item.id)

	return (
		<div
			ref={setNodeRef}
			style={style}
		>
			<div
				className={styles.block}
				style={{
					backgroundColor: item.color || 'lightgray',
					height: `${item.duration}px`
				}}
			>
				<div className='flex items-center'>
					<button
						{...attributes}
						{...listeners}
						aria-describedby='time-block'
					>
											<DragDropVerticalIcon className={styles.grip} />
					</button>
					<div>
						{item.title}{' '}
						<i className='text-xs opacity-50'>({item.duration} min.)</i>
					</div>
				</div>

				<div className={styles.actions}>
					<button
						onClick={() => {
							reset({
								id: item.id,
								color: item.color,
								duration: item.duration,
								title: item.title,
								order: item.order
							})
						}}
						className='opacity-50 transition-opacity hover:opacity-100 mr-2'
					>
						<PencilEdit02Icon size={16}/>
					</button>
					<button
						onClick={() => deleteTimeBlock()}
						className='opacity-50 transition-opacity hover:opacity-100'
					>
												{isDeletePending ? <Loading03Icon size={16} /> : <WasteIcon size={16} />}
					</button>
				</div>
			</div>
		</div>
	)
}
