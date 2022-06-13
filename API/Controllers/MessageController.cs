using API.Data;
using API.DTO.MessageDto;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public MessageController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpPost("message/create")]
        public async Task<ActionResult<MessagesDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await _dataContext.AppUser.FindAsync(createMessageDto.SenderId);
            var recipient = await _dataContext.AppUser.FindAsync(createMessageDto.RecipientId);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Id = new Guid(),
                TasksId = createMessageDto.TaskId,
                SenderId = sender.Id,
                SenderUserName = sender.FirstName + " " + sender.LastName,
                Sender = sender,
                RecipientId = recipient.Id,
                RecipientUserName = recipient.FirstName + " " + recipient.LastName,
                Recipient = recipient,
                Content = createMessageDto.Content,
            };
            await _dataContext.Messages.AddAsync(message);
            await _dataContext.SaveChangesAsync();
            return Ok(message);
        }

        [HttpGet("message/getall")]
        public async Task<ActionResult> GetMessagesThread(Guid senderId, Guid recipientId)
        {
            var messages = await _dataContext.Messages.Where(e => e.SenderId == senderId && e.RecipientId == recipientId)
                .OrderBy(m => m.MessageSent).ToListAsync();
            return Ok(messages);
        }
    }
}
