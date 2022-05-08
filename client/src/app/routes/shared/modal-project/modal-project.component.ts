import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { Priority } from '../priority-icon/priority-icon.component';

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.css'],
})
export class ModalProjectComponent implements OnInit {
  @Input() departments: any[] = [];
  @Output() onChangeProject = new EventEmitter();
  mode: string = 'create';
  title: string = 'New Project';
  users: any[] = [];
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}
  modalForm!: FormGroup;
  projectTypes: any[] = [
    { value: 'MRP', viewValue: 'Manufacturing Projects' },
    { value: 'CTP', viewValue: 'Construction Projects' },
    { value: 'MNP', viewValue: 'Management Projects' },
    { value: 'RSP', viewValue: 'Research Projects' },
  ];
  priorityCode: any[] = [
    { value: Priority.Urgent, viewValue: 'Urgent' },
    { value: Priority.High, viewValue: 'High' },
    { value: Priority.Medium, viewValue: 'Medium' },
    { value: Priority.Normal, viewValue: 'Normal' },
    { value: Priority.Low, viewValue: 'Low' },
  ];

  ngOnInit(): void {
    this.fetchUserData();
    this.initForm();
  }

  fetchUserData(){
    this.userService.getAllUser().pipe(catchError((err) => of(err)))
    .subscribe((response) => {
      this.users = response;
    });
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      projectName: [null, Validators.required],
      projectType: [null, Validators.required],
      projectCode: [null, Validators.required],
      deadlineDate: [null, Validators.required],
      priorityCode: [Priority.Medium, Validators.required],
      statusCode: [StatusCode.Open],
      departmentId: [null, Validators.required],
      appUserId: [null, Validators.required],
      createDate: [null, Validators.required],
      completeDate: [null],
    });
  }

  openModal(data: any, mode: string) {
    this.mode = mode;
    this.modalForm.reset();
    if (mode === 'create') {
      this.title = 'New Project';
      this.modalForm.get('priorityCode')?.setValue(Priority.Medium);
      this.modalForm.get('statusCode')?.setValue(StatusCode.Open);
      this.modalForm.get('createDate')?.setValue(new Date())
    } else {
      this.modalForm.patchValue(data);
      this.title = data.projectName;
    }
  }
  submitForm() {
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
      if(this.mode === 'create'){
        this.projectService
          .createProject(this.modalForm.value)
          .pipe(
            catchError((err) => {
              return of(err);
            })
          )
          .subscribe((response) => {
            if (response) {
              this.toastr.success('Successfully!');
              this.onChangeProject.emit();
            } else {
              this.toastr.error('Failed');
            }
          });
      }
      else{
        this.projectService
        .updateProject(this.modalForm.value)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Successfully!');
            this.onChangeProject.emit();
          } else {
            this.toastr.error('Failed');
          }
        });
      }
    }
  }

  onChangeDepartment(){
   const department = this.departments.find(department=> department.id === this.modalForm.value.departmentId);
   const user = this.users.find(user => user.departmentId === department?.id);
   this.modalForm.get('appUserId')?.setValue(user?.id);
  }
}
