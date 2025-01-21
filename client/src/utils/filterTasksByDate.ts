/**
 * @module utils/taskFilters
 * This module provides a utility function to filter tasks based on their creation date.
 * The `filterTasksByDate` function filters tasks according to various date-based categories, such as today, tomorrow, this week, and more.
 * It also provides functionality to filter tasks based on their completion status.
 */

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import {DATE_FILTERS} from "@/src/constants/tasks.constants";
import type {TaskResponse} from "@/types/task.types";

// Extending dayjs with necessary plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Filters a list of tasks based on a given filter value.
 * This function checks the creation date of the tasks and compares it with predefined date filters.
 * It also accounts for whether the task is completed or not.
 *
 * @param {TaskResponse[] | undefined} tasks - The list of tasks to filter. If undefined, an empty array is returned.
 * @param {string} filterValue - The filter value, which can be one of the following: 'today', 'tomorrow', 'thisWeek', 'nextWeek', 'later', 'completed'.
 * @returns {TaskResponse[]} The filtered list of tasks that match the given filter criteria.
 *
 * @example
 * const filteredTasks = filterTasksByDate(tasks, 'today'); // Filters tasks created today
 * const filteredTasks = filterTasksByDate(tasks, 'completed'); // Filters completed tasks
 */
export const filterTasksByDate = (
    tasks: TaskResponse[] | undefined,
    filterValue: string
) => {
    if (!tasks) return []; // Return an empty array if tasks are not provided

    // Helper function to check if a task is incomplete
    const isTaskIncomplete = (item: TaskResponse) => !item.isCompleted;

    // Strategy object to define filtering logic for different date categories
    const filterStrategies: Record<string, () => TaskResponse[]> = {
        today: () =>
            tasks.filter(
                item =>
                    item.createdAt && // Ensure createdAt is defined
                    dayjs(item.createdAt).isSame(dayjs(), "day") && // Check if task is created today
                    isTaskIncomplete(item) // Check if task is not completed
            ),

        tomorrow: () =>
            tasks.filter(
                item =>
                    dayjs(item.createdAt).isSame(DATE_FILTERS.tomorrow, "day") && // Check if task is created tomorrow
                    isTaskIncomplete(item) // Check if task is not completed
            ),

        thisWeek: () =>
            tasks.filter(
                item =>
                    item.createdAt && // Ensure createdAt is defined
                    !dayjs(item.createdAt).isSame(dayjs(), "day") && // Exclude today
                    !dayjs(item.createdAt).isSame(DATE_FILTERS.tomorrow) && // Exclude tomorrow
                    dayjs(item.createdAt).isSameOrBefore(DATE_FILTERS.thisWeek) && // Check if task is created this week
                    isTaskIncomplete(item) // Check if task is not completed
            ),

        nextWeek: () =>
            tasks.filter(
                item =>
                    dayjs(item.createdAt).isAfter(DATE_FILTERS.thisWeek) && // Check if task is after this week
                    dayjs(item.createdAt).isSameOrBefore(DATE_FILTERS.nextWeek) && // Check if task is within next week
                    isTaskIncomplete(item) // Check if task is not completed
            ),

        later: () =>
            tasks.filter(
                item =>
                    (dayjs(item.createdAt).isAfter(DATE_FILTERS.nextWeek) || !item.createdAt) && // Check if task is created after next week or has no creation date
                    isTaskIncomplete(item) // Check if task is not completed
            ),

        completed: () => tasks.filter(item => item.isCompleted), // Filter completed tasks
    };

    // Return the filtered tasks according to the provided filterValue
    return filterStrategies[filterValue]?.() || [];
};
