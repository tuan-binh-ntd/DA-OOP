import { Priority } from "../helpers/PriorityEnum";
import { StatusCode } from "../helpers/StatusCodeEnum";
import { Filter } from "./filter.";

export class GetAllTask extends Filter{
    userId: string;
    projectId: string;
    createUserId: string;
    keyWord: string;
    priorityCode: Priority;
    statusCode: StatusCode;
    createDateFrom: Date;
    createDateTo: Date;
    deadlineDateFrom: Date;
    deadlineDateTo: Date;
    completeDateFrom: Date;
    completeDateTo: Date;
  }