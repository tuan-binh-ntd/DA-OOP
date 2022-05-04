using API.Data;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public ProjectController(DataContext dataContext)
        {
            _dataContext=dataContext;
        }

        [HttpGet("getall/project")]
        public async Task<ActionResult> GetAllProject()
        {
            var projectList = await _dataContext.Project.ToListAsync();
            return Ok(projectList);
        }

        [HttpPost("create/project")]
        public async Task<ActionResult> CreateProject(CreateProjectDto input)
        {
            var projectNameNull = string.IsNullOrWhiteSpace(input.ProjectName);
            if (projectNameNull) return BadRequest("ProjectName not null");
            var project = await _dataContext.Project.FirstOrDefaultAsync(e => e.ProjectName == input.ProjectName);
            if (project != null) return BadRequest("ProjectName is taken");
            var data = new Project
            {
                Id = new Guid(),
                ProjectName = input.ProjectName,
                Description = input.Description,
                CreateDate = DateTime.Now,
                DeadlineDate = input.DeadlineDate,
                PriorityCode = input.PriorityCode,
                StatusCode = input.StatusCode,
                DepartmentId = input.DepartmentId,
            };
            _dataContext.Project.Add(data);
            _dataContext.SaveChanges();
            return Ok(data);
        }

        [HttpPost("update/project")]
        public async Task<ActionResult> UpdateProject(UpdateProjectDto input)
        {
            var project = await _dataContext.Project.FindAsync(input.Id);
            if (project != null)
            {
                project.ProjectName = project.ProjectName;
                project.Description = input.Description;
                project.Description = input.Description;
                project.DeadlineDate = input.DeadlineDate;
                project.PriorityCode = input.PriorityCode;
                project.StatusCode = input.StatusCode;
                project.DepartmentId = input.DepartmentId;
                return CheckCompleteDate(input, project);
            }
            _dataContext.Project.Update(project);
            _dataContext.SaveChanges();
            return Ok(project);
        }

        private ActionResult CheckCompleteDate(UpdateProjectDto input, Project project)
        {
            if(input.CompleteDate >= project.CreateDate)
            {
                 project.CompleteDate = input.CompleteDate;
            }
            return BadRequest("CompleteDate can not less than CreateDate");
        }
        [HttpDelete("delete/project")]
        public async Task<ActionResult> DeleteProject(Guid id)
        {
            _dataContext.Task.Remove(await _dataContext.Task.FirstOrDefaultAsync(e => e.ProjectId == id));
            _dataContext.Project.Remove(await _dataContext.Project.FindAsync(id));
            _dataContext.SaveChanges();
            return Ok("Removed");
        }
    }
}