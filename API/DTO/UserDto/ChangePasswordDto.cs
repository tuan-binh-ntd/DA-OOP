using System;

namespace API.DTO.UserDto
{
    public class ChangePasswordDto
    {
        public Guid Id { get; set; }
        public string Password { get; set; }
    }
}
