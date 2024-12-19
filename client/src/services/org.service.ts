import { axiosWithAuth } from "@/api/interceptors";
import type {
	JoinOrgType,
	ManageOrgUser,
	Organization,
	OrgFormData,
	OrgResponse,
	OrgRole,
	OrgUserResponse,
} from "@/types/org.types";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

class OrgService {
	private BASE_URL = "/user/organizations";

	async getOrganizations(): Promise<OrgResponse[]> {
		try {
			const response = await axiosWithAuth.get<OrgResponse[]>(this.BASE_URL);
			return response.data;
		} catch (error: any) {
			console.error(`Fetching organizations error:`, error);
			throw new Error(`Fetching organizations failed`);
		}
	}

	async getOrganizationById(organizationId: string): Promise<OrgResponse> {
		try {
			const response = await axiosWithAuth.get<OrgResponse>(
				`${this.BASE_URL}?organizationId=${organizationId}`
			);
			return response.data;
		} catch (error: any) {
			console.error(`Fetching organization error:`, error);
			throw new Error(`Fetching organization failed`);
		}
	}

	async getOrganizationUsers(
		organizationId: string,
		projectId?: string,
		hideFromProject?: boolean
	): Promise<OrgUserResponse[]> {
		try {
			const response = await axiosWithAuth.get<OrgUserResponse[]>(
				`${this.BASE_URL}/${organizationId}/users/${
					projectId ? `?projectId=${projectId}` : ""
				}${hideFromProject ? `&hide=${hideFromProject}` : ""}`
			);
			return response.data;
		} catch (error: any) {
			console.error(`Fetching organization users error:`, error);
			throw new Error(`Fetching organization users failed`);
		}
	}

	async getOrganizationRole(
		organizationId: string
	): Promise<{ role: OrgRole }> {
		try {
			const response = await axiosWithAuth.get<{ role: OrgRole }>(
				`${this.BASE_URL}/${organizationId}/role`
			);
			return response.data;
		} catch (error: any) {
			console.error(`Fetching organization error:`, error);
			throw new Error(`Fetching organization failed`);
		}
	}

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

	async updateOrganization(
		id: string,
		data: OrgFormData
	): Promise<OrgResponse> {
		try {
			const response = await axiosWithAuth.put<OrgResponse>(
				`${this.BASE_URL}/${id}`,
				data
			);
			return response.data; // Return only the data part
		} catch (error: any) {
			console.error("Error updating organization:", error);
			throw new Error("Could not update organization"); // Handle error appropriately
		}
	}

	async deleteOrganization(id: string): Promise<AxiosResponse> {
		try {
			const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`);
			return response; // Check if the deletion was successful
		} catch (error: any) {
			console.error("Error deleting organization:", error);
			throw new Error("Could not delete organization"); // Handle error appropriately
		}
	}

	async exitOrganization(id: string): Promise<AxiosResponse> {
		try {
			const response = await axiosWithAuth.delete(
				`${this.BASE_URL}/${id}/exit`
			);
			return response; // Check if the deletion was successful
		} catch (error: any) {
			console.error("Error exiting organization:", error);
			throw new Error("Could not exiting organization"); // Handle error appropriately
		}
	}

	async joinOrganization(data: JoinOrgType): Promise<OrgResponse> {
		try {
			const response = await axiosWithAuth.post(`${this.BASE_URL}/join`, data);
			return response.data; // Check if the deletion was successful
		} catch (error: any) {
			console.error("Error joining organization:", error);
			throw new Error("Could not join organization");
		}
	}

	async updateOwnerOrganization(
		id: string,
		orgUserId: string
	): Promise<OrgUserResponse> {
		try {
			const response = await axiosWithAuth.put(
				`${this.BASE_URL}/${id}/update-owner/`,
				{ orgUserId }
			);
			return response.data; // Check if the deletion was successful
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error updating owner of organization:", error);
			throw new Error("Could not update the owner of organization"); // Handle error appropriately
		}
	}

	async updateStatusOrganization(
		data: ManageOrgUser
	): Promise<OrgUserResponse> {
		try {
			const response = await axiosWithAuth.put(
				`${this.BASE_URL}/${data.id}/update-status/`,
				data
			);
			return response.data; // Check if the deletion was successful
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error updating owner of organization:", error);
			throw new Error("Could not update the owner of organization"); // Handle error appropriately
		}
	}

	async updateRoleOrganization(data: ManageOrgUser): Promise<OrgUserResponse> {
		try {
			const response = await axiosWithAuth.put(
				`${this.BASE_URL}/${data.id}/update-role/`,
				data
			);
			return response.data; // Check if the deletion was successful
		} catch (error: any) {
			error && toast.error(error.response.data.message);
			console.error("Error updating owner of organization:", error);
			throw new Error("Could not update the owner of organization"); // Handle error appropriately
		}
	}
}

export const orgService = new OrgService();
