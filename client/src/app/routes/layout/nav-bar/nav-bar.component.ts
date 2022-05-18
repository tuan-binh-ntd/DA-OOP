import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userName!:string;
  loggedIn:boolean = false;
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.userName = user.name;
  }
  logout() {
    this.authenticationService.logout();
  }

}
