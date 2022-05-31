using API.Data;
using API.DTO;
using API.Entity;
using API.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/task")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TaskController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet("getall")]
        public async Task<ActionResult> GetTaskForUserOrProject(string taskType, Guid? userId, Guid? projectId, Guid? createUserId, string keyWord, Priority? priorityCode, StatusCode? statusCode, DateTime? createDateFrom, DateTime? createDateTo, DateTime? deadlineDateFrom, DateTime? deadlineDateTo, DateTime? completeDateFrom, DateTime? completeDateTo)

        {

            var taskList = _dataContext.Task.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(keyWord))
            {
                taskList = taskList.Where(t => t.TaskName.Contains(keyWord) || t.TaskCode.Contains(keyWord));
            }
            if (!string.IsNullOrWhiteSpace(taskType))
            {
                taskList = taskList.Where(t => t.TaskType.Contains(taskType));
            }
            if (!string.IsNullOrWhiteSpace(statusCode.ToString()))
            {
                taskList = taskList.Where(t => t.StatusCode == statusCode);
            }
            if (!string.IsNullOrWhiteSpace(priorityCode.ToString()))
            {
                taskList = taskList.Where(t => t.PriorityCode == priorityCode);
            }
            if (!string.IsNullOrWhiteSpace(createDateTo.ToString()))
            {
                taskList = taskList.Where(t => t.CreateDate <= createDateTo);
            }
            if (!string.IsNullOrWhiteSpace(createDateFrom.ToString()))
            {
                taskList = taskList.Where(t => t.CreateDate >= createDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(completeDateTo.ToString()))
            {
                taskList = taskList.Where(t => t.CompleteDate <= completeDateTo);
            }
            if (!string.IsNullOrWhiteSpace(completeDateFrom.ToString()))
            {
                taskList = taskList.Where(t => t.CompleteDate >= completeDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(deadlineDateTo.ToString()))
            {
                taskList = taskList.Where(t => t.DeadlineDate <= deadlineDateTo);
            }
            if (!string.IsNullOrWhiteSpace(deadlineDateFrom.ToString()))
            {
                taskList = taskList.Where(t => t.DeadlineDate >= deadlineDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(createUserId.ToString()))
            {
                taskList = taskList.Where(t => t.CreateUserId == createUserId);
            }
            if (!string.IsNullOrWhiteSpace(userId.ToString()))
            {
                taskList = taskList.Where(t => t.AppUserId == userId);
            }
            if (!string.IsNullOrWhiteSpace(projectId.ToString()))
            {
                taskList = taskList.Where(t => t.ProjectId == projectId);
            }
            var taskListForView = await taskList.OrderByDescending(t => t.CreateDate).Select(
                 t => new
                 {
                     Id = t.Id,
                     TaskName = t.TaskName,
                     Description = t.Description,
                     TaskType = t.TaskType,
                     TaskCode = t.TaskCode,
                     CreateDate = t.CreateDate,
                     DeadlineDate = t.DeadlineDate,
                     CompleteDate = t.CompleteDate,
                     DayLefts = (t.DeadlineDate - DateTime.Now).Days,
                     PriorityCode = t.PriorityCode,
                     StatusCode = t.StatusCode,
                     ProjectId = t.ProjectId,
                     AppUserId = t.AppUserId,
                     CreateUserId = t.CreateUserId

                 }).AsNoTracking().ToListAsync(); ;
            return Ok(taskListForView);
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateTask(CreateTaskDto input)
        {
            var task = await _dataContext.Task.AsNoTracking().FirstOrDefaultAsync(e => e.ProjectId == input.ProjectId
                && e.TaskName.ToLower() == input.TaskName.ToLower());
            if (task != null) return BadRequest("TaskName was existed");
            var newTask = new Tasks
            {
                Id = new Guid(),
                TaskName = input.TaskName,
                CreateUserId = input.CreateUserId,
                CreateDate = DateTime.Now,
                DeadlineDate = input.DeadlineDate,
                PriorityCode = input.PriorityCode,
                StatusCode = Enum.StatusCode.Open,
                Description = input.Description,
                TaskType = input.TaskType,
                TaskCode = input.TaskCode,
                ProjectId = input.ProjectId,
                AppUserId = input.AppUserId
            };
            await _dataContext.Task.AddAsync(newTask);
            await _dataContext.SaveChangesAsync();
            return Ok(newTask);
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateTask(UpdateTaskDto input)
        {
            var task = await _dataContext.Task.FindAsync(input.Id);
            if (task != null)
            {
                if (input.PermissionCode == Permission.Leader)
                {
                    task.TaskName = input.TaskName;
                    task.CreateUserId = input.CreateUserId;
                    task.DeadlineDate = input.DeadlineDate;
                    task.PriorityCode = input.PriorityCode;
                    task.StatusCode = input.StatusCode;
                    task.Description = input.Description;
                    task.TaskType = input.TaskType;
                    task.TaskCode = input.TaskCode;
                    task.ProjectId = input.ProjectId;
                    task.AppUserId = input.AppUserId;

                    if (input.StatusCode == Enum.StatusCode.Resolve || input.StatusCode == Enum.StatusCode.Closed)
                    {
                        task.StatusCode = input.StatusCode;
                        task.CompleteDate = DateTime.Now;

                    }
                    _dataContext.Task.Update(task);
                    await _dataContext.SaveChangesAsync();
                    return Ok(task);
                }

                else if (input.PermissionCode == Permission.Employee && input.StatusCode == Enum.StatusCode.InProgress)
                {
                    task.StatusCode = input.StatusCode;
                    _dataContext.Update(task);
                    await _dataContext.SaveChangesAsync();
                    return Ok(task);
                }
                else if (input.PermissionCode == Permission.Employee && input.StatusCode == Enum.StatusCode.Resolve)
                {
                    task.StatusCode = input.StatusCode;
                    task.CompleteDate = DateTime.Now;
                    _dataContext.Update(task);
                    await _dataContext.SaveChangesAsync();
                    return Ok(task);
                }
                else
                {
                    return BadRequest("You not permission");
                }
            }
            else
            {
                return BadRequest("Task not existed");
            }

        }

        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            _dataContext.Task.Remove(await _dataContext.Task.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
    }
}
