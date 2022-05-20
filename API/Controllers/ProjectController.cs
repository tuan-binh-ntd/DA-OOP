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

        [HttpPost("getall")]
        public async Task<ActionResult> GetAllProject([FromBody] GetAllProjectDto getAllProjectDto)
        {
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

            var projectFilter = _dataContext.Project.Join(_dataContext.AppUser.Where(u => u.PermissionCode == Permission.Leader), pj => pj.DepartmentId, user => user.DepartmentId, (pj, user) => new { pj, user }).AsNoTracking();
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.ProjectName))
            {
                projectFilter = projectFilter.Where(p => p.pj.ProjectName.Contains(getAllProjectDto.ProjectName));
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.ProjectCode))
            {
                projectFilter = projectFilter.Where(p => p.pj.ProjectCode == getAllProjectDto.ProjectCode);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.ProjectType))
            {
                projectFilter = projectFilter.Where(p => p.pj.ProjectType == getAllProjectDto.ProjectType);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.StatusCode.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.StatusCode == getAllProjectDto.StatusCode);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.PriorityCode.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.PriorityCode == getAllProjectDto.PriorityCode);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.CreateDateTo.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CreateDate <= getAllProjectDto.CreateDateTo);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.CreateDateFrom.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CreateDate >= getAllProjectDto.CreateDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.CompleteDateTo.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CompleteDate <= getAllProjectDto.CompleteDateTo);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.CompleteDateFrom.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.CompleteDate >= getAllProjectDto.CompleteDateFrom);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.DeadlineDateTo.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.DeadlineDate <= getAllProjectDto.DeadlineDateTo);
            }
            if (!string.IsNullOrWhiteSpace(getAllProjectDto.DeadlineDateFrom.ToString()))
            {
                projectFilter = projectFilter.Where(p => p.pj.DeadlineDate >= getAllProjectDto.DeadlineDateFrom);
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
                var taskList = await (from p in _dataContext.Project
                                      join d in _dataContext.Department
                                      on p.DepartmentId equals d.Id
                                      join t in _dataContext.Task
                                      on p.Id equals t.ProjectId
                                      where p.DepartmentId == departmentId
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

                var projectList = await (from u in _dataContext.AppUser
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
                    return BadRequest("Yow not permission");
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