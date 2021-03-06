import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/login/login.component';
import { ProjectsComponent } from './routes/projects/projects.component';
import { TasksComponent } from './routes/tasks/tasks.component';
import { SiteLayoutComponent } from './routes/layout/site-layout/site-layout.component';
import { UsersComponent } from './routes/users/users.component';
import { AuthGuard } from './guard/auth.guard';
import { TasksCalendarComponent } from './routes/tasks/partials/tasks-calendar/tasks-calendar.component';
import { AuthRightGuard } from './guard/authRight.guard';
import { ForbiddenComponent } from './routes/forbidden/forbidden.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { ContentLayoutComponent } from './routes/layout/content-layout/content-layout.component';
import { TaskStatusComponent } from './routes/tasks/partials/tasks-calendar/task-status/task-status.component';
import { ProfileComponent } from './routes/profile/profile.component';
import { ProjectListComponent } from './routes/projects/project-list/project-list.component';
import { HomeV2Component } from './routes/home-v2/home-v2.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: SiteLayoutComponent,
    children: [
    ],
  },
  
  {
    path: '', component: ContentLayoutComponent,
    children: [
      { path: 'home', component: HomeV2Component, canActivate: [AuthGuard] },
      { path: 'projects/tasks/list', component: TasksComponent },
      { path: 'projects/tasks/status', component: TaskStatusComponent },
      { path: 'projects/tasks/calendar', component: TasksCalendarComponent },
      { path: 'projects/tasks/:id/status', component: TaskStatusComponent },
      { path: 'projects/tasks/:id/calendar', component: TasksCalendarComponent },
      { path: 'projects/tasks/:id/list', component: TasksComponent },
      { path: 'users', component: UsersComponent, canActivate: [AuthRightGuard] },
      { path: 'projects/list', component: ProjectListComponent },
      { path: 'projects/status', component: ProjectsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'forbidden', component: ForbiddenComponent },
      {
        path: '**', pathMatch: 'full',
        component: PageNotFoundComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
