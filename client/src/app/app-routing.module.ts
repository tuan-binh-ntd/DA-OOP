import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './routes/change-password/change-password.component';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/login/login.component';
import { NavBarComponent } from './routes/layout/nav-bar/nav-bar.component';
import { ProfileComponent } from './routes/profile/profile.component';
import { ProjectsComponent } from './routes/projects/projects.component';
import { TasksComponent } from './routes/tasks/tasks.component';
import { SiteLayoutComponent } from './routes/layout/site-layout/site-layout.component';
import { UsersComponent } from './routes/users/users.component';
import { AuthGuard } from './guard/auth.guard';
import { TasksCalendarComponent } from './routes/tasks/partials/tasks-calendar/tasks-calendar.component';
import { AuthRightGuard } from './guard/authRight.guard';
import { ForbiddenComponent } from './routes/forbidden/forbidden.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'projects/tasks', component: TasksComponent },
      { path: 'projects/tasks/calendar', component: TasksCalendarComponent },
      { path: 'projects/tasks/:id', component: TasksComponent },
      { path: 'users', component: UsersComponent, canActivate: [AuthRightGuard] },
      { path: 'projects', component: ProjectsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'forbidden', component: ForbiddenComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
