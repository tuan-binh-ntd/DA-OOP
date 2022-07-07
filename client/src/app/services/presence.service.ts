import { ToastrService } from 'ngx-toastr';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers = this.onlineUserSource.asObservable();
  constructor(private toastr: ToastrService) { }

  createHubConnection(user:User) {
    this.hubConnection= new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.onlineUsers.pipe(take(1)).subscribe(usernames => {
        this.onlineUserSource.next([...usernames, username])
      })
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.onlineUsers.pipe(take(1)).subscribe(usernames => {
        this.onlineUserSource.next([...usernames.filter(x => x !== username)])
      })
    })

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUserSource.next(usernames);
    })

    this.hubConnection.on('NewMessageReceived', ({username}) => {
      this.toastr.info(username + ' has sent you a new message!')
      .onTap
      .pipe(take(1)).subscribe();
    })

    this.hubConnection.on('NewTaskReceived', ({username}) => {
      this.toastr.info(username + ' has assign you a new task!').onTap.pipe(take(1)).subscribe()
    })
  }

   stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
   }

   async createTask(payload: any) {
    return this.hubConnection.invoke('CreateTask', payload)
    .catch(error => console.log(error));
  }
}
