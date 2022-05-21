using API.Data;
using System;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using API.Enum;
using System.Linq;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using API.DTO.UserDto;

namespace API.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext dataContext, ITokenService tokenService)
        {
            _dataContext = dataContext;
            _tokenService = tokenService;
        }

        [HttpGet("getall")]
        [AllowAnonymous]
        public async Task<ActionResult> GetAllUser(Guid? projectId, Guid? departmentId)
        {
            if (projectId != null)
            {
                var userList = await (from p in _dataContext.Project
                                      join t in _dataContext.Task on p.Id equals t.ProjectId
                                      join u in _dataContext.AppUser on t.AppUserId equals u.Id
                                      where p.Id == projectId && u.PermissionCode != Permission.ProjectManager
                                      select new
                                      {
                                          ProjectName = p.ProjectName,
                                          TaskName = t.TaskName,
                                          AppUserId = u.Id,
                                          UserName = u.FirstName + " " + u.LastName,
                                          Address = u.Address,
                                          Email = u.Email,
                                          Phone = u.Phone,
                                          Permission = u.PermissionCode == Permission.Leader ? "Leader" : "Employee",
                                          DepartmentId = p.DepartmentId,
                                      }).AsNoTracking().ToListAsync();
                /*var groupUserList = userList.GroupBy(e => e.AppUserId).Select(e => new { AppUserId = e.Key, Count = e.Count()}).ToList();
                var result = await (from p in _dataContext.Project
                                    join t in _dataContext.Task on p.Id equals t.ProjectId
                                    join u in _dataContext.AppUser on t.AppUserId equals u.Id
                                    from g in groupUserList 
                                    select new
                                    {
                                        ProjectName = p.ProjectName,
                                        TaskName = t.TaskName,
                                        AppUserId = u.Id,
                                        UserName = u.FirstName + " " + u.LastName,
                                        DepartmentId = p.DepartmentId,
                                        Permission = u.PermissionCode == Permission.Leader ? "Leader" : "Employee"
                                    }).AsNoTracking().ToListAsync();*/
                return Ok(userList);
            }
            if (departmentId != null)
            {
                var userList = await (from d in _dataContext.Department
                                      join u in _dataContext.AppUser on d.Id equals u.DepartmentId
                                      where d.Id == departmentId && u.PermissionCode != Permission.ProjectManager
                                      select new
                                      {
                                          DepartmentId = d.Id,
                                          DepartmentName = d.DepartmentName,
                                          AppUserId = u.Id,
                                          UserName = u.FirstName + " " + u.LastName,
                                          Address = u.Address,
                                          Email = u.Email,
                                          Phone = u.Phone,
                                          Permission = u.PermissionCode == Permission.Leader ? "Leader" : "Employee"
                                      }).AsNoTracking().ToListAsync();
                //userList.GroupBy(e => e.AppUserId);
                return Ok(userList);
            }
            if (projectId == null && departmentId == null)
            {
                var appUserList = await (from d in _dataContext.Department
                                  join u in _dataContext.AppUser on d.Id equals u.DepartmentId
                                  where u.PermissionCode == Permission.Leader || u.PermissionCode == Permission.Employee
                                  select new
                                  {
                                      DepartmentId = d.Id,
                                      DepartmentName = d.DepartmentName,
                                      AppUserId = u.Id,
                                      UserName = u.FirstName + " " + u.LastName,
                                      Address = u.Address,
                                      Email = u.Email,
                                      Phone = u.Phone,
                                      Permission = u.PermissionCode == Permission.Leader ? "Leader" : "Employee"
                                  }).AsNoTracking().ToListAsync();
                return Ok(appUserList);
            }
            return Ok();
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUserDto>> Register(RegisterDto input)
        {
            var newUser = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email);
            if (newUser != null) return BadRequest("Username is taken");
            var leaderExisted = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.DepartmentId == input.DepartmentId && e.PermissionCode == Permission.Leader);
            if (leaderExisted != null && input.PermissionCode == Permission.Leader) return BadRequest("Department had leader");
            if (input.PermissionCreator == Permission.Leader && input.PermissionCode == Permission.Employee)
            {
                var user = new AppUser
                {
                    Id = new Guid(),
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    Address = input.Address,
                    Email = input.Email,
                    Phone = input.Phone,
                    Password = input.Password,
                    DepartmentId = input.DepartmentId,
                    PermissionCode = input.PermissionCode
                };
                await _dataContext.AppUser.AddAsync(user);
                await _dataContext.SaveChangesAsync();
                return new AppUserDto
                {
                    Id = user.Id,
                    PermissionCode = user.PermissionCode,
                    Email = user.Email,
                    DepartmentId = user.DepartmentId,
                    Token = _tokenService.CreateToken(user)
                };
            }
            else if (input.PermissionCreator == Permission.ProjectManager && (input.PermissionCode == Permission.Employee || input.PermissionCode == Permission.Leader))
            {
                var user = new AppUser
                {
                    Id = new Guid(),
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    Address = input.Address,
                    Email = input.Email,
                    Phone = input.Phone,
                    Password = input.Password,
                    DepartmentId = input.DepartmentId,
                    PermissionCode = input.PermissionCode
                };
                await _dataContext.AppUser.AddAsync(user);
                await _dataContext.SaveChangesAsync();
                return new AppUserDto
                {
                    Id = user.Id,
                    PermissionCode = user.PermissionCode,
                    Email = user.Email,
                    DepartmentId = user.DepartmentId,
                    Token = _tokenService.CreateToken(user)
                };
            }
            else
            {
                return Unauthorized("You must had permission");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUserDto>> Login(LoginDto input)
        {
            var user = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email);
            if (user == null) return Unauthorized("Invalid username");
            var pass = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email && e.Password == input.Password);
            if (pass == null) return Unauthorized("Invalid password");
            return new AppUserDto
            {
                Id = user.Id,
                PermissionCode = user.PermissionCode,
                Email = user.Email,
                DepartmentId = user.DepartmentId,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPut("changepassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto input)
        {
            var user = await _dataContext.AppUser.SingleOrDefaultAsync(e => e.Email == input.Email);
            user.Password = input.Password;
            _dataContext.AppUser.Update(user);
            await _dataContext.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPut("update")]
        public async Task<ActionResult> UpdateUser(UpdateUserDto input)
        {
            var user = await _dataContext.AppUser.FindAsync(input.Id);
            if (user != null)
            {
                if (input.PermissionCode == Permission.Employee)
                {
                    user.FirstName = user.FirstName;
                    user.LastName = user.LastName;
                    user.Address = user.Address;
                    user.Email = user.Email;
                    user.Phone = user.Phone;
                    user.Password = input.Password;
                    user.DepartmentId = user.DepartmentId;
                    _dataContext.AppUser.Update(user);
                    await _dataContext.SaveChangesAsync();
                    return Ok(user);
                }
                else
                {
                    user.FirstName = input.FirstName;
                    user.LastName = input.LastName;
                    user.Address = input.Address;
                    user.Email = input.Email;
                    user.Phone = input.Phone;
                    user.Password = input.Password;
                    user.DepartmentId = input.DepartmentId;
                    _dataContext.AppUser.Update(user);
                    await _dataContext.SaveChangesAsync();
                    return Ok(user);
                }

            }
            else
            {
                return BadRequest("User not existed");
            }
        }

        [HttpDelete("delete")]
        public async Task<ActionResult> DeteleUser(Guid id)
        {
            _dataContext.AppUser.Remove(await _dataContext.AppUser.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
    }
}
