import { Permission } from "../helpers/PermisionEnum";

export interface User {
  id: string,
  userName: string,
  email: string,
  departmentId: string,
  permissionCode: Permission,
  token: string
  photoUrl: string;
}
