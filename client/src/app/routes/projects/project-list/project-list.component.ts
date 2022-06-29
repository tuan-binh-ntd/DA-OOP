import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { ProjectsComponent } from '../projects.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent extends ProjectsComponent implements OnInit {
  users: any[] = [];
  
  getLeader(departmentId: any){
    const user = this.users.find((user) => user.departmentId === departmentId && user.permissionCode===Permission.Leader)
    return user?.firstName + ' ' + user?.lastName;
  }
  
  goBack() {
    this.router.navigateByUrl("home")
  }
}
