using API.Data;
using API.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Task = API.Entity.Task;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TaskController(DataContext dataContext)
        {
            _dataContext=dataContext;
        }

        [HttpPost("create/task")]
        public async Task<ActionResult> CreateTask(CreateTaskDto input)
        {
            var task = await _dataContext.Task.FirstOrDefaultAsync(e => e.ProjectId == input.ProjectId 
                && e.TaskName.ToLower() == input.TaskName.ToLower());
            if (task != null) return BadRequest("TaskName was existed");
            var newTask = new Task
            {
                Id = new Guid(),
                TaskName = input.TaskName,
                CreateUserId = input.CreateUserId,
                CreateDate = DateTime.Now,
                DeadlineDate = input.DeadlineDate,
                PriorityCode = input.PriorityCode,
                StatusCode = input.StatusCode,
                Description = input.Description,
                ProjectId = input.ProjectId,
                AppUserId = input.AppUserId
            };
            _dataContext.Task.Add(newTask);
            _dataContext.SaveChanges();
            return Ok(newTask);
        }

        [HttpPost("update/task")]
        public async Task<ActionResult> UpdateTask(UpdateTaskDto input)
        {
            var task = await _dataContext.Task.FindAsync(input.Id);
            if (task != null)
            {
                task.TaskName = input.TaskName;
                task.CreateUserId = input.CreateUserId;
                task.CreateDate = input.CreateDate;
                task.DeadlineDate = input.DeadlineDate;
                task.CompleteDate = input.CompleteDate;
                task.PriorityCode = input.PriorityCode;
                task.StatusCode = input.StatusCode;
                task.Description = input.Description;
                task.ProjectId = input.ProjectId;
                task.AppUserId = input.AppUserId;
            }
            _dataContext.Task.Add(task);
            _dataContext.SaveChanges();
            return Ok(task);
        }
    }
}
