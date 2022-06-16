using API.DTO.MessageDto;
using API.Entity;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;

        public MessageRepository(DataContext context)
        {
            _context = context;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(string currentUserName, string recipientUserName, Guid taskId)
        {
            var messages = await (_context.Messages
                .Where(m => m.TasksId == taskId)
                .Where(m => m.Recipient.FirstName + " " + m.Recipient.LastName == recipientUserName
                && m.Sender.FirstName + " " + m.Recipient.LastName == currentUserName
                || m.Recipient.FirstName + " " + m.Recipient.LastName == currentUserName
                && m.Sender.FirstName + " " + m.Recipient.LastName == recipientUserName).OrderBy(m => m.MessageSent)).ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null
                  && m.Recipient.FirstName + " " + m.Recipient.LastName == currentUserName
                  && m.TasksId == taskId).ToList();
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }
            return unreadMessages;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
