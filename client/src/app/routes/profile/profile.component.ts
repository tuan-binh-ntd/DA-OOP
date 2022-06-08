import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { User } from 'src/app/models/user';
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
  currentUser: any;
  permission: any[] = [
    { value: Permission.ProjectManager, viewValue: 'ProjectManager' },
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' }
  ]
  constructor(private userService: UserService,
              private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.fetchUserData();
    this.fetchDepartmentData();
  }

  fetchUserData() {
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
        this.currentUser = this.users.find(e => e.appUserId == this.user.id);
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

  getDepartmentName(id: string) {
    return this.departments.find((department) => department.id === id)?.departmentName;
  }

  getPermission(permission: string){
    return this.permission.find((permissionCode) => permissionCode.value == permission)?.viewValue;
  }
}

