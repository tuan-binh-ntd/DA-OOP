import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { GetAllProject } from 'src/app/models/getallproject';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css']
})
export class TaskFilterComponent implements OnInit {
  projects: any[] = [];
  filterForm!: FormGroup;
  getAllProject: GetAllProject = new GetAllProject();
  @Output() onSubmitForm = new EventEmitter();
  @Output() filterType = new EventEmitter();
  @Output() filterStatus = new EventEmitter();
  @Output() filterPriority = new EventEmitter();
  @Output() resetFilter = new EventEmitter();
@Output() onSearchTask = new EventEmitter();

  priorityValue: any;
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
  constructor(private projectService: ProjectService, private fb: FormBuilder, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchProjectData();
  }

  fetchProjectData() {
    this.projectService
      .getAllProject(this.getAllProject)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.projects = response;
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
    // const payload = {
    //   createDateFrom: this.datepipe.transform(this.filterForm.value.createDateFrom, 'YYYY-MM-DDThh:mm:ss')
    // }
    // console.log(payload)
    // this.onSubmitForm.emit(payload);
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
    this.typeName = 'Type';
    this.priorityName = 'Priority';
    this.statusName = 'Status';
    this.resetFilter.emit()
  }
}
