import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoInput } from '../models/photo-input';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + "user";

  constructor(private http: HttpClient, ) { }

  getAllUser(projectId?:string, departmentId?:string):Observable<any>{
    if(projectId){
      return this.http.get(this.baseUrl + '/getall?' + 'projectId=' + projectId );
    }else{
      return this.http.get(this.baseUrl + '/getall');
    }
  }

  getUser(model: any):Observable<any>{
    const id = 'id=' + model;
    return this.http.get(this.baseUrl + '/get?' + id);
  }

  updateUser(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/update',payload);
  }

  changePassword(payload:any):Observable<any>{
    return this.http.put(this.baseUrl + '/changepassword',payload);
  }

  setMainPhoto(model: PhotoInput) {
    return this.http.put(this.baseUrl + '/set-main-photo/' + model.photoId, model);
  }

  deletePhoto(model: PhotoInput) {
    return this.http.post(this.baseUrl + '/delete-photo/' + model.photoId, model);
  }

  deleteUser(payload: any):Observable<any>{
    if(payload.newLeaderId){
      return this.http.delete(this.baseUrl + '/delete?deleteUserId=' + payload.deleteUserId + '&deletedUserId=' + payload.deletedUserId + '&deleteUserPermission=' + payload.deleteUserPermission + '&deletedUserPermission=' + payload.deletedUserPermission + '&newLeaderId=' + payload.newLeaderId);
    }
    else{
      return this.http.delete(this.baseUrl + '/delete?deleteUserId=' + payload.deleteUserId + '&deletedUserId=' + payload.deletedUserId + '&deleteUserPermission=' + payload.deleteUserPermission + '&deletedUserPermission=' + payload.deletedUserPermission);
    }
  }

}
