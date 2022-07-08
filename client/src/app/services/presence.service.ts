import { ToastrService } from 'ngx-toastr';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers = this.onlineUserSource.asObservable();
  private notifyUserSource = new BehaviorSubject<Notification[]>([]);
  notifyUser = this.notifyUserSource.asObservable();
  constructor() { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence?userId=' + user.id, {
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

    this.hubConnection.on('Notification', notifies => {
      this.notifyUserSource.next(notifies);
      console.log(notifies);
    })

    this.hubConnection.on('NewMessageReceived', (notify) => {
      this.notifyUser.pipe(take(1)).subscribe(notifies => {
        this.notifyUserSource.next([...notifies, notify]);
        console.log(notifies);
      })
    })

    this.hubConnection.on('NewTaskReceived', (notify) => {
      this.notifyUser.pipe(take(1)).subscribe(notifies => {
        this.notifyUserSource.next([...notifies, notify]);
        console.log(notifies);
      })
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
