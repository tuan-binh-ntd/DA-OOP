import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { DeparmentService } from 'src/app/services/deparment.service';
import { ProjectService } from '../../services/project.service';
import { Priority } from '../shared/priority-icon/priority-icon.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  constructor(private fb: FormBuilder,private projectService: ProjectService, private departmentService: DeparmentService) {}
  modalForm!:FormGroup
  data: any[] = [];
  departments: any[] = [];
  allRecord: number = 0;
  resolvedRecord: number = 0;
  inProgressRecord: number = 0;
  closedRecord: number = 0;
  isAllRecord: boolean = true;
  isResolvedRecord: boolean = false;
  isInProgressRecord: boolean = false;
  isClosedRecord: boolean = false;
  ngOnInit(): void {
    this.fetchDepartmentData();
    this.fetchProjectData();
    this.initForm();
  }

  initForm(){
    this.modalForm = this.fb.group({
      projectName: [null, Validators.required],
      description: [null],
      projectType: [null, Validators.required],
      projectCode: [null, Validators.required],
      deadlineDate: [null, Validators.required],
      priorityCode: [Priority.Medium],
      statusCode: [StatusCode.Open],
      departmentId: [null, Validators.required],
    })
  }

  fetchDepartmentData(){
    this.departmentService
    .getAllDepartment()
    .pipe(catchError((err) => of(err)))
    .subscribe((response) => {
      this.departments = response;
    });
  }

  fetchProjectData() {
    this.projectService
      .getAllProject()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.data = response;
        this.allRecord = this.data.length;
      });
  }

  getDepartmentName(id: string){
   return this.departments.find(department => department.id === id)?.departmentName
  }

  getTimeLeft(createDate: any, deadlineDate: any){
      return this.datediff(this.parseDate(deadlineDate), this.parseDate(new Date().toLocaleDateString()))
  }

   parseDate = (str:any) => {
    const [month, day, year] = str.split('/');
    return new Date(year, month - 1, day);
  }
  
   datediff = (first:any, second:any) => {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }


  
 
}
