import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = environment.baseUrl + 'project';
  constructor(private http: HttpClient) {
  }
  getAllProject(payload?: any):Observable<any>{
    if(payload){
      let keyword,status,type, priority, permision,createDateFrom,createDateTo,deadlineDateFrom,deadlineDateTo,completeDateFrom,completeDateTo,departmentId,userId
          keyword = payload.keyWord ? 'keyWord=' + payload.keyWord  : ''
           status = payload.statusCode ? '&statusCode=' + payload.statusCode  : ''
          type = payload.projectType ? '&projectType=' + payload.projectType  : ''
          priority = payload.priorityCode ? '&priorityCode=' + payload.priorityCode  : ''
          permision = payload.permision ? '&permision=' + payload.permision  : ''
          createDateFrom = payload.createDateFrom ? '&createDateFrom=' + payload.createDateFrom  : ''
          createDateTo = payload.createDateTo ? '&createDateTo=' + payload.createDateTo  : ''
          deadlineDateFrom = payload.deadlineDateFrom ? '&deadlineDateFrom=' + payload.deadlineDateFrom  : ''
          deadlineDateTo = payload.deadlineDateTo ? '&deadlineDateTo=' + payload.deadlineDateTo  : ''
          completeDateFrom = payload.completeDateFrom ? '&completeDateFrom=' + payload.completeDateFrom  : ''
          completeDateTo = payload.completeDateTo ? '&completeDateTo=' + payload.completeDateTo  : ''
          departmentId = payload.departmentId ? '&departmentId=' + payload.departmentId  : ''
          userId = payload.userId ? '&userId=' + payload.userId  : ''
        return this.http.get(this.baseUrl + '/getall?' + keyword + type + status + priority
        + permision + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + completeDateFrom + completeDateTo + departmentId + userId);
    }else{
      return this.http.get(this.baseUrl + '/getall' );
    }

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
  patchProject(payload:any): Observable<any> {
    return this.http.patch(this.baseUrl + '/update' + '/status',payload);
  }
}
