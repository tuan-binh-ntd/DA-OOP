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
import { ModalTaskComponent } from './modal-task/modal-task.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { ProjectFilterComponent } from './project-filter/project-filter.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MdePopoverModule } from '@material-extended/mde';
@NgModule({
  declarations: [
    PriorityIconComponent,
    ModalProjectComponent,
    StatusComponent,
    ModalTaskComponent,
    ModalUserComponent,
    ProjectFilterComponent
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
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MdePopoverModule
  ],
  exports:[
    PriorityIconComponent,
    ModalProjectComponent,
    StatusComponent,
    ModalTaskComponent,
    ModalUserComponent,
    ProjectFilterComponent
  ],
  providers:[ MatDatepickerModule,
    MatNativeDateModule ]
})
export class SharedModuleModule { }
