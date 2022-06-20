import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { User } from 'src/app/models/user';
import { AppUser } from 'src/app/models/user.model';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  user: User;
  departments: any[] = [];
  currentUser: AppUser = new AppUser();
  permission: any[] = [
    { value: Permission.ProjectManager, viewValue: 'ProjectManager' },
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' },
  ];
  constructor(
    private userService: UserService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchUserData();
    this.fetchDepartmentData();
  }

  fetchUserData() {
    this.isLoading = true;
    this.showLoading();
    this.userService
      .getUser(this.user.id)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.currentUser = response;
        this.hideLoading();
        this.isLoading = false;
      });
  }

  fetchDepartmentData() {
    this.isLoading = true;
    this.showLoading();
    this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.departments = response;
        this.hideLoading();
        this.isLoading = false;
      });
  }

  getDepartmentName(id: string) {
    return this.departments.find((department) => department.id === id)
      ?.departmentName;
  }

  getPermission(permission: Permission) {
    return this.permission.find(
      (permissionCode) => permissionCode.value == permission
    )?.viewValue;
  }

  hideLoading() {
    document.getElementById('spinner').style.display = 'none';
  }

  showLoading() {
    document.getElementById('spinner').style.display = 'block';
  }
}
