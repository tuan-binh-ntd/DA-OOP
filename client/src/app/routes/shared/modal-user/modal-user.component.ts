import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/models/user';
@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  @Output() onChangeUser = new EventEmitter();
  isLoading: boolean = false;
  mode: string = 'create';
  title: string = 'New Employee';
  isEdit: boolean = false;
  modalForm!: FormGroup;
  change: boolean = false;
  users: any[] = [];
  departments: any[] = [];
  data: any;
  user: User;
  permission: any[] = [
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' }
  ]
  constructor(private authenticationService: AuthenticationService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchUserData();
    this.fetchDepartmentData();
    this.initForm();
  }

  fetchUserData() {
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
      });
  }

  fetchDepartmentData(){
    this.departmentService.getAllDepartment().pipe(catchError((err) => of(err)))
    .subscribe((response) => {
      this.departments = response;
    });
  }

  getUser() {
    return this.authenticationService.currentUser;
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      password: [null, Validators.required],
      departmentId: [null, Validators.required],
      permissionCode: [null, Validators.required],
      permissionCreator: [null]
    });
  }

  openModal(data: any, mode: string, isEdit: boolean) {
    this.isEdit = isEdit;
    this.mode = mode;
    this.data = data;
    this.modalForm.reset();
    if (mode === 'create') {
      this.title = 'New Employee';
      this.modalForm.get('permissionCode')?.setValue(Permission.Employee);
      this.modalForm.get('departmentId')?.setValue(this.user.departmentId);
    } else {
      this.modalForm.patchValue(data);
      this.checkEditForm();
    }
  }

  checkEditForm() {
    this.modalForm.patchValue(this.data);
    if (this.isEdit) {
      this.modalForm.enable();
      this.title = 'Update: ' + this.data.firstName + ' ' + this.data.lastName;
    } else {
      this.modalForm.disable();
      this.title = 'View: ' + this.data.firstName + ' ' + this.data.lastName;
    }
  }

  onSubmit() {
    this.isLoading = true;
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
      this.modalForm.value.permissionCreator = Number(JSON.parse(localStorage.getItem('user')).permissionCode)
      if (this.mode === 'create') {
        this.authenticationService
          .register(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            }), finalize(() => this.isLoading = false)
          )
          .subscribe((response) => {
            if (response.id) {
              this.toastr.success('Successfully!');
              this.onChangeUser.emit();
            } else {
              this.toastr.error("You must had permission or department had leader")
            }
          });
      }
      else {
        this.modalForm.value.id = this.data.appUserId;
        this.userService
          .updateUser(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            }), finalize(() => this.isLoading = false)
          )
          .subscribe(response => {
            if (response.id) {
              this.toastr.success('Successfully!');
              this.onChangeUser.emit();
            } else {
              this.toastr.error(response.error);
            }
          });
      }
    } else {
      this.toastr.warning("Invalid data")
      this.isLoading = false;
    }
  }

  onChangeEdit(ev: any) {
    this.isEdit = ev;
    if (this.mode === 'detail') {
      this.checkEditForm();
    }
  }
}
