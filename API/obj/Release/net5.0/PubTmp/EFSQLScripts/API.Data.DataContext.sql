IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE TABLE [Department] (
        [Id] uniqueidentifier NOT NULL,
        [DepartmentName] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_Department] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE TABLE [AppUser] (
        [Id] uniqueidentifier NOT NULL,
        [FirstName] nvarchar(20) NOT NULL,
        [LastName] nvarchar(20) NOT NULL,
        [Address] nvarchar(100) NOT NULL,
        [Email] nvarchar(50) NOT NULL,
        [Phone] nvarchar(11) NOT NULL,
        [Password] nvarchar(100) NOT NULL,
        [DepartmentId] uniqueidentifier NULL,
        [PermissionCode] int NOT NULL,
        CONSTRAINT [PK_AppUser] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AppUser_Department_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Department] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE TABLE [Project] (
        [Id] uniqueidentifier NOT NULL,
        [ProjectName] nvarchar(50) NOT NULL,
        [Description] nvarchar(max) NULL,
        [CreateDate] datetime2 NOT NULL,
        [DeadlineDate] datetime2 NOT NULL,
        [CompleteDate] datetime2 NULL,
        [PriorityCode] int NOT NULL,
        [StatusCode] int NOT NULL,
        [DepartmentId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Project] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Project_Department_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Department] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE TABLE [Task] (
        [Id] uniqueidentifier NOT NULL,
        [TaskName] nvarchar(50) NOT NULL,
        [CreateUserId] uniqueidentifier NOT NULL,
        [CreateDate] datetime2 NOT NULL,
        [DeadlineDate] datetime2 NOT NULL,
        [CompleteDate] datetime2 NULL,
        [PriorityCode] int NOT NULL,
        [StatusCode] int NOT NULL,
        [Description] nvarchar(max) NULL,
        [AppUserId] uniqueidentifier NOT NULL,
        [ProjectId] uniqueidentifier NULL,
        CONSTRAINT [PK_Task] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Task_AppUser_AppUserId] FOREIGN KEY ([AppUserId]) REFERENCES [AppUser] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Task_Project_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Project] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE INDEX [IX_AppUser_DepartmentId] ON [AppUser] ([DepartmentId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE INDEX [IX_Project_DepartmentId] ON [Project] ([DepartmentId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE INDEX [IX_Task_AppUserId] ON [Task] ([AppUserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    CREATE INDEX [IX_Task_ProjectId] ON [Task] ([ProjectId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220428152928_AddTaskManagementToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220428152928_AddTaskManagementToDB', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    ALTER TABLE [Task] DROP CONSTRAINT [FK_Task_AppUser_AppUserId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    ALTER TABLE [Task] DROP CONSTRAINT [FK_Task_Project_ProjectId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    DROP INDEX [IX_Task_ProjectId] ON [Task];
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Task]') AND [c].[name] = N'ProjectId');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Task] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Task] ALTER COLUMN [ProjectId] uniqueidentifier NOT NULL;
    ALTER TABLE [Task] ADD DEFAULT '00000000-0000-0000-0000-000000000000' FOR [ProjectId];
    CREATE INDEX [IX_Task_ProjectId] ON [Task] ([ProjectId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Task]') AND [c].[name] = N'AppUserId');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Task] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Task] ALTER COLUMN [AppUserId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    ALTER TABLE [Task] ADD [TaskType] nvarchar(50) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    ALTER TABLE [Project] ADD [ProjectCode] nvarchar(50) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    ALTER TABLE [Project] ADD [ProjectType] nvarchar(50) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    ALTER TABLE [Task] ADD CONSTRAINT [FK_Task_AppUser_AppUserId] FOREIGN KEY ([AppUserId]) REFERENCES [AppUser] ([Id]) ON DELETE NO ACTION;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    ALTER TABLE [Task] ADD CONSTRAINT [FK_Task_Project_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Project] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220505155132_AddMigrationSecondTime')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220505155132_AddMigrationSecondTime', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220524100338_AddTaskCodeToDB')
BEGIN
    ALTER TABLE [Task] ADD [TaskCode] nvarchar(50) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220524100338_AddTaskCodeToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220524100338_AddTaskCodeToDB', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220606100451_AddMessageToDB')
BEGIN
    CREATE TABLE [Messages] (
        [Id] uniqueidentifier NOT NULL,
        [TasksId] uniqueidentifier NOT NULL,
        [SenderId] uniqueidentifier NOT NULL,
        [SenderUserName] nvarchar(40) NOT NULL,
        [RecipientId] uniqueidentifier NOT NULL,
        [RecipientUserName] nvarchar(40) NOT NULL,
        [Content] nvarchar(max) NULL,
        [DateRead] datetime2 NULL,
        [MessageSent] datetime2 NOT NULL,
        [SenderDeleted] bit NOT NULL,
        [RecipientDeleted] bit NOT NULL,
        CONSTRAINT [PK_Messages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Messages_AppUser_RecipientId] FOREIGN KEY ([RecipientId]) REFERENCES [AppUser] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Messages_AppUser_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [AppUser] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Messages_Task_TasksId] FOREIGN KEY ([TasksId]) REFERENCES [Task] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220606100451_AddMessageToDB')
BEGIN
    CREATE INDEX [IX_Messages_RecipientId] ON [Messages] ([RecipientId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220606100451_AddMessageToDB')
BEGIN
    CREATE INDEX [IX_Messages_SenderId] ON [Messages] ([SenderId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220606100451_AddMessageToDB')
BEGIN
    CREATE INDEX [IX_Messages_TasksId] ON [Messages] ([TasksId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220606100451_AddMessageToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220606100451_AddMessageToDB', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220613152203_AddReasonForDelayColunmToDB')
BEGIN
    ALTER TABLE [Task] ADD [ReasonForDelay] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220613152203_AddReasonForDelayColunmToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220613152203_AddReasonForDelayColunmToDB', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220623021002_AddPhotoToDB')
BEGIN
    CREATE TABLE [Photos] (
        [Id] uniqueidentifier NOT NULL,
        [Url] nvarchar(max) NULL,
        [IsMain] bit NOT NULL,
        [PublicId] nvarchar(max) NULL,
        [AppUserId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Photos] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Photos_AppUser_AppUserId] FOREIGN KEY ([AppUserId]) REFERENCES [AppUser] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220623021002_AddPhotoToDB')
BEGIN
    CREATE INDEX [IX_Photos_AppUserId] ON [Photos] ([AppUserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220623021002_AddPhotoToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220623021002_AddPhotoToDB', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220628082521_AddSubTaskToDB')
BEGIN
    CREATE TABLE [SubTasks] (
        [Id] uniqueidentifier NOT NULL,
        [TasksId] uniqueidentifier NOT NULL,
        [SubTaskName] nvarchar(1024) NOT NULL,
        [Status] bit NULL,
        [TimeTracking] datetime2 NULL,
        CONSTRAINT [PK_SubTasks] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_SubTasks_Task_TasksId] FOREIGN KEY ([TasksId]) REFERENCES [Task] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220628082521_AddSubTaskToDB')
BEGIN
    CREATE INDEX [IX_SubTasks_TasksId] ON [SubTasks] ([TasksId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220628082521_AddSubTaskToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220628082521_AddSubTaskToDB', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220708084413_AddNotificationToDB')
BEGIN
    CREATE TABLE [Notifications] (
        [Id] uniqueidentifier NOT NULL,
        [Content] nvarchar(1024) NOT NULL,
        [AppUserId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220708084413_AddNotificationToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220708084413_AddNotificationToDB', N'5.0.16');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220708105728_ModifyNotificationToDB')
BEGIN
    ALTER TABLE [Notifications] ADD [CreateDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220708105728_ModifyNotificationToDB')
BEGIN
    ALTER TABLE [Notifications] ADD [IsRead] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220708105728_ModifyNotificationToDB')
BEGIN
    ALTER TABLE [Notifications] ADD [ProjectId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220708105728_ModifyNotificationToDB')
BEGIN
    ALTER TABLE [Notifications] ADD [TasksId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20220708105728_ModifyNotificationToDB')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20220708105728_ModifyNotificationToDB', N'5.0.16');
END;
GO

COMMIT;
GO

