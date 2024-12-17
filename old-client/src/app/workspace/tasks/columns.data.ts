import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ru'; // Імпорт локалі
import isoWeek from 'dayjs/plugin/isoWeek'; // Плагін ISO неделя
import weekOfYear from 'dayjs/plugin/weekOfYear'; // Плагін для роботи з тижнями

// Розширення dayjs плагінами
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

// Визначення фільтрів
export const DATE_FILTERS: Record<string, Dayjs> = {
	today: dayjs().startOf('day'),
	tomorrow: dayjs().add(1, 'day').startOf('day'),
	thisWeek: dayjs().endOf('isoWeek'),
	nextWeek: dayjs().add(1, 'week').startOf('day'),
	later: dayjs().add(2, 'week').startOf('day')
};

// Визначення колонок
export const TASK_COLUMNS = [
	{
		label: 'Today',
		value: 'today'
	},
	{
		label: 'Tomorrow',
		value: 'tomorrow'
	},
	{
		label: 'This Week',
		value: 'thisWeek'
	},
	{
		label: 'Next Week',
		value: 'nextWeek'
	},
	{
		label: 'Later',
		value: 'later'
	},
	{
		label: 'Completed',
		value: 'completed'
	}
];
