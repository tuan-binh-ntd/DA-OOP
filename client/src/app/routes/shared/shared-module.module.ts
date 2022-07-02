import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import {MatMenuModule} from '@angular/material/menu';
import {  NgChartsModule } from 'ng2-charts';
import { TaskFilterComponent } from './task-filter/task-filter.component';
import { ButtonBusyDirective } from './utils/button-busy.directive';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { FileUploadModule } from 'ng2-file-upload';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProjectTypeIconComponent } from './project-type-icon/project-type-icon.component';
import { TaskTypeIconComponent } from './task-type-icon/task-type-icon.component';
import { DepartmentIconComponent } from './department-icon/department-icon.component';
import { AvatarModule } from 'ngx-avatar';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { PermissionIconComponent } from './permission-icon/permission-icon.component';

@NgModule({
  declarations: [
    PriorityIconComponent,
    ModalProjectComponent,
    StatusComponent,
    ModalTaskComponent,
    ModalUserComponent,
    ProjectFilterComponent,
    TaskFilterComponent,
    ProjectFilterComponent,
    ButtonBusyDirective,
    ChangePasswordComponent,
    ProjectTypeIconComponent,
    TaskTypeIconComponent,
    DepartmentIconComponent,
    ProjectTypeIconComponent,
    TaskTypeIconComponent,
    UserAvatarComponent,
    PermissionIconComponent,
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
    MdePopoverModule,
    MatMenuModule,
    NgChartsModule,
    MatTabsModule,
    MatListModule,
    FileUploadModule,
    AvatarModule

  ],
  exports:[
    PriorityIconComponent,
    ModalProjectComponent,
    StatusComponent,
    ModalTaskComponent,
    ModalUserComponent,
    ProjectFilterComponent,
    TaskFilterComponent,
    ButtonBusyDirective,
    FileUploadModule,
    ChangePasswordComponent,
    DepartmentIconComponent,
    ProjectTypeIconComponent,
    TaskTypeIconComponent,
    ProjectTypeIconComponent,
    TaskTypeIconComponent,
    PermissionIconComponent,
    UserAvatarComponent
  ],
  providers:[
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
  ]
})
export class SharedModuleModule { }
