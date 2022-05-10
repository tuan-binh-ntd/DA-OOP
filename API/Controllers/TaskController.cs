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
        public async Task<ActionResult> GetTaskForUserOrProject(Guid? userId, Guid? projectId)
        {
            if (userId == null && projectId == null)
            {
                var taskList = await _dataContext.Task.AsNoTracking().ToListAsync();
                return Ok(taskList);
            }
            if (userId != null && projectId != null)
            {
                var taskList = await _dataContext.Task.AsNoTracking().Where(e => e.ProjectId == projectId && e.AppUserId == userId).ToListAsync();
                return Ok(taskList);
            }
            if (userId != null || projectId != null)
            {
                var taskList = await _dataContext.Task.AsNoTracking().Where(e => e.AppUserId == userId || e.ProjectId == projectId).ToListAsync();
                return Ok(taskList);
            }
            return null;
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
                ProjectId = input.ProjectId,
                AppUserId = input.AppUserId
            };
            await _dataContext.Task.AddAsync(newTask);
            await _dataContext.SaveChangesAsync();
            return Ok(newTask);
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateTask(Guid id, UpdateTaskDto input)
        {
            var task = await _dataContext.Task.FindAsync(id);
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
                    task.ProjectId = input.ProjectId;
                    task.AppUserId = input.AppUserId;
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
