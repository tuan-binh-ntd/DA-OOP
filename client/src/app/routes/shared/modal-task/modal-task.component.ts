import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Priority } from 'src/app/helpers/PriorityEnum';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { DeparmentService } from 'src/app/services/deparment.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.css']
})
export class ModalTaskComponent implements OnInit {
  @Input() projects: any[] = [];
  @Output() onChangeTask = new EventEmitter();
  mode: string = 'create';
  title: string = 'New Task';
  users: any[] = [];
  departments: any[] = [];
  modalForm!: FormGroup;
  taskTypes: any[] = [
    { value: 'Test', viewValue: 'Test' },
  ];
  priorityCode: any[] = [
    { value: Priority.Urgent, viewValue: 'Urgent' },
    { value: Priority.High, viewValue: 'High' },
    { value: Priority.Medium, viewValue: 'Medium' },
    { value: Priority.Normal, viewValue: 'Normal' },
    { value: Priority.Low, viewValue: 'Low' },
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private deparmentService: DeparmentService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchDepartmentData();
    this.initForm();
  }

  fetchUserData(){
    this.userService.getAllUser().pipe(catchError((err) => of(err)))
    .subscribe((response) => {
      this.users = response;
    });
  }

  fetchDepartmentData(){
    this.deparmentService.getAllDepartment().pipe(catchError((err) => of(err)))
    .subscribe((response) => {
      this.departments = response;
    });
  }

  initForm() {
    this.modalForm = this.fb.group({
      id: [null],
      taskName: [null, Validators.required],
      taskType: [null, Validators.required],
      createUserId: [null, Validators.required],
      createDate: [null, Validators.required],
      deadlineDate: [null, Validators.required],
      priorityCode: [Priority.Medium, Validators.required],
      statusCode: [StatusCode.Open],
      projectId: [null, Validators.required],
      appUserId: [null, Validators.required],
      description: [null],
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
    this.title = data.taskName;
  }
  }

  submitForm() {
    for (const i in this.modalForm.controls) {
      this.modalForm.controls[i].markAsDirty();
      this.modalForm.controls[i].updateValueAndValidity();
    }
    if (this.modalForm.valid) {
      if(this.mode === 'create'){
      this.taskService
        .createTask(this.modalForm.value)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Successfully!');
            this.onChangeTask.emit();
          } else {
            this.toastr.error('Failed');
          }
        });
      }
      else{
        this.taskService
        .updateTask(this.modalForm.value)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Successfully!');
            this.onChangeTask.emit();
          } else {
            this.toastr.error('Failed');
          }
        });
      }
    }
  }

  onChangeProject(){
    const project = this.projects.find(project=> project.id === this.modalForm.value.projectId);
    const department = this.departments.find(department=> department.id === project?.departmentId);
    const user = this.users.find(user => user.departmentId === department?.id);
    this.modalForm.get('createUserId')?.setValue(user?.id);
   }
}
