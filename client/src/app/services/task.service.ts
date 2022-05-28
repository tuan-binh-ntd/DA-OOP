import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = "https://localhost:5001/api/task";
  constructor(private http: HttpClient) { }
  getAllTask(projectId?: string, userId?: string, payload?: any): Observable<any> {
    let userIdString = '';
    let projectIdString = '';
    if (userId || projectId) {
      if (userId) {
        userIdString = 'userId=' + userId;
      }
      if (projectId) {
        projectIdString = 'projectId=' + projectId;
      }
      let taskType, createUserId, keyWord, priorityCode, statusCode, createDateFrom, createDateTo, deadlineDateFrom, deadlineDateTo, completeDateFrom, completeDateTo
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
        return this.http.get(this.baseUrl + '/getall?' + userIdString + '&' + projectIdString + taskType+ createUserId + keyWord + priorityCode + statusCode + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + completeDateFrom + completeDateTo);
    }
    else {
      let taskType, createUserId, keyWord, priorityCode, statusCode, createDateFrom, createDateTo, deadlineDateFrom, deadlineDateTo, completeDateFrom, completeDateTo
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
}
