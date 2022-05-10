import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = "https://localhost:5001/api/user";
  constructor(private http: HttpClient) { }
  login(payload: any):Observable<any>{
    return this.http.post(this.baseUrl + '/login', payload);
  }
  register(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/register', payload);
  }
}
