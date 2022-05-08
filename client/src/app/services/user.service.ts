import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "https://localhost:5001/api/user";

  constructor(private http: HttpClient) { }

  getAllUser():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
   }
}
