import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePasswordComponent } from '../../change-password/change-password.component';
import { ModalUserComponent } from '../../shared/modal-user/modal-user.component';
import { TasksComponent } from '../../tasks/tasks.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userName!: string;
  projectId: string = '';
  loggedIn: boolean = false;
  right: boolean = true;
  left: boolean = true;
  users: any[] = [];
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

  onViewTask(view: any) {
    var u = document.location.pathname;
    this.projectId = u.substring(16,52);
    if(this.projectId && this.projectId !== 'calendar' && this.projectId !== 'status'){
      if (view == 'list') {
        this.router.navigate(['projects/tasks', this.projectId]);
      }
      else if (view == 'calendar') {
        this.router.navigate(['projects/tasks', this.projectId, 'calendar']);
      }
      else {
        this.router.navigate(['projects/tasks', this.projectId, 'status']);
      }
    } else {
      if (view == 'list') {
        this.router.navigate(['projects/tasks']);
        }
        else if (view == 'calendar') {
          this.router.navigate(['projects/tasks/calendar']);
        }
        else {
          this.router.navigate(['projects/tasks/status']);
        }
    }
  }
}

