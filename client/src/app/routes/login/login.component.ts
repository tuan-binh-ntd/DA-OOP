import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  @ViewChild('toast') toast: any;
  constructor(private fb: FormBuilder, private router: Router, private authenticationService: AuthenticationService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  onSubmit(){
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.valid) {
        this.authenticationService.login(this.loginForm.value).subscribe(response=>{
          if(response){
            this.toastr.success('Login success!','',{
              timeOut: 1000,
            });
        
            setTimeout(()=>{
              this.router.navigateByUrl('home');
            }, 800)
          }
        }, error=>{
          this.toastr.error('Email or password not correct!');
        })
  }
}
}
