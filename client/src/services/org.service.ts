import { axiosWithAuth } from "@/api/interceptors"; // Axios instance with authentication
import type {
  JoinOrgType,
  ManageOrgUser,
  Organization,
  OrgFormData,
  OrgResponse,
  OrgRole,
  OrgUserResponse,
} from "@/types/org.types"; // Types for organization and user data
import { AccessStatus } from "@/types/root.types"; // Toast notifications library
import { AxiosResponse } from "axios"; // Axios response type
import { toast } from "sonner";

/**
 * @class OrgService
 *
 * Service for managing organizations, users, roles, and memberships within organizations.
 * It provides methods to fetch, create, update, and delete organizations and users,
 * as well as manage user roles and statuses within an organization.
 *
 * Methods:
 * - `getOrganizations`: Fetches all organizations for the current user.
 * - `getOrganizationById`: Fetches details of a specific organization by its ID.
 * - `getOrganizationUsers`: Fetches users of a specific organization with optional filters for projects and teams.
 * - `getOrganizationRole`: Fetches the role of a user within a specific organization.
 * - `createOrganization`: Creates a new organization.
 * - `updateOrganization`: Updates an existing organization by its ID.
 * - `deleteOrganization`: Deletes an organization by its ID.
 * - `exitOrganization`: Allows a user to exit an organization by its ID.
 * - `joinOrganization`: Allows a user to join an organization.
 * - `updateOwnerOrganization`: Updates the owner of an organization.
 * - `updateStatusOrganization`: Updates the status of a user in an organization.
 * - `updateRoleOrganization`: Updates the role of a user in an organization.
 *
 * Error handling is included with appropriate toast notifications and error logging.
 *
 * Example usage:
 * @example
 * const organizations = await orgService.getOrganizations();
 * const organization = await orgService.getOrganizationById("org123");
 * const users = await orgService.getOrganizationUsers("org123", "project123", true);
 * const newOrg = await orgService.createOrganization({ name: "New Organization" });
 * const updatedOrg = await orgService.updateOrganization("org123", { name: "Updated Organization" });
 * const deletedOrg = await orgService.deleteOrganization("org123");
 */
class OrgService {
  private BASE_URL = "/user/organizations"; // Base URL for the organization API

  /**
   * Fetches all organizations for the current user.
   * @returns {Promise<OrgResponse[]>} - List of organizations
   * @throws {Error} - If an error occurs while fetching organizations
   * @example
   * const organizations = await orgService.getOrganizations();
   */
  async getOrganizations(): Promise<OrgResponse[]> {
    try {
      const response = await axiosWithAuth.get<OrgResponse[]>(this.BASE_URL);
      return response.data;
    } catch (error: any) {
      console.error(`Fetching organizations error:`, error);
      throw new Error(`Fetching organizations failed`);
    }
  }

  /**
   * Fetches details of a specific organization by its ID.
   * @param organizationId - The ID of the organization to fetch
   * @returns {Promise<OrgResponse>} - The organization details
   * @throws {Error} - If an error occurs while fetching the organization
   * @example
   * const organization = await orgService.getOrganizationById("org123");
   */
  async getOrganizationById(organizationId: string): Promise<OrgResponse> {
    try {
      const response = await axiosWithAuth.get<OrgResponse>(
        `${this.BASE_URL}?organizationId=${organizationId}`
      );
      return response.data;
    } catch (error: any) {
      error && toast.error(error.response.data.message);
      console.error(`Fetching organization error:`, error);
      throw new Error(`Fetching organization failed`);
    }
  }

  /**
   * Fetches users of a specific organization with optional filters for projects and teams.
   * @param organizationId - The ID of the organization
   * @param projectId - The ID of the project (optional)
   * @param hideFromProject - Whether to hide users from the project (optional)
   * @param teamId - The ID of the team (optional)
   * @param hideFromTeam - Whether to hide users from the team (optional)
   * @returns {Promise<OrgUserResponse[]>} - List of users in the organization
   * @throws {Error} - If an error occurs while fetching organization users
   * @example
   * const users = await orgService.getOrganizationUsers("org123", "project123", true);
   */
  async getOrganizationUsers(
    organizationId: string, // Organization ID for which to fetch users
    projectId?: string, // Optional project filter
    hideFromProject?: boolean, // Optional flag to hide users from the project
    teamId?: string, // Optional team filter
    hideFromTeam?: boolean // Optional flag to hide users from the team
  ): Promise<OrgUserResponse[]> {
    const params = new URLSearchParams();

    if (organizationId) params.append("organizationId", organizationId);
    if (projectId) params.append("projectId", projectId);
    if (hideFromProject) params.append("hideProject", "true");
    if (teamId) params.append("teamId", teamId);
    if (hideFromTeam) params.append("hideTeam", "true");

    const url = `${this.BASE_URL}/${organizationId}/users${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    try {
      const response = await axiosWithAuth.get<OrgUserResponse[]>(url);
      return response.data;
    } catch (error: any) {
      console.error(`Fetching organization users error:`, error);
      throw new Error(`Fetching organization users failed`);
    }
  }

  /**
   * Fetches the role of a user within a specific organization.
   * @param organizationId - The ID of the organization
   * @returns {Promise<{ role: OrgRole }>} - The user's role in the organization
   * @throws {Error} - If an error occurs while fetching the organization role
   * @example
   * const role = await orgService.getOrganizationRole("org123");
   */
  async getOrganizationRole(
    organizationId: string // Organization ID to fetch the role of the user
  ): Promise<{ role: OrgRole; status: AccessStatus }> {
    try {
      const response = await axiosWithAuth.get<{
        role: OrgRole;
        status: AccessStatus;
      }>(
        `${this.BASE_URL}/${organizationId}/role/?organizationId=${organizationId}`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Fetching organization error:`, error);
      throw new Error(`Fetching organization failed`);
    }
  }

  /**
   * Creates a new organization.
   * @param data - Data required to create the new organization
   * @returns {Promise<Organization>} - The created organization
   * @throws {Error} - If an error occurs while creating the organization
   * @example
   * const newOrg = await orgService.createOrganization({ name: "New Organization" });
   */
  async createOrganization(data: OrgFormData): Promise<Organization> {
    try {
      const response = await axiosWithAuth.post<Organization>(
        this.BASE_URL,
        data
      );
      return response.data; // Return only the data part
    } catch (error: any) {
      console.error("Error creating organization:", error);
      throw new Error("Could not create organization"); // Handle error appropriately
    }
  }

  /**
   * Updates an existing organization by its ID.
   * @param id - The ID of the organization to update
   * @param data - Data for the updated organization
   * @returns {Promise<OrgResponse>} - The updated organization
   * @throws {Error} - If an error occurs while updating the organization
   * @example
   * const updatedOrg = await orgService.updateOrganization("org123", { name: "Updated Organization" });
   */
  async updateOrganization(
    id: string, // The ID of the organization to update
    data: OrgFormData // The updated data for the organization
  ): Promise<OrgResponse> {
    try {
      const response = await axiosWithAuth.put<OrgResponse>(
        `${this.BASE_URL}/${id}/?organizationId=${id}`,
        data
      );
      return response.data; // Return only the data part
    } catch (error: any) {
      console.error("Error updating organization:", error);
      throw new Error("Could not update organization"); // Handle error appropriately
    }
  }

  /**
   * Deletes an organization by its ID.
   * @param id - The ID of the organization to delete
   * @returns {Promise<AxiosResponse>} - The response from the API
   * @throws {Error} - If an error occurs while deleting the organization
   * @example
   * const deletedOrg = await orgService.deleteOrganization("org123");
   */
  async deleteOrganization(id: string): Promise<AxiosResponse> {
    try {
      const response = await axiosWithAuth.delete(
        `${this.BASE_URL}/${id}?organizationId=${id}`
      );
      return response; // Check if the deletion was successful
    } catch (error: any) {
      console.error("Error deleting organization:", error);
      throw new Error("Could not delete organization"); // Handle error appropriately
    }
  }

  /**
   * Allows a user to exit an organization by its ID.
   * @param id - The ID of the organization to exit
   * @returns {Promise<AxiosResponse>} - The response from the API
   * @throws {Error} - If an error occurs while exiting the organization
   * @example
   * const response = await orgService.exitOrganization("org123");
   */
  async exitOrganization(id: string): Promise<AxiosResponse> {
    try {
      const response = await axiosWithAuth.delete(
        `${this.BASE_URL}/${id}/exit?organizationId=${id}`
      );
      return response; // Check if the deletion was successful
    } catch (error: any) {
      console.error("Error exiting organization:", error);
      throw new Error("Could not exit organization"); // Handle error appropriately
    }
  }

  /**
   * Allows a user to join an organization.
   * @param data - Data for joining the organization
   * @returns {Promise<Organization>} - The organization the user joined
   * @throws {Error} - If an error occurs while joining the organization
   * @example
   * const joinedOrg = await orgService.joinOrganization({ orgId: "org123", userId: "user123" });
   */
  async joinOrganization(data: JoinOrgType): Promise<Organization> {
    try {
      const response = await axiosWithAuth.post(`${this.BASE_URL}/join`, data);
      return response.data; // Check if the deletion was successful
    } catch (error: any) {
      console.error("Error joining organization:", error);
      throw new Error("Could not join organization");
    }
  }

  /**
   * Updates the owner of an organization.
   * @param id - The ID of the organization to update
   * @param orgUserId - The ID of the user to set as the new owner
   * @returns {Promise<OrgUserResponse>} - The updated user response
   * @throws {Error} - If an error occurs while updating the owner
   * @example
   * const updatedOwner = await orgService.updateOwnerOrganization("org123", "user123");
   */
  async updateOwnerOrganization(
    id: string, // Organization ID
    orgUserId: string // New owner's user ID
  ): Promise<OrgUserResponse> {
    try {
      const response = await axiosWithAuth.put(
        `${this.BASE_URL}/${id}/update-owner/?organizationId=${id}`,
        { orgUserId }
      );
      return response.data; // Check if the deletion was successful
    } catch (error: any) {
      error && toast.error(error.response.data.message);
      console.error("Error updating owner of organization:", error);
      throw new Error("Could not update the owner of organization"); // Handle error appropriately
    }
  }

  /**
   * Updates the status of a user in an organization.
   * @param data - Data containing the user ID and the new status
   * @returns {Promise<OrgUserResponse>} - The updated user response
   * @throws {Error} - If an error occurs while updating the status
   * @example
   * const updatedStatus = await orgService.updateStatusOrganization({ id: "user123", status: "inactive" });
   */
  async updateStatusOrganization(
    data: ManageOrgUser // Data containing the user ID and status
  ): Promise<OrgUserResponse> {
    try {
      const response = await axiosWithAuth.put(
        `${this.BASE_URL}/${data.id}/update-status/?organizationId=${data.id}`,
        data
      );
      return response.data; // Check if the deletion was successful
    } catch (error: any) {
      error && toast.error(error.response.data.message);
      console.error("Error updating status of organization user:", error);
      throw new Error("Could not update status of user in organization"); // Handle error appropriately
    }
  }

  /**
   * Updates the role of a user in an organization.
   * @param data - Data containing the user ID and the new role
   * @returns {Promise<OrgUserResponse>} - The updated user response
   * @throws {Error} - If an error occurs while updating the role
   * @example
   * const updatedRole = await orgService.updateRoleOrganization({ id: "user123", role: OrgRole.ADMIN });
   */
  async updateRoleOrganization(data: ManageOrgUser): Promise<OrgUserResponse> {
    try {
      const response = await axiosWithAuth.put(
        `${this.BASE_URL}/${data.id}/update-role/?organizationId=${data.id}`,
        data
      );
      return response.data; // Check if the deletion was successful
    } catch (error: any) {
      error && toast.error(error.response.data.message);
      console.error("Error updating role of organization user:", error);
      throw new Error("Could not update role of user in organization"); // Handle error appropriately
    }
  }
}

// Export the service instance for use in other parts of the application
export const orgService = new OrgService();
