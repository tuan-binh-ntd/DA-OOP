
using API.Enum;
using System;

namespace API.DTO
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public Permission PermissionCode { get; set; }
        public Guid DepartmentId { get; set; }
    }
}
