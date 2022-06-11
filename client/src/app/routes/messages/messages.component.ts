import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  mess: any = [];
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.fetchMessageData();
  }

  fetchMessageData() {
    this.messageService
    .getAllMessage()
    .pipe(catchError((err) => of(err)))
    .subscribe((response) => {
      this.mess = response;
      console.log(this.mess)
      });
  }
}
