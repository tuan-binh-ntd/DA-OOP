import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, finalize } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  @Output() onChangeUser = new EventEmitter();
  modalForm!: FormGroup;
  data: any;
  p: any;
  users: any[] = [];
  user: User;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchUserData();
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

  initForm() {
    this.modalForm = this.fb.group({
      deleteUserId: [null, Validators.required],
      deletedUserId: [null, Validators.required],
      deleteUserPermission: [null, Validators.required],
      deletedUserPermission: [null, Validators.required],
      newLeaderId: [null, Validators.required],
    });
  }

  openDeleteUserModal(data: any) {
    this.data = data;
    this.p = this.data.permissionCode;
    this.modalForm.reset();
    this.modalForm.patchValue(data);
    this.modalForm.get('deleteUserId')?.setValue(this.user.id);
    this.modalForm.get('deletedUserId')?.setValue(this.data.appUserId);
    this.modalForm.get('deleteUserPermission')?.setValue(this.user.permissionCode);
    this.modalForm.get('deletedUserPermission')?.setValue(this.data.permissionCode);
  }

  onSubmit() {
    this.isLoading = true;
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
        this.userService
          .deleteUser(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            }), finalize(() => this.isLoading = false)
          )
          .subscribe((response) => {
            if (response) {
              this.toastr.success('Successfully!');
              this.onChangeUser.emit();
            } else {
              this.toastr.error("You must had permission or department had leader")
            }
          });
    } else {
      this.toastr.warning("Invalid data")
      this.isLoading = false;
    }
  }
}
