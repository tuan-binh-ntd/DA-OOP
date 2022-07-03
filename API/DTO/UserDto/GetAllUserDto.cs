﻿using API.Enum;
using System;

namespace API.DTO.UserDto
{
    public class GetAllUserDto
    {
        public Guid AppUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Permission PermissionCode { get; set; }
        public Guid? DepartmentId { get; set; }
        public string PhotoUrl { get; set; }
    }
}
