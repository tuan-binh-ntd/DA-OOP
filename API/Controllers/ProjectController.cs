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
                project.CreateDate = input.CreateDate;
                project.DeadlineDate = input.DeadlineDate;
                project.CompleteDate = input.CompleteDate;
                project.PriorityCode = input.PriorityCode;
                project.StatusCode = input.StatusCode;
                project.DepartmentId = input.DepartmentId;
            }
            _dataContext.Project.Update(project);
            _dataContext.SaveChanges();
            return Ok(project);
        }
    }
}