import dayjs, {type Dayjs} from 'dayjs';
import 'dayjs/locale/ru'; // Import Russian locale for dayjs
import isoWeek from 'dayjs/plugin/isoWeek'; // ISO week plugin for week number calculations
import weekOfYear from 'dayjs/plugin/weekOfYear'; // Plugin for working with week numbers of the year

// Extending dayjs with plugins for ISO week and week of the year functionality
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

/**
 * @constant DATE_FILTERS
 * An object that defines various date filters used for filtering tasks based on time.
 * Each key represents a specific filter criteria, and the corresponding value is the date
 * used for that filter.
 *
 * Filters:
 * - `today`: The start of the current day.
 * - `tomorrow`: The start of the next day.
 * - `thisWeek`: The end of the current ISO week.
 * - `nextWeek`: The start of the next week.
 * - `later`: The start of the week two weeks from now.
 *
 * @example
 * const todayFilter = DATE_FILTERS.today; // Returns the start of today
 */
export const DATE_FILTERS: Record<string, Dayjs> = {
    today: dayjs().startOf('day'),
    tomorrow: dayjs().add(1, 'day').startOf('day'),
    thisWeek: dayjs().endOf('isoWeek'),
    nextWeek: dayjs().add(1, 'week').startOf('day'),
    later: dayjs().add(2, 'week').startOf('day')
};

/**
 * @constant TASK_COLUMNS
 * An array of objects that define the columns for task data in a user interface.
 * Each object contains:
 * - `label`: The display label for the column.
 * - `value`: The key that represents the filter or category for the column.
 *
 * Columns represent different time periods for which tasks can be filtered or grouped.
 *
 * @example
 * const column = TASK_COLUMNS[0]; // { label: 'Today', value: 'today' }
 */
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
