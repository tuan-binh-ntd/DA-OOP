import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './routes/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TasksComponent } from './routes/tasks/tasks.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './routes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './routes/profile/profile.component';
import { ChangePasswordComponent } from './routes/change-password/change-password.component';
import { ToastrModule } from 'ngx-toastr';
import { NavBarComponent } from './routes/layout/nav-bar/nav-bar.component';
import { SiteLayoutComponent } from './routes/layout/site-layout/site-layout.component';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './routes/projects/projects.component';
import { SharedModuleModule } from './routes/shared/shared-module.module';
import * as bootstrap from "bootstrap";
import { UsersComponent } from './routes/users/users.component';
import { TasksCalendarComponent } from './routes/tasks/partials/tasks-calendar/tasks-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import {DragDropModule} from '@angular/cdk/drag-drop';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { ForbiddenComponent } from './routes/forbidden/forbidden.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component'; // a plugin!
import { NgChartsModule } from 'ng2-charts';
import { ContentLayoutComponent } from './routes/layout/content-layout/content-layout.component';
import { TaskStatusComponent } from './routes/tasks/partials/tasks-calendar/task-status/task-status.component';
import { MessagesComponent } from './routes/messages/messages.component';
FullCalendarModule.registerPlugins([
  bootstrapPlugin ,
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TasksComponent,
    ProjectsComponent,
    LoginComponent,
    ProfileComponent,
    ChangePasswordComponent,
    NavBarComponent,
    SiteLayoutComponent,
    UsersComponent,
    TasksCalendarComponent,
    ForbiddenComponent,
    PageNotFoundComponent,
    ContentLayoutComponent,
    TaskStatusComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    FullCalendarModule ,
    SharedModuleModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    FontAwesomeModule,
    NgChartsModule,
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
