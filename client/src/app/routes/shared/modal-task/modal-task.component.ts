import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { User } from 'src/app/models/user';
import { DepartmentService } from 'src/app/services/department.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { finalize } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
import { MessageService } from 'src/app/services/message.service';
import { Permission } from 'src/app/helpers/PermisionEnum';
@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.css'],
})
export class ModalTaskComponent implements OnInit, OnDestroy {
  @Input() projects: any[] = [];
  @Input() data;
  any;
  leaderInfo: any;
  employeeInfo: any;
  departmentName: any;
  currentUserInfo: User;
  @Output() onChangeTask = new EventEmitter();
  isLoading: boolean = false;
  messageForm: FormGroup;
  mode: string = 'create';
  index: number = 0;
  title: string = 'New Task';
  users: any[] = [];
  departments: any[] = [];
  modalForm!: FormGroup;
  isEdit: boolean = false;
  messages: any[] = [];
  pId: string = '';
  taskTypes: any[] = [
    { value: 'bug', viewValue: 'Bug' },
    { value: 'feature', viewValue: 'Feature' },
    { value: 'rnd', viewValue: 'RnD' },
  ];
  statusCode: any[] = [
    { value: StatusCode.Reopened, viewValue: 'Reopened' },
    { value: StatusCode.Resolved, viewValue: 'Resolved' },
    { value: StatusCode.Open, viewValue: 'Open' },
    { value: StatusCode.InProgress, viewValue: 'InProgress' },
    { value: StatusCode.Closed, viewValue: 'Closed' },
  ];
  priorityCode: any[] = [
    { value: Priority.Urgent, viewValue: 'Urgent' },
    { value: Priority.High, viewValue: 'High' },
    { value: Priority.Medium, viewValue: 'Medium' },
    { value: Priority.Normal, viewValue: 'Normal' },
    { value: Priority.Low, viewValue: 'Low' },
  ];
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private departmentService: DepartmentService,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public messageService: MessageService
  ) {}


  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pId = params['id'];
    });
    this.currentUserInfo = JSON.parse(localStorage.getItem('user'));
    this.fetchProjectData();
    this.fetchUserData();
    this.initForm();
    Number(this.currentUserInfo.permissionCode) === Permission.Employee
      ? this.statusCode.shift() && this.statusCode.pop()
      : null;
      this.userService.getUser(this.data.appUserId).subscribe((res) => {
        this.employeeInfo = res;
      });
  }

  getDepartmentName(id: string) {
    return this.departments.find((department) => department.id === id)
      ?.departmentName;
  }

  async fetchUserData() {
    await this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .toPromise()
      .then((response) => {
        this.users = response;
      });
  }

  fetchProjectData() {
    this.projectService
      .getAllProject()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.projects = response;
        if (this.currentUserInfo.departmentId) {
          this.projects = this.projects.filter(
            (p) => p.departmentId == this.currentUserInfo.departmentId
          );
        }
      });
  }

  fetchMessage() {
    this.messageService
      .getMessageThread(this.data.id)
      .toPromise()
      .then((res) => {
        if (res) {
          this.messages = res;
        }
      });
  }

  async fetchDepartmentData() {
    await this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .toPromise()
      .then((response) => {
        this.departments = response;
      });
  }

  connectHub() {
    this.messageService.createHubConnection(
      this.currentUserInfo,
      this.currentUserInfo.permissionCode == Permission.Leader
      ? this.employeeInfo.firstName + '-' + this.employeeInfo.lastName
      : this.leaderInfo.firstName + '-' + this.leaderInfo.lastName,
      this.data.id
    );
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      taskName: [null, Validators.required],
      taskType: [null, Validators.required],
      taskCode: [null, Validators.required],
      createUserId: [null, Validators.required],
      createDate: [null, Validators.required],
      deadlineDate: [null, Validators.required],
      priorityCode: [Priority.Medium, Validators.required],
      statusCode: [StatusCode.Open],
      projectId: [null, Validators.required],
      appUserId: [null, Validators.required],
      description: [null],
      completeDate: [null],
      permissionCode: [null],
    });
    this.messageForm = this.fb.group({
      content: [null],
    });
  }

  async openModal(data: any, mode: string, isEdit: boolean) {
    this.index = 0;
    this.isEdit = isEdit;
    this.mode = mode;
    this.data = data;
    this.modalForm.reset();
    this.messageForm.reset();
    this.modalForm.get('createUserId').setValue(this.currentUserInfo.id);
    if (mode === 'create') {
      this.modalForm.enable();
      this.title = 'New Task';
      this.modalForm.get('priorityCode')?.setValue(Priority.Medium);
      this.modalForm.get('statusCode')?.setValue(StatusCode.Open);
      this.modalForm.get('createDate')?.setValue(new Date());
      this.modalForm.get('createUserId').setValue(this.currentUserInfo.id);
      this.modalForm.get('projectId').setValue(this.pId);
      if (this.pId) {
        this.modalForm.controls['projectId'].disable();
      }
      this.modalForm.controls['createUserId'].disable();
      this.modalForm.controls['statusCode'].disable();
      this.modalForm.controls['createDate'].disable();
    } else if (mode === 'detail') {
      this.modalForm.patchValue(data);
      await this.fetchDepartmentData();
      await this.fetchUserData();
      if (this.currentUserInfo.departmentId) {
        this.leaderInfo = this.users.find(
          (user) =>
            user.departmentId === this.currentUserInfo.departmentId &&
            user.permissionCode === Permission.Leader
        );
        this.employeeInfo = this.users.find(
          (user) =>
            user.departmentId === this.currentUserInfo.departmentId &&
            user.permissionCode === Permission.Employee &&
            user.appUserId === this.data.appUserId
        );
        this.users = this.users.filter(
          (u) =>
            u.departmentId == this.currentUserInfo.departmentId &&
            Number(u.permissionCode) !== Permission.ProjectManager
        );
      } else {
        this.leaderInfo = this.users.find(
          (user) => user.permissionCode === Permission.Leader
        );
        this.employeeInfo = this.users.find(
          (user) =>
            user.permissionCode === Permission.Employee &&
            user.appUserId === this.data.appUserId
        );
        this.users = this.users.filter(
          (u) => Number(u.permissionCode) !== Permission.ProjectManager
        );
      }
      this.departmentName = this.getDepartmentName(
        this.leaderInfo.departmentId
      );
      if(this.data.appUserId != this.data.createUserId) {
        this.connectHub();
      }

      this.fetchMessage();
      this.checkEditForm();
    } else {
      this.modalForm.patchValue(data);
    }
  }



  checkEditForm() {
    this.modalForm.patchValue(this.data);
    if (this.isEdit) {
      this.modalForm.enable();
      this.title = 'Update: ' + this.data.taskName;
    } else {
      this.modalForm.disable();
      this.title = 'View: ' + this.data.taskName;
    }
    this.modalForm.controls['createUserId'].disable();
    this.modalForm.controls['completeDate'].disable();
    this.modalForm.controls['createDate'].disable();
    this.modalForm.controls['projectId'].disable();
    if (Number(this.currentUserInfo.permissionCode) == 3) {
      this.modalForm.controls['taskName'].disable();
      this.modalForm.controls['taskType'].disable();
      this.modalForm.controls['taskCode'].disable();
      this.modalForm.controls['appUserId'].disable();
      this.modalForm.controls['description'].disable();
      this.modalForm.controls['priorityCode'].disable();
      this.modalForm.controls['deadlineDate'].disable();
    }
  }

  submitForm() {
    this.isLoading = true;
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
      this.modalForm.value.createUserId = this.currentUserInfo.id;
      if (this.mode === 'create') {
        if (this.pId) {
          this.modalForm.value.projectId = this.pId;
        }
        this.taskService
          .createTask(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            }),
            finalize(() => (this.isLoading = false))
          )
          .subscribe((response) => {
            if (response.id) {
              this.toastr.success('Successfully!');
              this.onChangeTask.emit();
            } else {
              this.toastr.error(response.error);
            }
          });
      } else if (this.mode === 'detail') {
        this.modalForm.value.permissionCode =
          this.currentUserInfo.permissionCode;
        this.modalForm.value.projectId = this.data.projectId;
        this.taskService
          .updateTask(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            }),
            finalize(() => (this.isLoading = false))
          )
          .subscribe((response) => {
            if (response.id) {
              this.toastr.success('Successfully!', '', {
                timeOut: 1000,
              });
            } else {
              this.toastr.error(response.error);
            }
            this.onChangeTask.emit();
          });
      }
    } else {
      this.toastr.warning('Invalid data');
      this.isLoading = false;
    }
    if (this.mode === 'delete') {
      this.taskService
        .deleteTask(this.modalForm.value.id)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Successfully!', '', {
              timeOut: 1000,
            });
            this.onChangeTask.emit();
          } else {
            this.toastr.error('You not permission');
          }
        });
    }
  }

  onChangeEdit(ev: any) {
    this.isEdit = ev;
    if (this.mode === 'detail') {
      this.checkEditForm();
    }
  }

  onChat(ev: any) {
    if (ev.key === 'Enter') {
      const payload = {
        taskId: this.data.id,
        senderId: this.currentUserInfo.id,
        recipientId:
          this.currentUserInfo.permissionCode === Permission.Leader
            ? this.employeeInfo.appUserId
            : this.leaderInfo.appUserId,
        content: this.messageForm.value.content,
      };
      this.messageService
        .sendMessage(payload)
        .then(() => {
          this.messages.push(payload);
          this.messageForm.reset();
        });
    }
  }

  ngOnDestroy() {
    this.messageService.stopHubConnection();
  }
}
