using API.Data;
using API.DTO.MessageDto;
using API.Entity;
using API.Interfaces;
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
        private readonly IMessageRepository _messageRepository;

        public MessageController(DataContext dataContext, IMessageRepository messageRepository)
        {
            _dataContext = dataContext;
            _messageRepository = messageRepository;
        }

        [HttpPost("message/create")]
        public async Task<ActionResult> CreateMessage(CreateMessageDto createMessageDto)
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
            var result = new MessageForViewDto
            {
                Id = message.Id,
                TasksId = createMessageDto.TaskId,
                SenderId = sender.Id,
                SenderUserName = sender.FirstName + " " + sender.LastName,
                RecipientId = recipient.Id,
                RecipientUserName = recipient.FirstName + " " + recipient.LastName,
                Content = createMessageDto.Content,
            };
            return Ok(result);
        }

        [HttpGet("message/thread")]
        public async Task<ActionResult> GetMessagesThread(Guid taskId)
        {
            var message = await _messageRepository.GetMessageThread(taskId);
            return Ok(message);
        }
    }
}
