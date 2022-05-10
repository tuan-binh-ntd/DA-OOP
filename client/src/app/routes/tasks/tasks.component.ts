import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  tasks: any[] = [];
  users: any[] = [];
  projects: any[] = [];
  projectId: string = '';
  userId: string = '';
  sub: any;
  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.projectId = params['id'];
   })
    this.fetchTaskData();
    this.fetchUserData();
    this.fetchProjectData();
  }

  fetchTaskData() {
  this.sub =  this.taskService
      .getAllTask(this.projectId, '')
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
  getUserName(id: string) {
    const user = this.users.find((user) => user.id === id)
    return user?.firstName + ' ' + user?.lastName;
  }

  getProjectName(id: string){
    return this.projects.find((project) => project.id === id)?.projectName;

  }

  ngOnDestroy() {
    //ActivatedRoute is an Observable is that the router may not recreate the component when navigating to the same component. 
    //In this case the parameter may change without the component being recreated.
    this.sub.unsubscribe();
  }
}
