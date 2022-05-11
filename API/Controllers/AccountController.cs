using API.Data;
using System;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using API.Enum;
using System.Linq;

namespace API.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public AccountController(DataContext dataContext)
        {
            _dataContext=dataContext;
        }

        [HttpGet("getall")]
        public async Task<ActionResult> GetAllUser()
        {
            var appUserList = await _dataContext.AppUser.AsNoTracking().ToListAsync();
            return Ok(appUserList);
        }

        [HttpGet("getuserforproject")]
        public async Task<ActionResult> GetUserForProject(Guid projectId)
        {
            var userList = await (from u in _dataContext.AppUser
                           join t in _dataContext.Task on u.Id equals t.AppUserId
                           join p in _dataContext.Project on t.ProjectId equals p.Id
                           where p.Id == projectId
                           select new
                           {
                               ProjectId = p.Id,
                               ProjectName = p.ProjectName,
                               AppUserId = t.AppUserId,
                               FirstName = u.FirstName,
                               LastName = u.LastName,
                           }).AsNoTracking().ToListAsync();
            userList.GroupBy(e => e.AppUserId);
            return Ok(userList);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto input)
        {
            var newUser = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email);
            if (newUser != null) return BadRequest("Username is taken");
            var leaderExisted = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.DepartmentId == input.DepartmentId && e.PermissionCode == Permission.Leader);
            if (leaderExisted != null && input.PermissionCode == Permission.Leader) return BadRequest("Department had leader");
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
            return Ok(user);
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto input)
        {
            var user = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email);
            if (user == null) return Unauthorized("Invalid username");
            var pass = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email && e.Password == input.Password);
            if (pass == null) return Unauthorized("Invalid password");
            return Ok(user);
        }
        [HttpPut("update")]
        public async Task<ActionResult> UpdateUser(Guid id, UpdateUserDto input)
        {
            var user = await _dataContext.AppUser.FindAsync(id);
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
