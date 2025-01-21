/**
 * A class to handle the routes for the dashboard-related pages.
 * This class defines static readonly properties representing different pages
 * in the dashboard, such as Home, Tasks, Habits, Timer, and Settings.
 *
 * @module DASHBOARD
 */
class DASHBOARD {
    // The base path for the dashboard
    private static root = "/workspace";

    // Static readonly properties for different dashboard routes
    static readonly HOME = this.root;
    static readonly TASKS = `${this.root}/tasks`;
    static readonly HABITS = `${this.root}/habits`;
    static readonly TIMER = `${this.root}/timer`;
    static readonly SETTINGS = `${this.root}/settings`;

    // Prevent instantiation of the class
    private constructor() {
    }
}

// Exporting the routes for use throughout the application
export const DASHBOARD_PAGES = DASHBOARD;
