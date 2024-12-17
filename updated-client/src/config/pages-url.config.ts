class DASHBOARD {
	private static root = "/workspace";

	static readonly HOME = this.root;
	static readonly TASKS = `${this.root}/tasks`;
	static readonly HABITS = `${this.root}/habits`;
	static readonly TIMER = `${this.root}/timer`;
	static readonly CHRONO_BLOCKS = `${this.root}/timing`;
	static readonly SETTINGS = `${this.root}/settings`;

	// Prevent instantiation
	private constructor() {}
}

// Exporting the routes for use throughout the application
export const DASHBOARD_PAGES = DASHBOARD;
