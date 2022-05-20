import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.css'],
})
export class ModalTaskComponent implements OnInit {
  @Input() projects: any[] = [];
  @Output() onChangeTask = new EventEmitter();
  mode: string = 'create';
  title: string = 'New Task';
  users: any[] = [];
  departments: any[] = [];
  modalForm!: FormGroup;
  isEdit: boolean = false;
  data: any;
  user: User;
  taskTypes: any[] = [{ value: 'Test', viewValue: 'Test' }];
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
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchDepartmentData();
    this.getCurrentUser();
    this.initForm();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getCurrentUser() {
    return this.authenticationService.currentUser
      .pipe(catchError((err) => of(err)))
      .subscribe((user) => (this.user = user));
  }

  fetchUserData() {
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
      });
  }

  fetchDepartmentData() {
    this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.departments = response;
      });
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
  }

  openModal(data: any, mode: string, isEdit: boolean) {
    this.isEdit = isEdit;
    this.mode = mode;
    this.data = data;
    this.modalForm.reset();
    if (mode === 'create') {
      this.title = 'New Task';
      this.modalForm.get('priorityCode')?.setValue(Priority.Medium);
      this.modalForm.get('statusCode')?.setValue(StatusCode.Open);
      this.modalForm.get('createDate')?.setValue(new Date());
    } else {
      this.modalForm.patchValue(data);
      this.checkEditForm();
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
  }

  submitForm() {
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
      if (this.mode === 'create') {
        this.taskService
          .createTask(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            })
          )
          .subscribe((response) => {
            if (response) {
              this.toastr.success('Successfully!');
              this.onChangeTask.emit();
            } else {
              this.toastr.error('Failed');
            }
          });
      } else {
        this.modalForm.value.permissionCode = this.user.permissionCode;
        this.taskService
          .updateTask(this.modalForm.value)
          .pipe(catchError((err) => {return of(err);}))
          .subscribe((response) => {
            if(response.id)
            {
              this.toastr.success('Successfully!', '', {
                timeOut: 1000,
              });
            } else {
              this.toastr.error('You not permission');

            }
            this.onChangeTask.emit();
          });
      }
    }
  }

  onChangeEdit(ev: any) {
    this.isEdit = ev;
    if (this.mode === 'detail') {
      this.checkEditForm();
    }
  }
}
