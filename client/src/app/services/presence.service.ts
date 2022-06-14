import { ToastrService } from 'ngx-toastr';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
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

    this.hubConnection.on('UserIsOnline', () => {
      this.toastr.info(user.userName + ' has connected');
    })

    this.hubConnection.on('UserIsOffline', () => {
      this.toastr.warning(user.userName + ' has disconnected');
    })
  }
                         
   stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
   }
}
