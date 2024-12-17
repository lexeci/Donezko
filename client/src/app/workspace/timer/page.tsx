import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Timer } from './timer' 

export const metadata: Metadata = {
	title: 'Timer timer',
	...NO_INDEX_PAGE
}

export default function TimerPage() {
	return (
		<div className='pomodoro-timer flex justify-center items-center w-full h-full'>
			<Timer />
		</div>
	)
}
