import { IBase } from './root.types'

export interface ITimerRoundResponse extends IBase {
	isCompleted?: boolean
	totalSeconds: number
}

export interface ITimerSessionResponse extends IBase {
	isCompleted?: boolean
	rounds?: ITimerRoundResponse
}

export type TimerRoundTypeFromState = Partial<
	Omit<ITimerRoundResponse, 'id' | 'createdAt' | 'updatedAt'>
>

export type TimerSessionTypeFromState = Partial<
	Omit<ITimerSessionResponse, 'id' | 'createdAt' | 'updatedAt'>
>
