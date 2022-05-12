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
            var projectList = await (from u in _dataContext.AppUser
                                     join p in _dataContext.Project
                                     on u.DepartmentId equals p.DepartmentId
                                     where u.PermissionCode == Permission.Leader
                                     select new GetAllProjectForViewDto
                                     {
                                         Id = p.Id,
                                         ProjectName = p.ProjectName,
                                         Description = p.Description,
                                         ProjectType = p.ProjectType,
                                         ProjectCode = p.ProjectCode,
                                         CreateDate = p.CreateDate,
                                         DeadlineDate = p.DeadlineDate,
                                         CompleteDate = p.CompleteDate,
                                         DayLefts = (p.DeadlineDate - DateTime.Now).Days,
                                         PriorityCode = p.PriorityCode,
                                         StatusCode = p.StatusCode,
                                         DepartmentId = p.DepartmentId,
                                         AppUserId = u.Id,
                                         LeaderName = u.FirstName + " " + u.LastName,
                                     }).AsNoTracking().ToListAsync();
            var taskList = await (from p in _dataContext.Project
                           join t in _dataContext.Task
                           on p.Id equals t.ProjectId
                           select new
                           {
                               ProjectId = t.ProjectId
                           }).AsNoTracking().ToListAsync();
            var taskListComplete = await (from p in _dataContext.Project
                                   join t in _dataContext.Task
                                   on p.Id equals t.ProjectId
                                   where t.StatusCode == Enum.StatusCode.Closed
                                   select new
                                   {
                                       ProjectId = t.ProjectId
                                   }).AsNoTracking().ToListAsync(); ;
            var count = taskList.GroupBy(e => e.ProjectId).Select(e => new { ProjectId = e.Key, Count = e.Count() });
            var countTaskComplete = taskListComplete.GroupBy(e => e.ProjectId).Select(e => new { ProjectId = e.Key, Count = e.Count() });
            foreach (var item in projectList)
            {
                foreach (var num in count)
                {
                    if (item.Id == num.ProjectId)
                    {
                        item.TaskCount = num.Count;
                        break;
                    }
                }
                foreach (var numTaskComplete in countTaskComplete)
                {
                    if (item.Id == numTaskComplete.ProjectId)
                    {
                        item.TaskProgress = Math.Round(Convert.ToDecimal(((float)numTaskComplete.Count / (float)item.TaskCount) * 100), 2);
                        break;
                    }
                }

            };
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
                var taskList = await( from p in _dataContext.Project
                               join d in _dataContext.Department
                               on p.DepartmentId equals d.Id
                               join t in _dataContext.Task
                               on p.Id equals t.ProjectId
                               where p.DepartmentId == departmentId
                               select new
                               {
                                   ProjectId = t.ProjectId
                               }).AsNoTracking().ToListAsync();
                var count = taskList.GroupBy(e => e.ProjectId).Select(e => new { ProjectId = e.Key, Count = e.Count() });
                var projectList =await( from u in _dataContext.AppUser
                                  join p in _dataContext.Project
                                  on u.DepartmentId equals p.DepartmentId
                                  where u.PermissionCode == Permission.Leader && u.DepartmentId == departmentId
                                  select new GetAllProjectForViewDto
                                  {
                                      Id = p.Id,
                                      ProjectName = p.ProjectName,
                                      Description = p.Description,
                                      ProjectType = p.ProjectType,
                                      ProjectCode = p.ProjectCode,
                                      CreateDate = p.CreateDate,
                                      DeadlineDate = p.DeadlineDate,
                                      CompleteDate = p.CompleteDate,
                                      DayLefts = (p.DeadlineDate - DateTime.Now).Days,
                                      PriorityCode = p.PriorityCode,
                                      StatusCode = p.StatusCode,
                                      DepartmentId = p.DepartmentId,
                                      AppUserId = u.Id,
                                      LeaderName = u.FirstName + " " + u.LastName,
                                  }).AsNoTracking().ToListAsync();
                foreach (var item in projectList)
                {
                    foreach (var num in count)
                    {
                        if (item.Id == num.ProjectId)
                        {
                            item.TaskCount = num.Count;
                        }
                    }
                }
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
        public async Task<ActionResult> UpdateProject(Guid id, UpdateProjectDto input)
        {
            var project = await _dataContext.Project.FindAsync(id);
            if (project != null)
            {
                if (input.PermissionCode == Permission.ProjectManager)
                {
                    project.ProjectName = project.ProjectName;
                    project.Description = input.Description;
                    project.ProjectCode = input.ProjectCode;
                    project.ProjectType = input.ProjectType;
                    project.DeadlineDate = input.DeadlineDate;
                    project.PriorityCode = input.PriorityCode;
                    project.StatusCode = input.StatusCode;
                    project.DepartmentId = input.DepartmentId;
                    _dataContext.Project.Update(project);
                    await _dataContext.SaveChangesAsync();
                    return Ok(project);
                }
                else if (input.PermissionCode == Permission.Leader && input.StatusCode == Enum.StatusCode.InProgress)
                {
                    project.StatusCode = input.StatusCode;
                    _dataContext.Project.Update(project);
                    await _dataContext.SaveChangesAsync();
                    return Ok(project);
                }
                else
                {
                    project.StatusCode = input.StatusCode;
                    project.CompleteDate = DateTime.Now;
                    _dataContext.Project.Update(project);
                    await _dataContext.SaveChangesAsync();
                    return Ok(project);
                }
            }
            else
            {
                return BadRequest("Project not existed");
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