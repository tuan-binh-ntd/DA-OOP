import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  baseUrl = environment.baseUrl + 'department';
  constructor(private http: HttpClient) { }

  getAllDepartment():Observable<any>{
    return this.http.get(this.baseUrl + '/getall');
   }
  createDepartment(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
}
