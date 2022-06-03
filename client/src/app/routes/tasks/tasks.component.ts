import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar } from '@fullcalendar/angular';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { GetAllProject } from 'src/app/models/getallproject';
import { GetAllTask } from 'src/app/models/getalltask';
import { SearchTask } from 'src/app/models/searchtask';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { ModalTaskComponent } from '../shared/modal-task/modal-task.component';
import { TaskFilterComponent } from '../shared/task-filter/task-filter.component';

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
  isMyTask: string = '';
  userId: string = '';
  sub: any;
  isShowModal: boolean = false;
  right: boolean = false;
  user: User;
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
  getAllProject: GetAllProject = new GetAllProject();
  getAllTask: GetAllTask = new GetAllTask();
  searchTask: SearchTask = new SearchTask();
  constructor(
    protected taskService: TaskService,
    protected projectService: ProjectService,
    protected userService: UserService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
    forwardRef(() =>Calendar);
   }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['type'];
    })
    this.user = JSON.parse(localStorage.getItem('user'));
    if (Number(this.user.permissionCode) === Permission.ProjectManager || Number(this.user.permissionCode) === Permission.Leader) {
      this.right = true
    }
    this.userId = Number(this.user.permissionCode) == Permission.ProjectManager ? null : this.user.id;
    this.fetchUserData();
    this.fetchProjectData();
    this.fetchTaskData();
  }

  fetchTaskData(){
    if(this.projectId === 'mytask'){
      this.projectId = null;
      this.fetchMyTaskData();
    } else if (this.projectId === 'assign'){
      this.projectId = null;
      this.fetchCreateTaskData();
    } else {
      this.fetchMyTaskData();
      this.fetchCreateTaskData();
    }
  }

  fetchMyTaskData() {
    this.sub = this.taskService
      .getAllTask(this.projectId, this.userId, this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
      });
  }
  fetchCreateTaskData() {
    this.sub = this.taskService
      .getAllTaskCreator(this.projectId, this.userId, this.getAllTask)
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
      .getAllProject(this.getAllProject)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.projects = response;
      });
  }
  getUserName(id: string) {
    const user = this.users.find((user) => user.appUserId === id)
    return user?.userName;
  }

  getProjectName(id: string) {
    return this.projects.find((project) => project.id === id)?.projectName;

  }

  getPriority(priorityCode: string) {
    return this.priorityCode.find((priority) => priority.value == priorityCode)?.viewValue;
  }

  getStatus(statusCode: string) {
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

  goBack() {
    this.router.navigateByUrl("home")
  }

  onSearch(ev: any) {
    if (ev.key === "Enter") {
      this.getAllTask.keyWord = ev.target.value;
      this.fetchTaskData();
    }
  }

  submitFormFilter(data:any){
    this.getAllTask.createDateFrom = data.createDateFrom;
    this.getAllTask.createDateTo = data.createDateTo;
    this.getAllTask.deadlineDateFrom = data.reateDateTo ;
    this.getAllTask.deadlineDateTo = data.deadlineDateTo;
    this.getAllTask.completeDateFrom = data.completeDateFrom;
    this.getAllTask.completeDateTo =data.completeDateTo;
    this.fetchTaskData();
 }

 onFilterType(type:any){
    this.getAllTask.taskType = type;
    this.fetchTaskData();
 }

 onFilterStatus(status:any){
   this.getAllTask.statusCode = status;
   this.fetchTaskData();
 }

 onFilterPriority(priority:any){
   this.getAllTask.priorityCode = priority;
   this.fetchTaskData();
 }

 onResetFilter(){
   this.getAllTask.taskType = null;
   this.getAllTask.statusCode = null;
   this.getAllTask.priorityCode = null;
   this.fetchTaskData();
  }
}
