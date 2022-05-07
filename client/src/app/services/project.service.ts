import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = "https://localhost:5001/api/Project";
  constructor(private http: HttpClient) {
  }
  getAllProject():Observable<any>{
   return this.http.get(this.baseUrl + '/getall');
  }
}
