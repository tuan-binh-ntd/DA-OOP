import { Component, Input, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department-icon',
  templateUrl: './department-icon.component.html',
  styleUrls: ['./department-icon.component.css']
})
export class DepartmentIconComponent implements OnInit {
  @Input() departmentName:string = ''
  constructor() { }
  ngOnInit(): void {
  }



}
