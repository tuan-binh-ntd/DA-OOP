import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = "https://localhost:5001/api/project";
  constructor(private http: HttpClient) {
  }
  getAllProject():Observable<any>{
   return this.http.get(this.baseUrl + '/getall');
  }
  createProject(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateProject(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/update', payload);
  }
}
