// Define a type alias for UUIDs
export type UUID = string; // A UUID is represented as a string. This can be used for unique identifiers.

/**
 * Base interface for entities with common properties.
 * This interface includes common properties like `id`, `createdAt`, and `updatedAt` that can be shared by other models.
 */
export interface RootBase {
    id: UUID; // Unique identifier for the entity, typically a UUID.
    createdAt?: Date; // Optional timestamp indicating when the entity was created. Using `Date` provides type safety.
    updatedAt?: Date; // Optional timestamp indicating when the entity was last updated. Using `Date` provides type safety.
}

// Enum for access status, which can be either active or banned.
export enum AccessStatus {
    BANNED = "BANNED", // User is banned and has restricted access
    ACTIVE = "ACTIVE", // User is active and has normal access
}
