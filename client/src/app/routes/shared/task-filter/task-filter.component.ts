import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { GetAllProject } from 'src/app/models/getallproject';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css']
})
export class TaskFilterComponent implements OnInit {
  projects: any[] = [];
  user: User;
  filterForm!: FormGroup;
  getAllProject: GetAllProject = new GetAllProject();
  @Output() onSubmitForm = new EventEmitter();
  @Output() filterType = new EventEmitter();
  @Output() filterStatus = new EventEmitter();
  @Output() filterPriority = new EventEmitter();
  @Output() resetFilter = new EventEmitter();
  @Output() onSearchTask = new EventEmitter();
  @Output() filterProject = new EventEmitter();

  projectId: string = '';
  priorityValue: any;
  projectName: string = 'Project';
  typeName: string = 'Type';
  priorityName: string = 'Priority';
  statusName: string = 'Status';

  taskTypes: any[] = [{ value: 'bug', viewValue: 'Bug' },
  { value: 'feature', viewValue: 'Feature' },
  { value: 'rnd', viewValue: 'RnD' }];
  statusCode: any[] = [
    { value: StatusCode.Reopened, viewValue: 'Reopened' },
    { value: StatusCode.Resolved, viewValue: 'Resolved' },
    { value: StatusCode.Open, viewValue: 'Open' },
    { value: StatusCode.InProgress, viewValue: 'InProgress' },
    { value: StatusCode.Closed, viewValue: 'Closed' },
  ];
  priorityCode: any[] = [
    { value: Priority.Urgent, viewValue: 'Urgent' },
    { value: Priority.High, viewValue: 'High' },
    { value: Priority.Medium, viewValue: 'Medium' },
    { value: Priority.Normal, viewValue: 'Normal' },
    { value: Priority.Low, viewValue: 'Low' },
  ];
  constructor(
    private projectService: ProjectService, 
    private fb: FormBuilder, 
    protected route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe
    ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    })
    this.initForm();
    this.fetchProjectData();
  }

  fetchProjectData() {
    this.projectService
    .getAllProject(this.getAllProject)
    .pipe(catchError((err) => of(err)))
    .subscribe((response) => {
      this.projects = response;
      this.projects = this.projects.filter(project => project.departmentId === this.user.departmentId || this.user.permissionCode===Permission.ProjectManager);
      if(this.projectId){
        this.projectName = this.projects.find((project) => project.id === this.projectId)?.projectName;
      }
    });
  }

  initForm() {
    this.filterForm = this.fb.group({
      statusCode: [null],
      priorityCode: [null],
      createDateFrom: [null],
      createDateTo: [null],
      deadlineDateFrom: [null],
      deadlineDateTo: [null],
      completeDateFrom: [null],
      completeDateTo: [null],
      projectId: [null],
    });
  }

  onSearch(ev:any){
    this.onSearchTask.emit(ev);
  }

  submitForm() {
    const payload = {
      createDateFrom: this.datepipe.transform(this.filterForm.value.createDateFrom, 'YYYY-MM-dd'),
      createDateTo: this.datepipe.transform(this.filterForm.value.createDateTo, 'YYYY-MM-dd'),
      deadlineDateFrom: this.datepipe.transform(this.filterForm.value.deadlineDateFrom, 'YYYY-MM-dd'),
      deadlineDateTo: this.datepipe.transform(this.filterForm.value.deadlineDateTo, 'YYYY-MM-dd'),
      completeDateFrom: this.datepipe.transform(this.filterForm.value.completeDateFrom, 'YYYY-MM-dd'),
      completeDateTo: this.datepipe.transform(this.filterForm.value.completeDateTo, 'YYYY-MM-dd'),
    }
    this.onSubmitForm.emit(payload);
  }

  onFilterProject(project: any) {
    this.projectName = project.projectName;
    this.filterProject.emit(project.id);
  }

  onFilterType(type: any) {
    this.typeName = type.viewValue;
    this.filterType.emit(type.value);
  }

  onFilterStatus(status: any) {
    this.statusName = status.viewValue;
    this.filterStatus.emit(status.value);
  }

  onFilterPriority(priority: any) {
    this.priorityName = priority.viewValue;
    this.filterPriority.emit(priority.value);
  }

  onResetFilter() {
    if(document.location.pathname.endsWith('calendar')){
      this.router.navigate(['projects/tasks/calendar']);
    }
    else if(document.location.pathname.endsWith('status')){
      this.router.navigate(['projects/tasks/status']);
    }
    else {
      this.router.navigate(['projects/tasks']);
    }
    this.projectName = 'Project';
    this.typeName = 'Type';
    this.priorityName = 'Priority';
    this.statusName = 'Status';
    this.filterForm.reset();
    this.resetFilter.emit()
  }
}
