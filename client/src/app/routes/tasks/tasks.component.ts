import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor(private taskService: TaskService,
              private projectService: ProjectService,
              private userService: UserService,
              ) { }
  tasks: any[] = [];
  users: any[] = [];
  projects: any[] = [];

  ngOnInit(): void {
    this.fetchTaskData();
    this.fetchUserData();
    this.fetchProjectData();
  }

  fetchTaskData() {
    this.taskService
      .getAllTask()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
      });
  }
  fetchUserData() {
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
      });
  }
  fetchProjectData() {
    this.projectService
      .getAllProject()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.projects = response;
      });
  }
  getProjectName(id: string){
    return this.projects.find(project => project.id === id)?.projectName
  }
}
