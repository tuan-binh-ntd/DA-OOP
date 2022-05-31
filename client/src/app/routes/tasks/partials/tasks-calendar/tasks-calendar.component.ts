import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/daygrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timegridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/angular';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { TasksComponent } from '../../tasks.component';

@Component({
  selector: 'app-tasks-calendar',
  templateUrl: './tasks-calendar.component.html',
  styleUrls: ['./tasks-calendar.component.css'],
})
export class TasksCalendarComponent extends TasksComponent implements OnInit {
  @ViewChild('fullcalendar') fullcalendar: ElementRef;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
  };
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['projectId'];
    });
    const user = JSON.parse(localStorage.getItem('user'));
    this.user = JSON.parse(localStorage.getItem('user'));
    if (
      user.permissionCode === Permission.ProjectManager ||
      user.permissionCode === Permission.Leader
    ) {
      this.right = true;
    }
    this.userId = this.user.id;
    this.fetchTaskData();
    this.fetchUserData();
    this.fetchProjectData();
  }

  fetchTaskData() {
    this.sub = this.taskService
      .getAllTask(this.projectId, this.userId, this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
        let array = [];
        this.tasks.forEach((task) => {
          const detail = {
            title: task.taskName,
            start: task.createDate,
            end: task.deadlineDate,
          };
          array.push(detail);
        });
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          eventClick: this.onDateClick.bind(this),
          events: array,
          editable: true,
          droppable: true,
          themeSystem: 'bootstrap',
          eventColor: '#00b4d8',
          height: 630,
        };
      });
  }

  onDateClick(res: any) {
    alert('Clicked on date : ' + res);
  }
  pipeDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-yyyy');
  }
  eventClick(model) {
    console.log(model);
  }
  eventDragStop(model) {
    console.log(model);
  }
  clickButton(model) {
    console.log(model);
  }
  dateClick(model) {
    console.log(model);
  }
  handleClickDate() {}
  handleEventClick() {
    console.log(123);
  }
  handleDropEvent() {}
}
