import type { Dispatch, SetStateAction } from 'react'

import type { ITimerRoundResponse } from '@/types/timer.types'

export interface ITimerState {
	isRunning: boolean
	secondsLeft: number
	activeRound: ITimerRoundResponse | undefined

	setIsRunning: Dispatch<SetStateAction<boolean>>
	setSecondsLeft: Dispatch<SetStateAction<number>>
	setActiveRound: Dispatch<SetStateAction<ITimerRoundResponse | undefined>>
}
