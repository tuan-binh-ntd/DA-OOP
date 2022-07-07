using API.Data;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        private readonly DataContext _dataContext;

        public PresenceHub(PresenceTracker tracker, DataContext dataContext)
        {
            _tracker = tracker;
            _dataContext = dataContext;
        }

        public override async Task OnConnectedAsync()
        {
            var isOnline = await _tracker.UserConnected(Context.User.Identity.Name, Context.ConnectionId);
            if(isOnline)
            {
                await Clients.Others.SendAsync("UserIsOnline", Context.User.Identity.Name);
            }

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            
            var isOffline = await _tracker.UserDisconnected(Context.User.Identity.Name, Context.ConnectionId);
            if(isOffline)
            {
                await Clients.Others.SendAsync("UserIsOffline", Context.User.Identity.Name);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task CreateTask(CreateTaskDto input)
        {
            var task = await _dataContext.Task.AsNoTracking().FirstOrDefaultAsync(e => e.ProjectId == input.ProjectId
                && e.TaskName.ToLower() == input.TaskName.ToLower());
            if (task != null) throw new HubException("TaskName was existed");
            var project = await _dataContext.Project.FindAsync(input.ProjectId);
            var leader = await _dataContext.AppUser.FindAsync(input.CreateUserId);
            var emp = await _dataContext.AppUser.FindAsync(input.AppUserId);
            if (input.DeadlineDate.Date > project.DeadlineDate.Date)
            {
                throw new HubException("Task deadline date must less than or equal porject deadline date");
            }
            else
            {
                var newTask = new Tasks
                {
                    Id = new Guid(),
                    TaskName = input.TaskName,
                    CreateUserId = input.CreateUserId,
                    CreateDate = DateTime.Now,
                    DeadlineDate = input.DeadlineDate,
                    PriorityCode = input.PriorityCode,
                    StatusCode = Enum.StatusCode.Open,
                    Description = input.Description,
                    TaskType = input.TaskType,
                    TaskCode = input.TaskCode,
                    ProjectId = input.ProjectId,
                    AppUserId = input.AppUserId
                };
                await _dataContext.Task.AddAsync(newTask);
                await _dataContext.SaveChangesAsync();

                var groupName = GetGroupName(leader.FirstName + " " + leader.LastName, emp.FirstName + " " + emp.LastName);

                var connections = await _tracker.GetConnectionsForUser(emp.FirstName + " " + emp.LastName);
                if (connections != null)
                {
                    await Clients.Clients(connections).SendAsync("NewTaskReceived",
                        new
                        {
                            taskName = newTask.TaskName,
                            username = leader.FirstName + " " + leader.LastName,
                        });
                }
            }
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
