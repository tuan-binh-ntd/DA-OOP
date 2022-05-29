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
  getAllProject(payload: any):Observable<any>{
    let keyword,status,type, priority, permision,createDateFrom,createDateTo,deadlineDateFrom,deadlineDateTo,departmentId,userId
        keyword = payload.keyWord ? 'keyWord=' + payload.keyWord  : ''
         status = payload.statusCode ? '&statusCode=' + payload.statusCode  : ''
        type = payload.projectType ? '&projectType=' + payload.projectType  : ''
        priority = payload.priorityCode ? '&priorityCode=' + payload.priorityCode  : ''
        permision = payload.permision ? '&permision=' + payload.permision  : ''
        createDateFrom = payload.createDateFrom ? '&createDateFrom=' + payload.createDateFrom  : ''
        createDateTo = payload.createDateTo ? '&createDateTo=' + payload.createDateTo  : ''
        deadlineDateFrom = payload.deadlineDateFrom ? '&deadlineDateFrom=' + payload.deadlineDateFrom  : ''
        deadlineDateTo = payload.deadlineDateTo ? '&deadlineDateTo=' + payload.deadlineDateTo  : ''
        departmentId = payload.departmentId ? '&departmentId=' + payload.departmentId  : ''
        userId = payload.userId ? '&userId=' + payload.userId  : ''
      return this.http.get(this.baseUrl + '/getall?' + keyword + type + status + priority
      + permision + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + departmentId + userId);

  }
  createProject(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateProject(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteProject(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/delete?id=' + id);
  }
}
