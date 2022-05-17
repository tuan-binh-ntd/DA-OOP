import { User } from './models/user';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  users: User;
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
    ) { }
  ngOnInit(): void {
    this.getUser();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.authenticationService.setCurrentUser(user);
  }

  getUser() {
    this.userService.getAllUser().pipe(catchError((err) => of(err))).subscribe( res =>
      this.users = res
    )
  }
}
