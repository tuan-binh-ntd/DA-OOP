import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { Priority } from '../priority-icon/priority-icon.component';

@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.css']
})
export class ProjectFilterComponent implements OnInit {
  departments: any[] = [];
  filterForm!: FormGroup;
  @Output() onSubmitForm = new EventEmitter();
  @Output() filterType = new EventEmitter();
  @Output() filterStatus = new EventEmitter();
  @Output() filterPriority = new EventEmitter();
  @Output() resetFilter = new EventEmitter();


  priorityValue: any;
  typeName: string = 'Type';
  priorityName: string = 'Priority';
  statusName: string = 'Status';

  projectTypes: any[] = [
    { value: 'MRP', viewValue: 'Manufacturing Projects' },
    { value: 'CTP', viewValue: 'Construction Projects' },
    { value: 'MNP', viewValue: 'Management Projects' },
    { value: 'RSP', viewValue: 'Research Projects' },
  ];
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
  constructor(private departmentService: DepartmentService, private fb: FormBuilder, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchDepartmentData();
  }

  fetchDepartmentData() {
    this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.departments = response;
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
      departmentId: [null],
    });

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
