import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Notification } from '../models/notification';
@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  public hubConnection: HubConnection;
  public onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers = this.onlineUserSource.asObservable();
  public notifyUserSource = new BehaviorSubject<Notification[]>([]);
  notifyUser = this.notifyUserSource.asObservable();
  public unreadNotificationNum = new BehaviorSubject<Number>(0);
  unreadNotifyNum = this.unreadNotificationNum.asObservable();
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
    })

    this.hubConnection.on('NewMessageReceived', (notify) => {
      this.notifyUser.pipe(take(1)).subscribe(notifies => {
        this.notifyUserSource.next([...notifies, notify]);
      })
    })

    this.hubConnection.on('NewTaskReceived', (notify) => {
      this.notifyUser.pipe(take(1)).subscribe(notifies => {
        this.notifyUserSource.next([...notifies, notify]);
      })
    })

    this.hubConnection.on('UnreadNotificationNumber', (count) => {
      this.unreadNotifyNum.pipe(take(1)).subscribe(() => {
        this.unreadNotificationNum.next(count);
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

  async readNotification(payload: any) {
    return this.hubConnection.invoke('ReadNotification', payload)
      .catch (error => console.log(error));
  }
}
