import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { GetAllProject } from 'src/app/models/getallproject';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-v2',
  templateUrl: './home-v2.component.html',
  styleUrls: ['./home-v2.component.css']
})
export class HomeV2Component implements OnInit {
  user:any;
  getAllProject: GetAllProject = new GetAllProject();
  isLoading: boolean = false;
  projects:any[] = [];
  totalProjects: number = 0;
  data :any[] = [];
  constructor(private userSerivice: UserService, private projectService: ProjectService) { }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getAllProject.departmentId = this.user.departmentId
    await this.fetchProjectData();
    // this.divideProjectData();
  }

 async fetchProjectData(){
    this.isLoading = true;
      this.getAllProject.departmentId = this.user?.departmentId
   await this.projectService
      .getAllProject(this.getAllProject)
      .pipe(catchError((err) => of(err)))
      .toPromise().then((response) => {
        this.projects = response;
        this.totalProjects = response.length;
        const obj = {
          name:'Tasks',
          series:[]
        }
        this.projects.forEach((project)=>{
          obj.series.push({
            value: project.taskCount,
            name: this.pipeDate(project.deadlineDate)
          })
        })
        this.data.push(obj);
        this.data = [...this.data];
        this.isLoading = false;
      });
  }

  pipeDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-yyyy');
  }

 



}
