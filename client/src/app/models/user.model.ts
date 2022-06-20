import { Permission } from "../helpers/PermisionEnum";

export class AppUser{
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    password: string;
    departmentId: string;
    permissionCode: Permission;
}
