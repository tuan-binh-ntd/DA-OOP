import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-tasks-calendar',
  templateUrl: './tasks-calendar.component.html',
  styleUrls: ['./tasks-calendar.component.css']
})
export class TasksCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth'
  };

}
