import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { catchError, of } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import {StatusCode} from 'src/app/helpers/StatusCodeEnum';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  projects: any[] = [];
  reopenedProject: number = 0;
  openProject: number = 0;
  completeProject: number = 0;
  inProgressProject: number = 0;
   pieChartData: ChartData<'pie', number[], string | string[]> 
   pieChartType: ChartType = 'pie';
   pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    }
  };
  enterpriseCount = 0;
  userCount = 0;
  percentCount = 0;
 constructor(private router: Router, private projectService: ProjectService){}
async ngOnInit() {
 await this.fetchProjectData();
  this.divideProjectData();
 }

async fetchProjectData() {
 await this.projectService
    .getAllProject()
    .toPromise().then((response) => {
      this.projects = response;
    });
}

  divideProjectData(){
    this.reopenedProject = this.projects.filter(project=> project.statusCode === StatusCode.Reopened).length;
    this.openProject = this.projects.filter(project=> project.statusCode === StatusCode.Open).length;
    this.inProgressProject = this.projects.filter(project=> project.statusCode === StatusCode.InProgress).length;
    this.completeProject = this.projects.filter(project=> project.statusCode === StatusCode.Resolved).length;
  
    this.pieChartData = {
      labels: ['Reopened Projects', 'Open Projects', 'Completed Projects', 'Inprogress Projects' ],
      datasets: [ {
        data: [ this.reopenedProject, this.openProject, this.completeProject, this.inProgressProject],
      } ]
    };
    const image = new Image();
image.src = 'assets/home-header-bg.jpg';
  }

 enterpriseCountStop = setInterval(()=>{
  this.enterpriseCount ++;
  if(this.enterpriseCount  === 25){
    clearInterval(this.enterpriseCountStop)
  }
}, 50)
userCountStop = setInterval(()=>{
  this.userCount ++;
  if(this.userCount  === 250){
    clearInterval(this.userCountStop)
  }
}, 1)
percentCountStop = setInterval(()=>{
  this.percentCount ++;
  if(this.percentCount  === 92){
    clearInterval(this.percentCountStop)
  }
}, 20)
navigateToProject(){
  this.router.navigateByUrl('projects')
}

}
