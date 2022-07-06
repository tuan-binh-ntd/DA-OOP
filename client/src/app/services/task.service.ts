import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = environment.baseUrl + 'task';
  constructor(private http: HttpClient) { }
  getAllTask(payload?: any): Observable<any> {
    let taskType, userId, projectId, keyWord, createUserId, priorityCode, statusCode, createDateFrom, createDateTo, deadlineDateFrom, deadlineDateTo, completeDateFrom, completeDateTo
      taskType = payload.taskType ? 'taskType=' + payload.taskType : ''
      userId = payload.userId ? '&userId=' + payload.userId : ''
      projectId = payload.projectId ? '&projectId=' + payload.projectId : ''
      createUserId = payload.createUserId ? '&createUserId=' + payload.createUserId : ''
      keyWord = payload.keyWord ? '&keyWord=' + payload.keyWord : ''
      priorityCode = payload.priorityCode ? '&priorityCode=' + payload.priorityCode : ''
      statusCode = payload.statusCode ? '&statusCode=' + payload.statusCode : ''
      createDateFrom = payload.createDateFrom ? '&createDateFrom=' + payload.createDateFrom : ''
      createDateTo = payload.createDateTo ? '&createDateTo=' + payload.createDateTo : ''
      deadlineDateFrom = payload.deadlineDateFrom ? '&deadlineDateFrom=' + payload.deadlineDateFrom : ''
      deadlineDateTo = payload.deadlineDateTo ? '&deadlineDateTo=' + payload.deadlineDateTo : ''
      completeDateFrom = payload.completeDateFrom ? '&completeDateFrom=' + payload.completeDateFrom : ''
      completeDateTo = payload.completeDateTo ? '&completeDateTo=' + payload.completeDateTo : ''
      return this.http.get(this.baseUrl + '/getall?' + taskType + userId + projectId + createUserId + keyWord + priorityCode + statusCode + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + completeDateFrom + completeDateTo);
  }

  createTask(payload: any): Observable<any> {
    return this.http.post(this.baseUrl + '/create', payload);
  }
  updateTask(payload: any): Observable<any> {
    return this.http.put(this.baseUrl + '/update', payload);
  }
  deleteTask(id: any): Observable<any> {
    return this.http.delete(this.baseUrl + '/delete?id=' + id);
  }

  patchTask(payload:any): Observable<any> {
    return this.http.patch(this.baseUrl + '/update' + '/status',payload);
  }
}
