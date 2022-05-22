import { Permission } from "../helpers/PermisionEnum";
import { Priority } from "../helpers/PriorityEnum";
import { StatusCode } from "../helpers/StatusCodeEnum";
import { Filter } from "./filter.";

export class GetAllProject extends Filter{
  projectName: string;
  projectType: string;
  projectCode: string;
  statusCode: StatusCode;
  riorityCode: Priority;
  createDateFrom: Date;
  createDateTo: Date;
  deadlineDateFrom: Date;
  deadlineDateTo: Date;
  completeDateFrom: Date;
  completeDateTo: Date;
  departmentId: string;
  permission: Permission;
  userId: string;
}
