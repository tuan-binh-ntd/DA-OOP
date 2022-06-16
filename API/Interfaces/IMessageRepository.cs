using API.Entity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        public void AddMessage(Message message);
        public void DeleteMessage(Message message);
        public Task<IEnumerable<Message>> GetMessageThread(string currentUserName, string recipientUserName, Guid taskId);
        Task<bool> SaveAllAsync();
    }
}
