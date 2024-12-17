'use client'

import cn from 'clsx'
import { Layout03Icon, CheckListIcon } from 'hugeicons-react';

import type { TypeView } from './TasksView'

interface SwitcherView {
	type: TypeView
	setType: (value: TypeView) => void
}

export function SwitcherView({ setType, type }: SwitcherView) {
	return (
		<div className='flex items-center gap-4 mb-5'>
			<button
				className={cn('flex items-center gap-1', {
					'opacity-40': type === 'kanban'
				})}
				onClick={() => setType('list')}
			>
				<CheckListIcon />
				List
			</button>
			<button
				className={cn('flex items-center gap-1', {
					'opacity-40': type === 'list'
				})}
				onClick={() => setType('kanban')}
			>
				<Layout03Icon />
				Board
			</button>
		</div>
	)
}
