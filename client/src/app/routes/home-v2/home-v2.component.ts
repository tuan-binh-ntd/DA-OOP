import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { GetAllProject } from 'src/app/models/getallproject';
import { GetAllTask } from 'src/app/models/getalltask';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
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
  reOpenProject: number = 0;
  openProject: number = 0;
  inProgressProject: number = 0;
  resolvedProject: number = 0;
  getAllTask: GetAllTask = new GetAllTask();
  data :any[] = [];
  tasks: any[] = [];
  pieData: any[] = []
  constructor(private userSerivice: UserService, private projectService: ProjectService,
    private taskService: TaskService,
    ) { }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getAllProject.departmentId = this.user.departmentId
    await this.fetchProjectData();
     this.fetchTaskData();
    // this.divideProjectData();
  }

  fetchTaskData() {
    this.isLoading = true;
    this.taskService
      .getAllTask(this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
          this.tasks = this.tasks.filter(t => t.createUserId !== t.appUserId);
        this.isLoading = false;
      });
  }

 async fetchProjectData(){
    this.isLoading = true;
      this.getAllProject.departmentId = this.user?.departmentId
   await this.projectService
      .getAllProject(this.getAllProject)
      .pipe(catchError((err) => of(err)))
      .toPromise().then((response) => {
        debugger
        this.projects = response;
        this.totalProjects = response.length;
        this.pushLineChartData();
        this.pushPieChartData();
        this.isLoading = false;
      });
  }

    pushPieChartData(){
      this.reOpenProject = this.projects.filter(project=> project.statusCode === StatusCode.Reopened).length;
      this.openProject = this.projects.filter(project=> project.statusCode === StatusCode.Open).length;
      this.inProgressProject = this.projects.filter(project=> project.statusCode === StatusCode.InProgress).length;
      this.resolvedProject = this.projects.filter(project=> project.statusCode === StatusCode.Resolved).length;
      this.pieData = [
        {
          name: "Germany",
          value: 40632,
          extra: {
            code: "de"
          }
        },
        {
          "name": "United States",
          "value": 50000,
          "extra": {
            "code": "us"
          }
        }
        
      ]
      }

    pushLineChartData(){
      const line = {
        name:'Project',
        series:[]
      }
      this.projects.forEach((project)=>{
        line.series.push({
          value: project.taskCount,
          name: project.projectName
        })
      })
      this.data.push(line);
      this.data = [...this.data];

    }

  pipeDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-yyyy');
  }

 



}
