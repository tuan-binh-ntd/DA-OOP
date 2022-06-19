import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = "https://localhost:5001/api/message";
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUserName: string, taskId: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUserName + '&taskId=' + taskId, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error => console.log(error));

      this.hubConnection.on('ReceiveMessageThread', messages => {
        this.messageThreadSource.next(messages);
      });

      this.hubConnection.on('NewMessage', message => {
        this.messageThread.pipe(take(1)).subscribe(messages => {
          this.messageThreadSource.next([...messages, message])
        })
      })
  }

  stopHubConnection() {
    if(this.hubConnection) {
      this.hubConnection.stop();
    }
    this.hubConnection.stop();
  }

  getMessageThread(taskId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + taskId);
  }

  async sendMessage(payload: any) {
    return this.hubConnection.invoke('SendMessage', payload)
    .catch(error => console.log(error));
  }

  createDepartment(payload:any):Observable<any>{
    return this.http.post(this.baseUrl + '/create', payload);
  }
}
