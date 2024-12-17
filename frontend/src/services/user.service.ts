import { axiosWithAuth } from "@/api/interceptors"; 
import { UserTypeForm } from "@/types/auth.types";
import { IBase } from "@/types/root.types";

export interface IProfileResponse {
  user: IBase,
  statistics: {
    label: string,
    value: string
  }[]
}

class UserService {
  private BASE_URL = '/user/profile'

  async getProfile() {
    const response = await axiosWithAuth.get<IProfileResponse>(this.BASE_URL)
    return response.data
  }

  async update(data: UserTypeForm) {
    const response = await axiosWithAuth.put(this.BASE_URL, data)
    return response.data
  }
}

export const userService = new UserService()