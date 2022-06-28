import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ProjectsComponent } from '../projects.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent extends ProjectsComponent implements OnInit {
  users: any[] = [];

  fetchUserData() {
    this.isLoading = true;
    this.showLoading();
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
        this.hideLoading();
        this.isLoading = false;
      });
  }

  getLeader(departmentId: any){
    return this.users.find((user) => user.departmentId == departmentId)?.firstName + ' ' +  this.users.find((user) => user.departmentId == departmentId)?.lastName;
  }

  goBack() {
    this.router.navigateByUrl("home")
  }
}
