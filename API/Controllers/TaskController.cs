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

        [HttpGet("getall/task")]
        public async Task<ActionResult> GetAllTask()
        {
            var taskList = await _dataContext.Task.ToListAsync();
            return Ok(taskList);
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
                task.DeadlineDate = input.DeadlineDate;
                task.PriorityCode = input.PriorityCode;
                task.StatusCode = input.StatusCode;
                task.Description = input.Description;
                task.ProjectId = input.ProjectId;
                task.AppUserId = input.AppUserId;
                return CheckCompleteDate(input, task);
            }
            _dataContext.Task.Add(task);
            _dataContext.SaveChanges();
            return Ok(task);
        }

        private ActionResult CheckCompleteDate(UpdateTaskDto input, Task task)
        {
            if (input.CompleteDate >= task.CompleteDate)
            {
                 task.CompleteDate = input.CompleteDate;
            } 
            return BadRequest("CompleteDate can not less than CreateDate");
        }

        [HttpDelete("delete/task")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            _dataContext.Task.Remove(await _dataContext.Task.FindAsync(id));
            _dataContext.SaveChanges();
            return Ok("Removed");
        }
    }
}
