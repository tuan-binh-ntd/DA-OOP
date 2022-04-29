using API.Data;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public DepartmentController(DataContext dataContext)
        {
            _dataContext=dataContext;
        }

        [HttpGet("getall/department")]
        public async Task<ActionResult> GetAllDepartment()
        {
            var departmentList = await _dataContext.Department.ToListAsync();
            return Ok(departmentList);
        }
        [HttpGet("get/department")]
        public async Task<ActionResult> GetDepartment(Guid id)
        {
            var department = await _dataContext.Department.FindAsync(id);
            if (department == null) return BadRequest("DepartmentName Incorrect");
            return Ok(department);
        }

        [HttpPost("create/department")]
        public async Task<ActionResult> Register(DepartmentDto input)
        {
            var newDepartment = await _dataContext.Department.FirstOrDefaultAsync(e => e.DepartmentName.ToLower() == input.DepartmentName.ToLower());
            if (newDepartment != null) return BadRequest("DepartmentName is taken");
            var department = new Department
            {
               Id = new Guid(),
               DepartmentName = input.DepartmentName
            };
            _dataContext.Department.Add(department);
            _dataContext.SaveChanges();
            return Ok(department);
        }
    }
}
