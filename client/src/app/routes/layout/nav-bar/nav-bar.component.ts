import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePasswordComponent } from '../../shared/change-password/change-password.component';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @ViewChild('modalChangePassword') modalChangePassword!: ChangePasswordComponent;
  userName!: string;
  countMessage:number = 0;
  projectId: string = '';
  loggedIn: boolean = false;
  right: boolean = true;
  left: boolean = true;
  users: any[] = [];
  isShowModal: boolean = false;
  user: User;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    protected route: ActivatedRoute,
    private router: Router,
  ) {

   }

  fetchUserData() {
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
      });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.userName = user.name;
    this.right = user.permissionCode == Permission.ProjectManager;
    this.left = user.permissionCode == Permission.Employee;
    this.fetchUserData();
  }
  logout() {
    this.authenticationService.logout();
  }

  getUser() {
    return this.authenticationService.currentUser;
  }

  getUserName(id: string) {
    const user = this.users.find((user) => user.appUserId === id);
    return user?.userName;
  }

  openModal(data: any) {
    var myModal = new bootstrap.Modal(
      document.getElementById('changePasswordModal')!
    );
    myModal.show();
    this.isShowModal = true;
    this.modalChangePassword.openModal(data);
  }

  onViewTask(view: any) {
    var u = document.location.pathname;
    this.projectId = u.substring(16,52);
    if(this.projectId && this.projectId !== 'calendar' && this.projectId !== 'status' && this.projectId !== 'list'){
      if (view == 'list') {
        this.router.navigate(['projects/tasks', this.projectId, 'list']);
      }
      else if (view == 'calendar') {
        this.router.navigate(['projects/tasks', this.projectId, 'calendar']);
      }
      else {
        this.router.navigate(['projects/tasks', this.projectId, 'status']);
      }
    } else {
      if (view == 'list') {
        this.router.navigate(['projects/tasks/list']);
        }
        else if (view == 'calendar') {
          this.router.navigate(['projects/tasks/calendar']);
        }
        else {
          this.router.navigate(['projects/tasks/status']);
        }
    }
  }

  getCountMessage(ev:any){
    this.countMessage = ev;
  }
}

