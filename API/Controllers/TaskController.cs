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

        [HttpPost("getall")]
        public async Task<ActionResult> GetTaskForUserOrProject(Guid? userId, Guid? projectId, [FromBody] SearchTaskDto searchTaskDto)
        {
           
            var taskList = _dataContext.Task.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(searchTaskDto.TaskName))
            {
                taskList = taskList.Where(t => t.TaskName.Contains(searchTaskDto.TaskName));
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.TaskType))
            {
                taskList = taskList.Where(t => t.TaskType == searchTaskDto.TaskType);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.TaskCode))
            {
                taskList = taskList.Where(t => t.TaskCode == searchTaskDto.TaskCode);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.StatusCode.ToString()))
            {
                taskList = taskList.Where(t => t.StatusCode == searchTaskDto.StatusCode);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.PriorityCode.ToString()))
            {
                taskList = taskList.Where(t => t.PriorityCode == searchTaskDto.PriorityCode);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.CreateDateTo.ToString()))
            {
                taskList = taskList.Where(t => t.CreateDate <= searchTaskDto.CreateDateTo);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.CreateDateFrom.ToString()))
            {
                taskList = taskList.Where(t => t.CreateDate >= searchTaskDto.CreateDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.CompleteDateTo.ToString()))
            {
                taskList = taskList.Where(t => t.CompleteDate <= searchTaskDto.CompleteDateTo);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.CompleteDateFrom.ToString()))
            {
                taskList = taskList.Where(t => t.CompleteDate >= searchTaskDto.CompleteDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.DeadlineDateTo.ToString()))
            {
                taskList = taskList.Where(t => t.DeadlineDate <= searchTaskDto.DeadlineDateTo);
            }
            if (!string.IsNullOrWhiteSpace(searchTaskDto.DeadlineDateFrom.ToString()))
            {
                taskList = taskList.Where(t=> t.DeadlineDate >= searchTaskDto.DeadlineDateFrom);
            }
            if (userId != null && projectId != null)
            {
                 taskList = taskList.Where(t => t.ProjectId == projectId && t.AppUserId == userId);               
            }
            if (userId != null || projectId != null)
            {
                 taskList = taskList.Where(t => t.AppUserId == userId || t.ProjectId == projectId);  
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
                     CreateUserId=t.CreateUserId
                    
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
                StatusCode = input.StatusCode,
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
        public async Task<ActionResult> UpdateTask(Permission permissionCode,UpdateTaskDto input)
        {
            var task = await _dataContext.Task.FindAsync(input.Id);
            if (task != null)
            {
                if (permissionCode == Permission.Leader)
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
                    _dataContext.Task.Update(task);
                    await _dataContext.SaveChangesAsync();
                    return Ok(task);
                }
                else if (permissionCode == Permission.Employee && input.StatusCode == Enum.StatusCode.InProgress)
                {
                    task.StatusCode = input.StatusCode;
                    _dataContext.Update(task);
                    await _dataContext.SaveChangesAsync();
                    return Ok(task);
                }
                else
                {
                    task.StatusCode = input.StatusCode;
                    task.CompleteDate = DateTime.Now;
                    _dataContext.Update(task);
                    await _dataContext.SaveChangesAsync();
                    return Ok(task);
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
