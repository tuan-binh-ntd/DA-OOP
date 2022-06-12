import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = "https://localhost:5001/api/message";
  constructor(private http: HttpClient) { }

  getAllMessage():Observable<any>{
    return this.http.get(this.baseUrl + '/get');
   }
  createDepartment(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
}
