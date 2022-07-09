import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loggedIn: boolean = false;
  @ViewChild('toast') toast: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    localStorage.clear();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [null,  [Validators.required,Validators.email]],
      password: [null, Validators.required],
    });
  }

  onSubmit(key?:any) {
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
      if (this.loginForm.valid) {
        this.authenticationService
          .login(this.loginForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            })
          )
          .subscribe((response) => {
            if (!response) {
              this.loggedIn = true;
              this.toastr.success('Login success!', '', {
                timeOut: 1000,
              });
              this.spinner.show();
              setTimeout(() => {
              // this.spinner.hide();
              document.location.href = 'home'
              //this.router.navigateByUrl('home');
              }, 2500);
            }
            else{
              this.toastr.error('Email or password not correct!', '', {
                timeOut: 1000,
              });
            }
          });
      }
  }
  logout() {
    this.authenticationService.logout();
  }

  getCurrentUser() {
    this.authenticationService.currentUser.pipe(catchError((err) => of(err))).subscribe(user => {
      this.loggedIn = !!user;
    })
  }
}
