// Define a type alias for UUIDs
type UUID = string; // You can replace this with a more specific validation if necessary

/**
 * Base interface for entities with common properties.
 */
export interface RootBase {
	id: UUID; // Unique identifier for the entity, could be a UUID
	createdAt?: Date | string; // Optional timestamp for creation, consider using Date for type safety
	updatedAt?: Date; // Optional timestamp for last update, consider using Date for type safety
}
