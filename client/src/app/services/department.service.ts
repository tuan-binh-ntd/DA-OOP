import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseUrl = "https://localhost:5001/api/department";
  constructor(private http: HttpClient) { }

  getAllDepartment():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
   }
  createDepartment(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
}
