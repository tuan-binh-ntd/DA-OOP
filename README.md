# DA-OOP

# API
Use VisualStudio and run.
# Database
Use SQL Server

Stored Procedure

create proc GetUserForProject
@projectId uniqueidentifier output
as
begin 
	select u.Id as AppUserId, u.FirstName, u.LastName, u.Address, u.Phone, 
	u.Email, u.Password, u.PermissionCode, u.DepartmentId, p.Url as PhotoUrl from Task t
	inner join AppUser u on t.AppUserId = u.Id
	inner join Photos p on u.Id = p.AppUserId 
	where t.ProjectId = @projectId and p.IsMain = 1
	group by u.Id, u.FirstName, u.LastName, u.Address, u.Phone, u.Email, u.Password, u.PermissionCode,
	u.DepartmentId, p.Url
end

create proc GetUserForDepartment
@departmentId uniqueidentifier output
as
begin 
	select u.Id as AppUserId, u.FirstName, u.LastName, u.Address, u.Phone, 
	u.Email, u.Password, u.PermissionCode, u.DepartmentId, p.Url as PhotoUrl from Department d
	inner join AppUser u on d.Id = u.DepartmentId
	inner join Photos p on u.Id = p.AppUserId
	where u.DepartmentId = @departmentId and p.IsMain = 1
end

create proc GetUser
as
begin 
	select u.Id as AppUserId, u.FirstName, u.LastName, u.Address, u.Phone, 
	u.Email, u.Password, u.PermissionCode, u.DepartmentId, p.Url as PhotoUrl from Department d
	inner join AppUser u on d.Id = u.DepartmentId
	left join Photos p on u.Id = p.AppUserId where p.IsMain = 1 or isnull(p.IsMain, 1) = 1
end

create procedure GetTask
@statusCode int output
as
begin
	select t.ProjectId, count(t.ProjectId) as TaskNum from Project p inner join Task t on p.Id = t.ProjectId
	where t.StatusCode = @statusCode or @statusCode = 0
	group by t.ProjectId
end

create procedure GetAllUserForProject
@projectId uniqueidentifier output
as  
begin  
	select u.Id as UserId from Project p 
	inner join Task t on p.Id = t.ProjectId
	inner join AppUser u on t.AppUserId = u.Id where p.Id = @projectId
end

# Client

Use Visual Studio Code