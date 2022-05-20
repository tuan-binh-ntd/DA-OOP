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
import { ReactiveFormsModule } from '@angular/forms';
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
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/daygrid';
import { ForbiddenComponent } from './routes/forbidden/forbidden.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component'; // a plugin!
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

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
  ],
  imports: [
    BrowserModule,
    SharedModuleModule,
    FullCalendarModule ,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    FontAwesomeModule,
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
