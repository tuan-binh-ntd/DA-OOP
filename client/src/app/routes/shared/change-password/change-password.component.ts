import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  data: any;
  modalForm!: FormGroup;
  users: any[] = [];
  isLoading: boolean = false;
  passwordCheck: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchUserData();
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
      id: [Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      newPassword: [null, Validators.required],
      passwordConfirm: [null, Validators.required],
    });
  }

  openModal(data: any) {
    this.data = data;
    this.passwordCheck = false;
    this.modalForm.patchValue(data);
    this.modalForm.get('email').disable();
  }
  
  checkPasswordConfirm(){
    if(this.modalForm.value.passwordConfirm == this.modalForm.value.newPassword && this.modalForm.value.password == this.users.find(u => u.appUserId == this.data.id).password){
      this.submitForm();
    } else if(this.modalForm.value.passwordConfirm !== this.modalForm.value.newPassword) {
      this.toastr.warning("PasswordConfirm is uncorrected");
    } else {
      this.toastr.warning("Password is uncorrected");
    }
  }

  submitForm() {
    this.isLoading = true;
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    console.log(this.modalForm.value);
    this.modalForm.value.password = this.modalForm.value.passwordConfirm;
    if (this.modalForm.valid) {
        this.userService
          .changePassword(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            }), finalize(() => this.isLoading = false)
          )
          .subscribe((response) => {
            if (response) {
              this.toastr.success('Successfully!');
            } else {
              this.toastr.error('Failed');
            }
          });
    } else {
      this.toastr.warning("Invalid data");
      this.isLoading = false;
    }
  }

}
