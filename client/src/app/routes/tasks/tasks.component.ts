import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { catchError, of } from 'rxjs';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { ModalTaskComponent } from '../shared/modal-task/modal-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  @ViewChild('modalTask') modalTask!: ModalTaskComponent;
  $: any;
  tasks: any[] = [];
  users: any[] = [];
  projects: any[] = [];
  projectId: string = '';
  userId: string = '';
  sub: any;
  isShowModal: boolean = false;
  priorityCode: any[] = [
    { value: Priority.Urgent, viewValue: 'Urgent' },
    { value: Priority.High, viewValue: 'High' },
    { value: Priority.Medium, viewValue: 'Medium' },
    { value: Priority.Normal, viewValue: 'Normal' },
    { value: Priority.Low, viewValue: 'Low' },
  ];

  statusCode: any[] = [
    { value: StatusCode.Reopened, viewValue: 'Reopened' },
    { value: StatusCode.Open, viewValue: 'Open' },
    { value: StatusCode.InProgress, viewValue: 'InProgress' },
    { value: StatusCode.Resolved, viewValue: 'Resolved' },
    { value: StatusCode.Closed, viewValue: 'Closed' },
  ]

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.route.params.subscribe(params=>{
        this.projectId = params['id'];
     })
    this.fetchTaskData();
    this.fetchUserData();
    this.fetchProjectData();
  }

  fetchTaskData() {
    this.sub = this.taskService
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

  getPriority(priorityCode: string){
    return this.priorityCode.find((priority) => priority.value == priorityCode)?.viewValue;
  }

  getStatus(statusCode: string){
    return this.statusCode.find((status) => status.value == statusCode)?.viewValue;
  }

  ngOnDestroy() {
    //ActivatedRoute is an Observable is that the router may not recreate the component when navigating to the same component. 
    //In this case the parameter may change without the component being recreated.
    this.sub.unsubscribe();
  }

  openDetailModal(data: any, mode: string, isEdit: boolean) {
    var myModal = new bootstrap.Modal(
      document.getElementById('createTaskModal')!
    );
    myModal.show();
    this.isShowModal = true;
    this.modalTask.openModal(data, mode, isEdit);
  }

  onChangeTask() {
    var myModal = new bootstrap.Modal(
      document.getElementById('createTaskModal')!
    );
    
    // $('#createProjectModal').modal('hide')
    // $('#createProjectModal').hide;
    myModal.hide();
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
    this.isShowModal = false;
    this.fetchTaskData();
  }
}