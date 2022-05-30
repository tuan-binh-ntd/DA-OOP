import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('canvas') baseChart: ElementRef;
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
        display: true,
        position: 'bottom',
        labels:{
          padding: 30,
          color: '#7c828d',
          font:{
            size: 16,
            family: 'Quicksand, sans-serif',
            weight: "700"
          }
        }
      },  title: {
        display: false,
        text: 'Projects Pie Chart',
        position: 'bottom',
    }
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
  };
  
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
    var ctx = this.baseChart.nativeElement.getContext("2d");
    var gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    var gradient2 = ctx.createLinearGradient(0, 0, 0, 400);

    gradient1.addColorStop(0, '#ebf4f5');   
    gradient1.addColorStop(1, '#b5c6e0');
    gradient2.addColorStop(0, '#6ff7e8');   
    gradient2.addColorStop(1, '#1f7ea1');
    var gradient3= ctx.createLinearGradient(0, 0, 0, 400);

    gradient3.addColorStop(0, '#aefb2a');   
    gradient3.addColorStop(1, '#57ebde');
    var gradient4= ctx.createLinearGradient(0, 0, 0, 400);

    gradient4.addColorStop(0, '#0974f1');   
    gradient4.addColorStop(1, '#9fccfa');
    this.pieChartData = {

      labels: ['Reopened', 'Open', 'Completed', 'Inprogress' ],
      datasets: [ {
        data: [ this.reopenedProject, this.openProject, this.completeProject, this.inProgressProject],
        backgroundColor: [
         gradient1,gradient2,gradient3,gradient4
      ],
      hoverBackgroundColor: [
        gradient1,gradient2,gradient3,gradient4
      ],
      hoverBorderColor:[
          '#ff930f'
      ]
      } ]
    };
    const image = new Image();
image.src = 'assets/home-header-bg.jpg';
  }

navigateToProject(){
  this.router.navigateByUrl('projects')
}

}
