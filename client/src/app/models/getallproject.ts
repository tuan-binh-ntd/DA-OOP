import { Permission } from "../helpers/PermisionEnum";
import { Priority } from "../helpers/PriorityEnum";
import { StatusCode } from "../helpers/StatusCodeEnum";
import { Filter } from "./filter.";

export class GetAllProject extends Filter{
  keyWord: string;
  statusCode: StatusCode;
  projectType: string;
  priorityCode: Priority;
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
