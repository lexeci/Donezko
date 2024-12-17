import { AuthModule } from '@/api/auth/auth.module'; // Importing the AuthModule for user authentication functionality
import { extendedApiModule } from '@/api/extended-api/extended-api.module'; // Importing the extendedApiModule for accessing external APIs like weather and advice
import { OrgModule } from '@/api/org/org.module'; // Importing the OrgModule for managing organizations
import { PermissionModule } from '@/api/permission/permission.module'; // Importing the PermissionModule for managing permissions and roles
import { ProjectModule } from '@/api/project/project.module'; // Importing the ProjectModule for handling project-related operations
import { TaskModule } from '@/api/task/task.module'; // Importing the TaskModule for handling tasks related to projects
import { TimeBlockModule } from '@/api/time-block/time-block.module'; // Importing the TimeBlockModule for managing time blocks
import { TimerModule } from '@/api/timer/timer.module'; // Importing the TimerModule for managing timers associated with tasks or projects
import { UserModule } from '@/api/user/user.module'; // Importing the UserModule for managing user-related operations
import { Module } from '@nestjs/common'; // Core module decorator from NestJS
import { ConfigModule } from '@nestjs/config'; // Importing ConfigModule for configuration management
import { TeamModule } from './api/team/team.module'; // Importing the TeamModule for managing teams
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * AppModule - The root module that brings together all the individual modules of the application.
 *
 * This module is the main entry point that imports and wires together all the feature modules
 * in the application. It encapsulates all the necessary services, controllers, and configurations
 * to make the application functional.
 *
 * @module AppModule
 */
@Module({
	/**
	 * The imports array lists all the modules that are imported into this module.
	 * Each module encapsulates a set of functionalities related to a specific domain,
	 * such as authentication, user management, permissions, teams, projects, and external APIs.
	 *
	 * @property {Array} imports - List of feature modules integrated into this module.
	 */
	controllers: [AppController],
	providers: [AppService],
	imports: [
		ConfigModule.forRoot(), // ConfigModule is imported to allow configuration management across the application
		AuthModule, // AuthModule handles user authentication and JWT token management
		PermissionModule, // PermissionModule is used for managing roles and permissions for users and teams
		UserModule, // UserModule is responsible for managing user-related CRUD operations
		OrgModule, // OrgModule provides functionality related to organizations, such as creating and updating organizations
		ProjectModule, // ProjectModule handles project management, including creation and updates
		TeamModule, // TeamModule is responsible for managing teams within organizations
		TaskModule, // TaskModule manages tasks, which can be part of projects
		TimeBlockModule, // TimeBlockModule is used for managing time-related tasks, such as tracking time spent on tasks
		TimerModule, // TimerModule manages timers for tasks, projects, or other time-sensitive operations
		extendedApiModule // extendedApiModule provides access to external APIs, such as weather data or advice generation
	]
})
export class AppModule {}
