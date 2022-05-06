import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { DeparmentService } from 'src/app/services/deparment.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  constructor(private projectService: ProjectService, private departmentService: DeparmentService) {}
  createForm!:FormGroup
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
