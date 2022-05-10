import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { DeparmentService } from 'src/app/services/deparment.service';
import { ProjectService } from '../../services/project.service';
import { ModalProjectComponent } from '../shared/modal-project/modal-project.component';
import { Priority } from '../shared/priority-icon/priority-icon.component';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  constructor(
    private projectService: ProjectService,
    private departmentService: DeparmentService,
    private router: Router
  ) {}
  @ViewChild('modalProject') modalProject!: ModalProjectComponent;
  $: any;
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
  isShowModal: boolean = false;
  ngOnInit(): void {
    this.fetchDepartmentData();
    this.fetchProjectData();
  }

  fetchDepartmentData() {
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

  getDepartmentName(id: string) {
    return this.departments.find((department) => department.id === id)
      ?.departmentName;
  }

  openDetailModal(data: any, mode: string) {
    var myModal = new bootstrap.Modal(
      document.getElementById('createProjectModal')!
    );
    myModal.show();
    this.isShowModal = true;
    this.modalProject.openModal(data, mode);
  }

  onViewTask(projectId: string): any {
    this.router.navigate(['tasks', { projectId }]);
  }

  onChangeProject() {
    var myModal = new bootstrap.Modal(
      document.getElementById('createProjectModal')!
    );
    
    // $('#createProjectModal').modal('hide')
    // $('#createProjectModal').hide;
    myModal.hide();
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
      this.isShowModal = false;
    this.fetchProjectData();
  }

  roundProgress(progress: number){
    return Math.round(progress) + '%'
  }
 
}
