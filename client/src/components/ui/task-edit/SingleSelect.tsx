import cn from 'clsx'
import { MultiplicationSignIcon } from 'hugeicons-react'

import { Badge } from '@/components/ui/Badge'

import { useOutside } from '@/hooks/useOutside'

export interface Option {
	label: string
	value: string
}

interface SingleSelect {
	data: Option[]
	onChange: (value: string) => void
	value: string
	isColorSelect?: boolean
}

export function SingleSelect({
	data,
	onChange,
	value,
	isColorSelect
}: SingleSelect) {
	const { isShow, setIsShow, ref } = useOutside(false)
	const getValue = () => data.find(item => item.value === value)?.value

	return (
		<div
			className={cn('relative flex flex-row justify-between items-center min-w-36', {
				'w-max': isColorSelect
			})}
			ref={ref}
		>
			<button
				onClick={e => {
					e.preventDefault()
					setIsShow(!isShow)
				}}
			>
				{getValue() ? (
					<Badge
						variant={value}
						className='capitalize'
						style={isColorSelect ? { backgroundColor: value } : {}}
					>
						{getValue()}
					</Badge>
				) : (
					<Badge>Click for select</Badge>
				)}
			</button>
			{value && (
				<button
					className='relative block opacity-30 hover:opacity-100 transition-opacity'
					onClick={e => {
						e.preventDefault()
						onChange('')
					}}
				>
					<MultiplicationSignIcon size={14} />
				</button>
			)}
			{isShow && (
				<div
					className={cn(
						'absolute w-auto p-2.5 left-0 slide bg-blockColor border border-borderColor z-10 shadow '
					)}
					style={{
						top: 'calc(100% + .5rem)'
					}}
				>
					{data.map(item => (
						<button
							key={item.value}
							onClick={e => {
								e.preventDefault()
								onChange(item.value)
								setIsShow(false)
							}}
							className='block mb-4 last:mb-0 capitalize rounded-lg'
							style={
								isColorSelect
									? {
											backgroundColor: item.value
										}
									: {}
							}
						>
							<Badge variant={item.value}>{item.label}</Badge>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
