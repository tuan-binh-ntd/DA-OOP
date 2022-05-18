import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Output() onChangeUser = new EventEmitter();
  changePasswordForm!: FormGroup;
  change: boolean = false;
  user: User;
  data: any[] = [];
  constructor(private authenticationService: AuthenticationService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.initForm();
  }

  getCurrentUser() {
    return this.authenticationService.currentUser.pipe(catchError((err) => of(err))).subscribe(user => this.user = user)
  }

  initForm() {
    this.changePasswordForm = this.fb.group({
      email: [this.user.email, Validators.required],
      password: [null, Validators.required],
    });
  }

  onSubmit() {
    for (const i in this.changePasswordForm.controls) {
      this.changePasswordForm.controls[i].markAsDirty();
      this.changePasswordForm.controls[i].updateValueAndValidity();
    }
    if (this.changePasswordForm.valid) {
      this.userService
        .changePassword(this.changePasswordForm.value)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Successfully!');
            this.onChangeUser.emit();
          } else {
            this.toastr.error('Failed');
          }
        });
    }
  }
}