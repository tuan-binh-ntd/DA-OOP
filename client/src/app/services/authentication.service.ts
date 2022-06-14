import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = "https://localhost:5001/api/user";
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }

  login(payload: any):Observable<any>{
    return this.http.post(this.baseUrl + '/login', payload).pipe(
      map((response: User) => {
        const user = response;
        if(user) {
          //localStorage.setItem('user', JSON.stringify(user));
          //this.currentUserSource.next(user);
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }
  register(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/register', payload);
  }
}
