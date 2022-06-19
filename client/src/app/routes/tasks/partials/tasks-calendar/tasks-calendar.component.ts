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
  
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
  };

  fetchTaskData() {
    this.isLoading = true;
    this.showLoading();
    this.sub = this.taskService
      .getAllTask(this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
        let array = [];
        this.tasks.forEach((task) => {
          const detail = {
            id: task.id,
            title: task.taskName,
            start: task.createDate,
            end: task.deadlineDate,
          };
          array.push(detail);
        });
        this.calendarOptions = {
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          },
          initialView: 'dayGridMonth',
          eventClick: this.onDateClick.bind(this),
          events: array,
          editable: true,
          droppable: true,
          themeSystem: 'bootstrap',
          eventColor: '#00b4d8',
          height: 600,
        };
        this.hideLoading();
        this.isLoading = false;
      });
  }

  onDateClick(res: any) {
   const task = this.tasks.find(task=> task.id === res.event._def.publicId);
   this.openDetailModal(task,'detail',false);
  }
  pipeDate(date: any) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-yyyy');
  }

  hideLoading(){
    document.getElementById('spinner').style.display = 'none';
  }

  showLoading(){
      document.getElementById('spinner').style.display = 'block';
  }
  
}
