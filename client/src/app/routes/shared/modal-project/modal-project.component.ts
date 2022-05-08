import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { ProjectService } from 'src/app/services/project.service';
import { Priority } from '../priority-icon/priority-icon.component';

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.css']
})
export class ModalProjectComponent implements OnInit {
  mode:string = 'create';
  title: string = 'New Project'
  constructor(private fb: FormBuilder, private projectService: ProjectService,
    private toastr: ToastrService
    ) { }
  @Input() departments: any[]  = []
  modalForm!:FormGroup
  projectTypes:any[]  = [
    {value: 'MRP', viewValue: 'Manufacturing Projects'},
    {value: 'CTP', viewValue: 'Construction Projects'},
    {value: 'MNP', viewValue: 'Management Projects'},
    {value: 'RSP', viewValue: 'Research Projects'},
  ];
  priorityCode: any[] = [
    {value: Priority.Urgent, viewValue: 'Urgent'},
    {value: Priority.High, viewValue: 'High'},
    {value: Priority.Medium, viewValue: 'Medium'},
    {value: Priority.Normal, viewValue: 'Normal'},
    {value: Priority.Low, viewValue: 'Low'},
  ]

  ngOnInit(): void {
    this.initForm();
  }
 
  initForm(){
    this.modalForm = this.fb.group({
      projectName: [null, Validators.required],
      description: [null],
      projectType: [null, Validators.required],
      projectCode: [null, Validators.required],
      deadlineDate: [null, Validators.required],
      priorityCode: [Priority.Medium,Validators.required],
      statusCode: [StatusCode.Open],
      departmentId: [null, Validators.required],
    })
  }

  openModal(data:any,mode: string){
    this.mode = mode;
    this.modalForm.reset();
    if(mode==='create'){
      this.title = 'New Project';
      this.modalForm.get('priorityCode')?.setValue(Priority.Medium);
      this.modalForm.get('statusCode')?.setValue(StatusCode.Open);
    }else{
      this.modalForm.patchValue(data);
      this.title = data.projectName;
    }
  }
    submitForm(){
      for (const i in this.modalForm.controls) {
        this.modalForm.controls[i].markAsDirty();
        this.modalForm.controls[i].updateValueAndValidity();
      }
      if(this.modalForm.valid){
        this.projectService.createProject(this.modalForm.value).pipe(  catchError((err) => {
          return of(err);
        })).subscribe(response =>{
          if(response){
            this.toastr.success('Successfully!');
            var myModal = new bootstrap.Modal(document.getElementById('createProjectModal')!)
            myModal.hide();
          }
          else{
            this.toastr.error('Failed');
          }
        })
      }
    }

  

}


