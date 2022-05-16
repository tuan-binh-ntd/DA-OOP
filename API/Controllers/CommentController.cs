using API.Data;
using API.DTO;
using API.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public CommentController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet("getfortask")]
        public async Task<ActionResult> GetCommentForTask(Guid taskId)
        {
            var result = await (from c in _dataContext.Comment
                                join u in _dataContext.AppUser on c.AppUserId equals u.Id
                                where c.TasksId == taskId
                                select new GetCommentForViewDto
                                {
                                    Id  = c.Id,
                                    TaskId = c.TasksId,
                                    AppUserId = c.AppUserId,
                                    UserNameForComment = u.FirstName + " " + u.LastName,
                                    CommentContent = c.CommentContent,
                                    CommentDate = c.CommentDate
                                }).AsNoTracking().ToListAsync();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateComment(CreateCommentDto input)
        {
            var comment = new Comment
            {
                Id = new Guid(),
                AppUserId = input.AppUserId,
                TasksId = input.TaskId,
                CommentContent = input.CommentContent,
                CommentDate = DateTime.Now
            };
            await _dataContext.AddAsync(comment);
            await _dataContext.SaveChangesAsync();
            return Ok(comment);
        }
        [HttpPut("update")]
        public async Task<ActionResult> UpdateComment(UpdateCommentDto input)
        {
            var comment = await _dataContext.Comment.FindAsync(input.Id);
            if (comment == null) return BadRequest("Comment not found");
            comment.CommentContent = input.CommentContent;
            comment.CommentDate = DateTime.Now;
            _dataContext.Comment.Update(comment);
            await _dataContext.SaveChangesAsync();
            return Ok(comment);
        }

        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteComment(Guid id)
        {
            _dataContext.Remove(await _dataContext.Comment.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Delete Successed");
        }
    }
}
