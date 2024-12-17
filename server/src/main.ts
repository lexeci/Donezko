import { NestFactory } from '@nestjs/core'; // Importing NestFactory to create the application instance
import * as cookieParser from 'cookie-parser'; // Importing the cookie-parser middleware for cookie handling
import { AppModule } from './app.module'; // Importing the root AppModule that contains all the feature modules

/**
 * Main entry point to bootstrap the NestJS application.
 *
 * This function initializes and configures the NestJS application instance and sets up various
 * global configurations such as request prefix, middleware, and CORS (Cross-Origin Resource Sharing).
 *
 * @function bootstrap
 * @async
 */
async function bootstrap() {
	// Creating the NestJS application instance with AppModule
	const app = await NestFactory.create(AppModule);

	// Setting a global prefix for all routes in the application
	// This means all API routes will be prefixed with `/api`
	app.setGlobalPrefix('api');

	// Using cookieParser middleware to enable parsing of cookies in the request
	// This is useful when handling authentication or any other functionality that requires cookie management
	app.use(cookieParser());

	/**
	 * Enabling CORS (Cross-Origin Resource Sharing) for the application.
	 *
	 * The origin specifies the allowed domains for cross-origin requests. Here, it allows only requests from `http://localhost:3000`.
	 * The credentials option enables sending cookies in cross-origin requests, and the exposedHeaders option specifies which headers
	 * should be exposed to the client (in this case, the 'set-cookie' header is exposed to the client).
	 */
	app.enableCors({
		origin: [
			'http://localhost:3000' // Allowing requests only from the localhost front-end (port 3000)
		],
		credentials: true, // Allowing credentials (cookies) to be sent with requests
		exposedHeaders: 'set-cookie' // Exposing the 'set-cookie' header to the client, which is essential for handling authentication cookies
	});

	// Starting the server and listening on port 3001
	await app.listen(3001);
}

// Calling the bootstrap function to start the application
bootstrap();
