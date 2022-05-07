import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor(private taskService: TaskService) { }
  data: any[] = [];

  ngOnInit(): void {
    this.fetchTaskData();
  }

  fetchTaskData() {
    this.taskService
      .getAllTask()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.data = response;
      });
  }
}
