using API.Data;
using System;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public AccountController(DataContext dataContext)
        {
            _dataContext=dataContext;
        }

        [HttpGet("getall/user")]
        public async Task<ActionResult> GetAllUser()
        {
            var appUserList = await _dataContext.AppUser.ToListAsync();
            return Ok(appUserList);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto input)
        {
            var newUser = await _dataContext.AppUser.FirstOrDefaultAsync(e => e.Email == input.Email);
            if (newUser != null) return BadRequest("Username is taken");
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
            _dataContext.AppUser.Add(user);
            _dataContext.SaveChanges();
            return Ok(user);
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto input)
        {
            var user = await _dataContext.AppUser.FirstOrDefaultAsync(e => e.Email == input.Email);
            if (user == null) return Unauthorized("Invalid username");
            var pass = await _dataContext.AppUser.FirstOrDefaultAsync(e => e.Email == input.Email && e.Password == input.Password);
            if (pass == null) return Unauthorized("Invalid password");
            return Ok(new UserDto
            {
                Name = input.Email,
                Password = input.Password
            });
        }

        [HttpDelete("delete/user")]
        public async Task<ActionResult> DeteleUser(Guid id)
        {
            _dataContext.AppUser.Remove(await _dataContext.AppUser.FindAsync(id));
            _dataContext.SaveChanges();
            return Ok("Removed");
        }
    }
}
