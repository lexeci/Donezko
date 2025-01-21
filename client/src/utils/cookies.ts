/**
 * @module utils/cookies
 * This module provides utility functions to interact with cookies related to the selected organization.
 * It allows for saving, retrieving, and removing the organization data in/from cookies.
 */

import Cookies from "js-cookie";

/**
 * Saves the selected organization ID to cookies.
 * This function sets a cookie with the key "selectedOrganization" and the specified organization ID.
 * The cookie expires in 365 days.
 *
 * @param {string} orgId - The ID of the organization to save in cookies.
 * @returns {void}
 *
 * @example
 * saveOrganizationToCookies("org123"); // Saves the organization ID "org123" to cookies
 */
export const saveOrganizationToCookies = (orgId: string): void => {
    Cookies.set("selectedOrganization", orgId, {expires: 365}); // expires: 365 - stores for a year
};

/**
 * Retrieves the selected organization ID from cookies.
 * This function gets the value of the "selectedOrganization" cookie.
 * If the cookie is not found, it returns `undefined`.
 *
 * @returns {string | undefined} The organization ID from cookies or `undefined` if not found.
 *
 * @example
 * const orgId = getOrganizationFromCookies(); // Retrieves the organization ID or `undefined`
 */
export const getOrganizationFromCookies = (): string | undefined => {
    const organizationId = Cookies.get("selectedOrganization");
    return organizationId; // Returns either the organization ID or undefined if cookie is not found
};

/**
 * Removes the selected organization ID from cookies.
 * This function deletes the "selectedOrganization" cookie.
 *
 * @returns {void}
 *
 * @example
 * removeOrganizationFromCookies(); // Removes the organization ID from cookies
 */
export const removeOrganizationFromCookies = (): void => {
    Cookies.remove("selectedOrganization");
};
