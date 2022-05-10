import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityIconComponent } from './priority-icon/priority-icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ModalProjectComponent } from './modal-project/modal-project.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StatusComponent } from './status/status.component';

@NgModule({
  declarations: [
    PriorityIconComponent,
    ModalProjectComponent,
    StatusComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,

  ],
  exports:[
    PriorityIconComponent,
    ModalProjectComponent,
    StatusComponent
  ],
  providers:[ MatDatepickerModule,
    MatNativeDateModule ]
})
export class SharedModuleModule { }
