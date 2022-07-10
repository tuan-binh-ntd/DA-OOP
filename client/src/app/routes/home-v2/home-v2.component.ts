import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { GetAllProject } from 'src/app/models/getallproject';
import { GetAllTask } from 'src/app/models/getalltask';
import { DepartmentService } from 'src/app/services/department.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-v2',
  templateUrl: './home-v2.component.html',
  styleUrls: ['./home-v2.component.css'],
})
export class HomeV2Component implements OnInit {
  user: any;
  getAllProject: GetAllProject = new GetAllProject();
  isLoading: boolean = false;
  projects: any[] = [];
  totalProjects: number = 0;
  reOpenProject: number = 0;
  openProject: number = 0;
  inProgressProject: number = 0;
  resolvedProject: number = 0;
  closedProject: number = 0;
  reOpenTask: number = 0;
  openTask: number = 0;
  inProgressTask: number = 0;
  resolvedTask: number = 0;
  closedTask: number = 0;
  totalThisMonthProjects: number = 0;
  getAllTask: GetAllTask = new GetAllTask();
  data: any[] = [];
  tasks: any[] = [];
  pieData: any[] = [];
  taskData: any[] = [];
  departments: any[] = [];
  constructor(
    private userSerivice: UserService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private departmentService: DepartmentService,
    public datepipe: DatePipe,
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getAllProject.departmentId = this.user.departmentId;
    this.getAllTask.userId = this.user.id;
    this.fetchDepartmentData();
    await this.fetchProjectData();
    await this.fetchDeadlineProjectData();
    this.fetchTaskData();
    // this.divideProjectData();
  }
  fetchDepartmentData() {
    this.isLoading = true;
    this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.departments = response;
        this.isLoading = false;
      });
  }

  getDepartmentName() {
    return this.departments.find(
      (department) => department.id === this.user.departmentId
    )?.departmentName;
  }

  fetchTaskData() {
    this.isLoading = true;
    this.taskService
      .getAllTask(this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
        //this.tasks = this.tasks.filter((t) => t.createUserId !== t.appUserId);
        this.pushTaskChartData();
        this.tasks.sort(
          (a, b) => parseFloat(a.priorityCode) - parseFloat(b.priorityCode)
        );
        this.tasks.reverse();
        this.isLoading = false;
      });
  }

  async fetchProjectData() {
    this.isLoading = true;
    this.getAllProject.departmentId = this.user?.departmentId;
    await this.projectService
      .getAllProject(this.getAllProject)
      .pipe(catchError((err) => of(err)))
      .toPromise()
      .then((response) => {
        this.projects = response;
        this.totalProjects = response.length;
        // this.pushLineChartData();
        this.isLoading = false;
      });
  }
  async fetchDeadlineProjectData() {
    var today = new Date();
    var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const payload = {
      deadlineDateTo:  this.datepipe.transform(lastDayOfMonth)
    };
    this.isLoading = true;
    this.getAllProject.departmentId = this.user?.departmentId;
    await this.projectService
      .getAllProject(payload)
      .pipe(catchError((err) => of(err)))
      .toPromise()
      .then((response) => {
        this.totalThisMonthProjects = response.length;
        // this.pushLineChartData();
        this.pushPieChartData();
        this.isLoading = false;
      });
  }

  pushTaskChartData() {
    this.reOpenTask = this.tasks.filter(
      (task) => task.statusCode === StatusCode.Reopened
    ).length;
    this.openTask = this.tasks.filter(
      (task) => task.statusCode === StatusCode.Open
    ).length;
    this.inProgressTask = this.tasks.filter(
      (task) => task.statusCode === StatusCode.InProgress
    ).length;
    this.resolvedTask = this.tasks.filter(
      (task) => task.statusCode === StatusCode.Resolved
    ).length;
    this.closedTask = this.tasks.filter(
      (task) => task.statusCode === StatusCode.Closed
    ).length;
    this.taskData = [
      {
        name: 'ReOpen',
        value: this.reOpenTask,
      },
      {
        name: 'Open',
        value: this.openTask,
      },
      {
        name: 'InProgress',
        value: this.inProgressTask,
      },
      {
        name: 'Completed',
        value: this.resolvedTask,
      },
      {
        name: 'Closed',
        value: this.closedTask,
      },
    ];
  }

  pushPieChartData() {
    this.reOpenProject = this.projects.filter(
      (project) => project.statusCode === StatusCode.Reopened
    ).length;
    this.openProject = this.projects.filter(
      (project) => project.statusCode === StatusCode.Open
    ).length;
    this.inProgressProject = this.projects.filter(
      (project) => project.statusCode === StatusCode.InProgress
    ).length;
    this.resolvedProject = this.projects.filter(
      (project) => project.statusCode === StatusCode.Resolved
    ).length;
    this.closedProject = this.projects.filter(
      (project) => project.statusCode === StatusCode.Closed
    ).length;
    this.pieData = [
      {
        name: 'ReOpen',
        value: this.reOpenProject,
      },
      {
        name: 'Open',
        value: this.openProject,
      },
      {
        name: 'InProgress',
        value: this.inProgressProject,
      },
      {
        name: 'Completed',
        value: this.resolvedProject,
      },
      {
        name: 'Closed',
        value: this.closedProject,
      },
    ];
  }

  pushLineChartData() {
    const line = {
      name: 'Project',
      series: [],
    };
    this.projects.forEach((project) => {
      line.series.push({
        value: project.taskCount,
        name: project.projectName,
      });
    });
    this.data.push(line);
    this.data = [...this.data];
  }

  pipeDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-yyyy');
  }
}
