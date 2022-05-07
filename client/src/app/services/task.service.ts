import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = "https://localhost:5001/api/task";
  constructor(private http: HttpClient) { }
  getAllTask():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
  }
  createTask(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateTask(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/update', payload);
  }
}
