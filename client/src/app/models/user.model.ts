import { Permission } from "../helpers/PermisionEnum";
import { Photo } from "./photo";

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
    photos: Photo[]
}
