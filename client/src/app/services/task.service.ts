import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = "https://localhost:5001/api/task";
  constructor(private http: HttpClient) { }
  getAllTask(projectId?: string, userId?: string, createUserId?: string, payload?: any): Observable<any> {
    let taskType, keyWord, priorityCode, statusCode, createDateFrom, createDateTo, deadlineDateFrom, deadlineDateTo, completeDateFrom, completeDateTo
      taskType = payload.taskType ? 'taskType=' + payload.taskType : ''
      keyWord = payload.keyWord ? '&keyWord=' + payload.keyWord : ''
      priorityCode = payload.priorityCode ? '&priorityCode=' + payload.priorityCode : ''
      statusCode = payload.statusCode ? '&statusCode=' + payload.statusCode : ''
      createDateFrom = payload.createDateFrom ? '&createDateFrom=' + payload.createDateFrom : ''
      createDateTo = payload.createDateTo ? '&createDateTo=' + payload.createDateTo : ''
      deadlineDateFrom = payload.deadlineDateFrom ? '&deadlineDateFrom=' + payload.deadlineDateFrom : ''
      deadlineDateTo = payload.deadlineDateTo ? '&deadlineDateTo=' + payload.deadlineDateTo : ''
      completeDateFrom = payload.completeDateFrom ? '&completeDateFrom=' + payload.completeDateFrom : ''
      completeDateTo = payload.completeDateTo ? '&completeDateTo=' + payload.completeDateTo : ''
    if (projectId && userId && createUserId) {
      let getUserId = this.http.get(this.baseUrl + '/getall?' + taskType + '&userId=' + userId + '&projectId' + projectId + keyWord + priorityCode + statusCode + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + completeDateFrom + completeDateTo);
      let getCreateUserId = this.http.get(this.baseUrl + '/getall?' + taskType + '&projectId=' + projectId + '&createUserId' + createUserId + keyWord + priorityCode + statusCode + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + completeDateFrom + completeDateTo);
      return getUserId && getCreateUserId;
    }
    else if (userId) {
      return this.http.get(this.baseUrl + '/getall?' + taskType +'&userId=' + userId + keyWord + priorityCode + statusCode + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + completeDateFrom + completeDateTo);
    }
    else {
      return this.http.get(this.baseUrl + '/getall?' + taskType + '&createUserId=' + createUserId  + keyWord + priorityCode + statusCode + createDateFrom + createDateTo + deadlineDateFrom + deadlineDateTo + completeDateFrom + completeDateTo);
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
