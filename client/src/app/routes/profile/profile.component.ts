import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  users: any[] = [];
  user: User;
  departments: any[] = [];
  permission: any[] = [
    { value: Permission.ProjectManager, viewValue: 'ProjectManager' },
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' }
  ]
  constructor(private authenticationService: AuthenticationService,
              private userService: UserService,
              private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchDepartmentData();
    this.getCurrentUser();
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

  getCurrentUser(){
    return this.authenticationService.currentUser.pipe(catchError((err) => of(err))).subscribe(user => this.user = user)
  }

  getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  getDepartmentName(id: string) {
    return this.departments.find((department) => department.id === id)?.departmentName;
  }

  getPermission(permission: string){
    return this.permission.find((permissionCode) => permissionCode.value == permission)?.viewValue;
  }
}
