
using API.Enum;
using System;

namespace API.DTO
{
    public class AppUserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public Permission PermissionCode { get; set; }
        public Guid DepartmentId { get; set; }
    }
}
