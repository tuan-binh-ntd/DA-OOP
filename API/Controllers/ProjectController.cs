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
        public async Task<ActionResult> GetAllProject( string keyWord, StatusCode? statusCode, Priority? priorityCode,DateTime? createDateFrom, DateTime? createDateTo, DateTime? deadlineDateFrom, DateTime? deadlineDateTo, DateTime? completeDateFrom, DateTime? completeDateTo, Guid? departmentId, Permission? permission, Guid? userId)
        
        {
            var projectFilter = _dataContext.Project.Join(_dataContext.AppUser.Where(u => u.PermissionCode == Permission.Leader), pj => pj.DepartmentId, user => user.DepartmentId, (pj, user) => new { pj, user }).AsNoTracking();
            if (!string.IsNullOrWhiteSpace(keyWord))
            {
                projectFilter = projectFilter.Where(p => p.pj.ProjectName.Contains(keyWord) || p.pj.ProjectCode.Contains(keyWord)|| p.pj.ProjectType.Contains(keyWord));
            }           
            if (!string.IsNullOrWhiteSpace(statusCode.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.StatusCode == statusCode);
            }
            if (!string.IsNullOrWhiteSpace(priorityCode.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.PriorityCode == priorityCode);
            }
            if (!string.IsNullOrWhiteSpace(createDateTo.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CreateDate <= createDateTo);
            }
            if (!string.IsNullOrWhiteSpace(createDateFrom.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CreateDate >= createDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(completeDateTo.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CompleteDate <= completeDateTo);
            }
            if (!string.IsNullOrWhiteSpace(completeDateFrom.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CompleteDate >= completeDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(deadlineDateTo.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.DeadlineDate <= deadlineDateTo);
            }
            if (!string.IsNullOrWhiteSpace(deadlineDateFrom.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.DeadlineDate >= deadlineDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(departmentId.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.DepartmentId == departmentId);
            }
            if (!string.IsNullOrWhiteSpace(permission.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.user.PermissionCode == permission);
            }
            if (!string.IsNullOrWhiteSpace(userId.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.user.Id == userId);
            }


            /*var projectList = await (from u in _dataContext.AppUser
                                     join p in _dataContext.Project on u.DepartmentId equals p.DepartmentId
                                     where u.PermissionCode == Permission.Leader).AsNoTracking();*/


            var projectList = await projectFilter.OrderByDescending(p => p.pj.CreateDate).Select(
                 p =>  new GetAllProjectForViewDto
                 {
                 Id = p.pj.Id,
                 ProjectName = p.pj.ProjectName,
                 Description = p.pj.Description,
                 ProjectType = p.pj.ProjectType,
                 ProjectCode = p.pj.ProjectCode,
                 CreateDate = p.pj.CreateDate,
                 DeadlineDate = p.pj.DeadlineDate,
                 CompleteDate = p.pj.CompleteDate,
                 DayLefts = (p.pj.DeadlineDate - DateTime.Now).Days,
                 PriorityCode = p.pj.PriorityCode,
                 StatusCode = p.pj.StatusCode,
                 DepartmentId = p.pj.DepartmentId,
                 AppUserId = p.user.Id,
                 LeaderName = p.user.FirstName + " " + p.user.LastName,
             }).AsNoTracking().ToListAsync();
            var taskList = await (from p in _dataContext.Project
                                  join t in _dataContext.Task on p.Id equals t.ProjectId
                                  select new
                                  {
                                      ProjectId = t.ProjectId
                                  }).AsNoTracking().ToListAsync();

            var countTask = taskList.GroupBy(e => e.ProjectId).Select(e => new { ProjectId = e.Key, Count = e.Count() });

            var taskListComplete = await (from p in _dataContext.Project
                                          join t in _dataContext.Task
                                          on p.Id equals t.ProjectId
                                          where t.StatusCode == Enum.StatusCode.Closed
                                          select new
                                          {
                                              ProjectId = t.ProjectId
                                          }).AsNoTracking().ToListAsync();

            var countTaskComplete = taskListComplete.GroupBy(e => e.ProjectId).Select(e => new { ProjectId = e.Key, Count = e.Count() });
            foreach (var project in projectList)
            {
                foreach (var task in countTask)
                {
                    if (project.Id == task.ProjectId)
                    {
                        project.TaskCount = task.Count;
                        break;
                    }
                }
                foreach (var numTaskComplete in countTaskComplete)
                {
                    if (project.Id == numTaskComplete.ProjectId)
                    {
                        project.TaskProgress = Math.Round(Convert.ToDecimal(((float)numTaskComplete.Count / (float)project.TaskCount) * 100), 2);
                        break;
                    }
                }

            }
            return Ok(projectList);
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
                else if(input.PermissionCode == Permission.Leader && input.StatusCode == Enum.StatusCode.Resolve) 
                {
                    project.StatusCode = input.StatusCode;
                    project.CompleteDate = DateTime.Now;
                    _dataContext.Project.Update(project);
                    await _dataContext.SaveChangesAsync();
                    return Ok(project);
                }
                else
                {
                    return BadRequest("Yow not permission");
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