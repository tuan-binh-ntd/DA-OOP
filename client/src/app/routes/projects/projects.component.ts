import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, of,take } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { ModalProjectComponent } from '../shared/modal-project/modal-project.component';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/services/department.service';
import { GetAllProject } from 'src/app/models/getallproject';
import { User } from 'src/app/models/user';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {

  constructor(
    protected projectService: ProjectService,
    protected userService: UserService,
    protected departmentService: DepartmentService,
    protected router: Router,
    protected spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }
  @ViewChild('modalProject') modalProject!: ModalProjectComponent;
  $: any;
  isLoading: boolean = false;
  projects: any[] = [];
  departments: any[] = [];
  allRecord: number = 0;
  users: any[] = [];
  resolvedRecord: number = 0;
  inProgressRecord: number = 0;
  closedRecord: number = 0;
  isAllRecord: boolean = true;
  isResolvedRecord: boolean = false;
  isInProgressRecord: boolean = false;
  isClosedRecord: boolean = false;
  isShowModal: boolean = false;
  right: boolean = false;
  openProjects: any[] = [];
  inProgressProject: any[] = [];
  resolvedProject: any[] = [];
  reOpenProject: any[] = [];
  openCount: number = 0;
  inProgressCount: number = 0;
  resolvedCount: number = 0;
  reOpendCount: number = 0;
  user: User;
  assigneeInfo:any;
  getAllProject: GetAllProject = new GetAllProject();
 async ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'))
    this.user = JSON.parse(localStorage.getItem('user'))
    if (user?.permissionCode === Permission.ProjectManager) {
      this.right = true
    }
   await this.fetchUserData();
    this.fetchDepartmentData();
    this.fetchProjectData();
  }

  async fetchUserData() {
    this.assigneeInfo = JSON.parse(localStorage.getItem('user'));
    this.isLoading = true;
    this.showLoading();
  await  this.userService
      .getAllUser()
      .pipe(take(1))
      .toPromise().then((response) => {
        this.users = response;
        this.hideLoading();
        this.isLoading = false;
      });
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

  fetchProjectData() {
    this.isLoading = true;
    this.showLoading();
    if (!this.right) {
      this.getAllProject.departmentId = this.user?.departmentId
    }
    this.projectService
      .getAllProject(this.getAllProject)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.projects = response;
        this.allRecord = this.projects.length;
        this.reOpenProject = this.projects.filter(project=> project.statusCode === StatusCode.Reopened);
        this.reOpendCount = this.reOpenProject.length;
        this.openProjects = this.projects.filter(project=> project.statusCode === StatusCode.Open);
        this.openCount = this.openProjects.length;
        this.inProgressProject = this.projects.filter(project=> project.statusCode === StatusCode.InProgress);
        this.inProgressCount = this.inProgressProject.length;
        this.resolvedProject = this.projects.filter(project=> project.statusCode === StatusCode.Resolved);
        this.resolvedCount = this.resolvedProject.length;
        this.hideLoading();
        this.isLoading = false;
      });
  }
getUserInvolve(id:string){
 const prj = this.projects.find(project => project.id === id);
 const userInvolve = this.users.filter(element => prj.userList.includes(element.appUserId));
  return userInvolve
}
  getDepartmentName(id: string) {
    return this.departments.find((department) => department.id === id)
      ?.departmentName;
  }

  openDetailModal(data: any, mode: string, isEdit: boolean) {
    var myModal = new bootstrap.Modal(
      document.getElementById('createProjectModal')!
    );
    myModal.show();
    this.isShowModal = true;
    this.modalProject.openModal(data, mode, isEdit);
  }

  onViewTask(projectId: string): any {
    document.location.href= 'projects/tasks/' + projectId;
  }

  onChangeProject() {
    var myModal = new bootstrap.Modal(
      document.getElementById('createProjectModal')!
    );

    // $('#createProjectModal').modal('hide')
    // $('#createProjectModal').hide;
    myModal.hide();
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
    this.isShowModal = false;
    this.fetchProjectData();
  }

  roundProgress(progress: number) {
    return Math.round(progress) + '%'
  }

  openModal() {
    this.modalProject.openModal(null, 'create', true);
    this.isShowModal = true;
  }

  onSearch(ev: any) {
    if (ev.key === "Enter") {
      this.getAllProject.keyWord = ev.target.value;
      this.fetchProjectData();
    }
  }

  submitFormFilter(data: any) {
    this.getAllProject.createDateFrom = data.createDateFrom;
    this.getAllProject.createDateTo = data.createDateTo;
    this.getAllProject.deadlineDateFrom = data.deadlineDateFrom;
    this.getAllProject.deadlineDateTo = data.deadlineDateTo;
    this.getAllProject.completeDateFrom = data.completeDateFrom;
    this.getAllProject.completeDateTo = data.completeDateTo;
    this.fetchProjectData();
  }

  onFilterType(type: any) {
    this.getAllProject.projectType = type;
    this.fetchProjectData();
  }

  onFilterStatus(status: any) {
    this.getAllProject.statusCode = status;
    this.fetchProjectData();
  }

  onFilterPriority(priority: any) {
    this.getAllProject.priorityCode = priority;
    this.fetchProjectData();
  }

  onResetFilter() {
    this.getAllProject.projectType = null;
    this.getAllProject.statusCode = null;
    this.getAllProject.priorityCode = null;
    this.getAllProject.keyWord = null;
    this.getAllProject.createDateFrom = null;
    this.getAllProject.createDateTo = null;
    this.getAllProject.deadlineDateFrom = null;
    this.getAllProject.deadlineDateTo = null;
    this.getAllProject.completeDateFrom = null;
    this.getAllProject.completeDateTo = null;
    this.fetchProjectData();
  }

  hideLoading(){
    document.getElementById('spinner').style.display = 'none';
  }

  showLoading(){
      document.getElementById('spinner').style.display = 'block';
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.isLoading = true;
      this.spinner.show();
      let payload;
      if(event.container.id === 'reopen') {
         payload = {
          // @ts-ignore
          projectId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Reopened
        }
      }
      else if(event.container.id === 'open') {
         payload = {
          // @ts-ignore
          projectId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Open
        }
      }
      else if(event.container.id === 'inProgress') {
         payload = {
          // @ts-ignore
          projectId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.InProgress
        }
      }
      else{

         payload = {
          // @ts-ignore
          projectId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Resolved
        }
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.showLoading();
      this.projectService
      .patchProject(payload)
      .pipe(
        catchError((err) => {
          return of(err);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.toastr.success('Successfully!');
          this.hideLoading();
          this.isLoading = false;
          setTimeout(()=>{
            this.toastr.clear()
          },700)
        } else {
          this.toastr.error('Failed');
          this.hideLoading();
          this.isLoading = false;
        }
      });
      // this.spinner.hide();
    }
  }
}
