using API.Data;
using API.DTO;
using API.Entity;
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
            _dataContext=dataContext;
        }

        [HttpGet("gettaskforuserofproject")]
        public async Task<ActionResult> GetTaskForUserOrProject(Guid? userId, Guid? projectId)
        {
            var taskList = await _dataContext.Task.AsNoTracking().Where(e => e.AppUserId == userId || e.ProjectId == projectId).ToListAsync();
            return Ok(taskList);
        }

        [HttpGet("getall")]
        public async Task<ActionResult> GetAllTask()
        {
            var taskList = await _dataContext.Task.AsNoTracking().ToListAsync();
            return Ok(taskList);
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
            _dataContext.Task.Add(newTask);
            await _dataContext.SaveChangesAsync();
            return Ok(newTask);
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateTask(UpdateTaskDto input)
        {
            var task = await _dataContext.Task.FindAsync(input.Id);
            if (task != null && input.CompleteDate >= task.CompleteDate)
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
                task.CompleteDate = input.CompleteDate;
                _dataContext.Task.Add(task);
                await _dataContext.SaveChangesAsync();
                return Ok(task);
            }
            else
            {
                return BadRequest("CompleteDate can not less than CreateDate");
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
