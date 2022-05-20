import { Priority } from "../helpers/PriorityEnum"
import { StatusCode } from "../helpers/StatusCodeEnum";
import { Filter } from "./filter.";

export class SearchTask extends Filter{
  taskName: string;
  priorityCode: Priority;
  statusCode: StatusCode;
  taskType: string;
  taskCode: string;
  createDateFrom: Date;
  createDateTo: Date;
  deadlineDateFrom: Date;
  deadlineDateTo: Date;
  completeDateFrom: Date;
  completeDateTo: Date;
}
