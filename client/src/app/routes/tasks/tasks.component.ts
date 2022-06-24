import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar } from '@fullcalendar/angular';
import * as bootstrap from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { GetAllProject } from 'src/app/models/getallproject';
import { GetAllTask } from 'src/app/models/getalltask';
import { User } from 'src/app/models/user';
import { DepartmentService } from 'src/app/services/department.service';
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
  @ViewChild('modalTask', {static: true}) modalTask!: ModalTaskComponent;
  isLoading: boolean = false;
  leaderInfo: any;
  assigneeInfo:any;
  departmentId:string = '';
  $: any;
  tasks: any[] = [];
  users: any[] = [];
  taskDetail:any;
  projects: any[] = [];
  departments: any[] = [];
  projectId: string = '';
  sub: any;
  isShowModal: boolean = false;
  isMyTask: boolean = false;
  right: boolean = false;
  employee: boolean = false;
  user: User;
  filterUserTask: string = 'Assign';
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
  constructor(
    protected taskService: TaskService,
    protected projectService: ProjectService,
    protected userService: UserService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected toastr: ToastrService,
    protected spinner: NgxSpinnerService,
    protected departmentService: DepartmentService
  ) {
    forwardRef(() => Calendar);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    })
    this.user = JSON.parse(localStorage.getItem('user'));
    if (Number(this.user.permissionCode) === Permission.Leader) {
      this.right = true
    }
    if (Number(this.user.permissionCode) === Permission.Employee) {
      this.employee = true
    }
    if (Number(this.user.permissionCode) === Permission.ProjectManager) {
      this.getAllTask.userId = null;
    } else {
      this.getAllTask.userId = this.user.id;
    }
    this.getAllTask.projectId = this.projectId;
    this.fetchUserData();
    this.fetchProjectData();
    this.fetchTaskData();
    this.fetchDepartmentData();
  }

  fetchDepartmentData() {
    this.isLoading = true;
    this.showLoading();
    this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.departments = response;
        this.hideLoading();
        this.isLoading = false;
      });
  }

  fetchTaskData() {
    this.isLoading = true;
    this.showLoading();
    this.sub = this.taskService
      .getAllTask(this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
        this.departmentId = response.departmentId;
        this.hideLoading();
        this.isLoading = false;
      });
  }
  fetchUserData() {
    this.assigneeInfo = JSON.parse(localStorage.getItem('user'));
    this.isLoading = true;
    this.showLoading();
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
        this.hideLoading();
        this.isLoading = false;
      });
  }
  fetchProjectData() {
    this.isLoading = true;
    this.showLoading();
    this.projectService
      .getAllProject(this.getAllProject)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.projects = response;
        this.hideLoading();
        this.isLoading = false;
      });
  }
  getUserName(id: string) {
    const user = this.users.find((user) => user.appUserId === id)
    return user?.firstName + ' ' + user?.lastName;
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

    this.taskDetail = data;
    this.isShowModal = true;
    setTimeout(()=>{
    if(this.isShowModal){
      myModal.show();
      this.modalTask.openModal(data, mode, isEdit);
    }
    }
    ,300)
<<<<<<< HEAD

=======
>>>>>>> origin/main
  }

  onChangeTask() {
    var myModal = new bootstrap.Modal(
      document.getElementById('createTaskModal')!
    );

    // $('#createProjectModal').modal('hide')
    // $('#createProjectModal').hide;
    myModal.hide();
    this.isShowModal = false;
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

  submitFormFilter(data: any) {
    this.getAllTask.createDateFrom = data.createDateFrom;
    this.getAllTask.createDateTo = data.createDateTo;
    this.getAllTask.deadlineDateFrom = data.deadlineDateFrom;
    this.getAllTask.deadlineDateTo = data.deadlineDateTo;
    this.getAllTask.completeDateFrom = data.completeDateFrom;
    this.getAllTask.completeDateTo = data.completeDateTo;
    this.fetchTaskData();
  }

  onFilterProject(project: any) {
    this.getAllTask.projectId = project;
    this.fetchTaskData();
  }

  onFilterType(type: any) {
    this.getAllTask.taskType = type;
    this.fetchTaskData();
  }

  onFilterStatus(status: any) {
    this.getAllTask.statusCode = status;
    this.fetchTaskData();
  }

  onFilterPriority(priority: any) {
    this.getAllTask.priorityCode = priority;
    this.fetchTaskData();
  }

  onFilterUser() {
    if (this.isMyTask == false) {
      this.filterUserTask = 'My Task';
      this.getAllTask.createUserId = this.user.id;
      this.getAllTask.userId = null;
    }
    else {
      this.filterUserTask = 'Assign';
      this.getAllTask.createUserId = null;
      this.getAllTask.userId = this.user.id;
    }
    this.fetchTaskData();
  }

  onResetFilter() {
    this.getAllTask.taskType = null;
    this.getAllTask.statusCode = null;
    this.getAllTask.priorityCode = null;
    this.getAllTask.keyWord = null;
    this.getAllTask.createDateFrom = null;
    this.getAllTask.createDateTo = null;
    this.getAllTask.deadlineDateFrom = null;
    this.getAllTask.deadlineDateTo = null;
    this.getAllTask.completeDateFrom = null;
    this.getAllTask.completeDateTo = null;
    this.getAllTask.projectId = this.projectId;
    this.fetchTaskData();
  }
  onViewTask(view: any){
    if (view == 'list') {
      this.router.navigate(['projects/tasks', this.projectId]);
    }
    else if (view == 'calendar') {
      this.router.navigate(['projects/tasks', this.projectId, 'calendar']);
    }
    else {
      this.router.navigate(['projects/tasks', this.projectId, 'status']);
    }
  }

  hideLoading(){
    document.getElementById('spinner').style.display = 'none';
  }

  showLoading(){
      document.getElementById('spinner').style.display = 'block';
  }
}
