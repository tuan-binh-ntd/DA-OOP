using API.Data;
using System;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
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
            var data = _dataContext.AppUser.Add(user);
            _dataContext.SaveChanges();
            return Ok(data);
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto input)
        {
            var user = await _dataContext.AppUser.FirstOrDefaultAsync(e => e.Email == input.Email);
            if (user == null) return Unauthorized("Invalid username");
            var pass = await _dataContext.AppUser.FirstOrDefaultAsync(e => e.Email == input.Email && e.Password == input.Password);
            if (pass == null) return Unauthorized("Invalid password");
            return new UserDto
            {
                Name = input.Email,
                Password = input.Password
            };
        }

    }
}
