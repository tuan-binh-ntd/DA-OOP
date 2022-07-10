using System;

namespace API.DTO.NotificationDto
{
    public class UnreadNotifiesDto
    {
        public Guid Id { get; set; }
        public Guid AppUserId { get; set; }
    }
}
