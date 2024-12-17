import type { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Timer } from './timer' 

export const metadata: Metadata = {
	title: 'Timer timer',
	...NO_INDEX_PAGE
}

export default function TimerPage() {
	return (
		<div>
			<Heading title='Timer timer' />
			<Timer />
		</div>
	)
}
