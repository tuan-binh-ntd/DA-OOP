import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DeparmentService } from 'src/app/services/deparment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(private departmentService: DeparmentService,
    private userService: UserService,
  ) { }
  users: any[] = [];
  departments: any[] = [];

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchDepartmentData();
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
  getDepartmentName(id: string) {
    return this.departments.find(department => department.id === id)?.departmentName
  }
}
