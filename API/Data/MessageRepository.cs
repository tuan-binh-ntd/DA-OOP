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

        public async Task<IEnumerable<Message>> GetMessageThread(Guid taskId)
        {
            var unreadMessages = await (_context.Messages.Where(m => m.DateRead == null && m.TasksId == taskId)).OrderBy(m => m.MessageSent).ToListAsync();
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }
            var messages = await (_context.Messages.Where(m => m.TasksId == taskId).OrderBy(m => m.MessageSent)).ToListAsync();
            return messages;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
