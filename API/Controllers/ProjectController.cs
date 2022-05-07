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
    [Route("api/project")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public ProjectController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet("getall")]
        public async Task<ActionResult> GetAllProject()
        {
            var projectList = await _dataContext.Project.Join(_dataContext.AppUser,
                    p => p.DepartmentId, u => u.DepartmentId, (p, u) => new GetAllProjectForViewDto
                    {
                        Id = p.Id,
                        ProjectName = p.ProjectName,
                        Description = p.Description,
                        ProjectType = p.ProjectType,
                        ProjectCode = p.ProjectCode,
                        CreateDate = p.CreateDate,
                        DeadlineDate = p.DeadlineDate,
                        CompleteDate = p.CompleteDate,
                        DayLefts = p.DeadlineDate - DateTime.Now,
                        PriorityCode = p.PriorityCode,
                        StatusCode = p.StatusCode,
                        DepartmentId = p.DepartmentId,
                        AppUserId = u.Id,
                        LeaderName = u.FirstName + " " + u.LastName,
                    }).AsNoTracking().ToListAsync();
            return Ok(projectList);
        }

        [HttpGet("getprojectfordepartment")]
        public async Task<ActionResult<GetAllProjectForViewDto>> GetProjectForDepartment(Guid departmentId, Permission permission)
        {
            if (permission == Permission.ProjectManager || permission == Permission.Leader)
            {
                var departmentIdNotFound = await _dataContext.Project.AsNoTracking().FirstOrDefaultAsync(e => e.DepartmentId == departmentId);
                if (departmentIdNotFound == null)
                {
                    return BadRequest("Department not existed");
                }
                var taskList = await _dataContext.Project.Join(_dataContext.Task, p => p.Id, t => t.ProjectId, (p, t) =>
                    new
                    {
                        ProjectId = t.ProjectId
                    }).AsNoTracking().ToListAsync();
                var count = taskList.GroupBy(e => e.ProjectId).Select(e => new { ProjectId = e.Key, Count = e.Count() });
                var projectList = await _dataContext.Project.Where(e => e.DepartmentId == departmentId && e.Id == count.ElementAt(0).ProjectId)
                    .Join(_dataContext.AppUser,p => p.DepartmentId, u => u.DepartmentId, (p, u) => 
                        new GetAllProjectForViewDto
                        {
                            Id = p.Id,
                            ProjectName = p.ProjectName,
                            Description = p.Description,
                            ProjectType = p.ProjectType,
                            ProjectCode = p.ProjectCode,
                            CreateDate = p.CreateDate,
                            DeadlineDate = p.DeadlineDate, 
                            CompleteDate = p.CompleteDate,
                            DayLefts = p.DeadlineDate - DateTime.Now,
                            PriorityCode = p.PriorityCode,
                            StatusCode = p.StatusCode,
                            DepartmentId = p.DepartmentId,
                            AppUserId = u.Id,
                            LeaderName = u.FirstName + " " + u.LastName,
                            TaskCount = count.ElementAt(0).Count,
                        })
                    .AsNoTracking().ToListAsync();
                return Ok(projectList);
            }
            return BadRequest("You not permission");
        }

        [HttpPost("create")]
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
                ProjectCode = input.ProjectCode,
                ProjectType = input.ProjectType,
                CreateDate = DateTime.Now,
                DeadlineDate = input.DeadlineDate,
                PriorityCode = input.PriorityCode,
                StatusCode = input.StatusCode,
                DepartmentId = input.DepartmentId,
            };
            _dataContext.Project.Add(data);
            await _dataContext.SaveChangesAsync();
            return Ok(data);
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateProject(UpdateProjectDto input)
        {
            var project = await _dataContext.Project.FindAsync(input.Id);
            if (project != null && input.CompleteDate >= project.CreateDate)
            {
                project.ProjectName = project.ProjectName;
                project.Description = input.Description;
                project.ProjectCode = input.ProjectCode;
                project.ProjectType = input.ProjectType;
                project.DeadlineDate = input.DeadlineDate;
                project.PriorityCode = input.PriorityCode;
                project.StatusCode = input.StatusCode;
                project.DepartmentId = input.DepartmentId;
                project.CompleteDate = input.CompleteDate;
                _dataContext.Project.Update(project);
                await _dataContext.SaveChangesAsync();
                return Ok(project);
            }
            else
            {
                return BadRequest("CompleteDate can not less than CreateDate");
            }
        }

        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteProject(Guid id)
        {
            _dataContext.Task.Remove(await _dataContext.Task.FirstOrDefaultAsync(e => e.ProjectId == id));
            _dataContext.Project.Remove(await _dataContext.Project.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
    }
}