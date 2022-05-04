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
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TasksComponent,
    LoginComponent,
    ProfileComponent,
    ChangePasswordComponent,
    NavBarComponent,
    SiteLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
