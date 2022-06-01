import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';
import { TasksComponent } from '../../../tasks.component';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.css']
})
export class TaskStatusComponent extends TasksComponent implements OnInit {
  openTasks: any[] = [];
  inProgressTask: any[] = [];
  resolvedTask: any[] = [];
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  fetchTaskData() {
    debugger
    this.sub = this.taskService
      .getAllTask(this.projectId, this.userId, this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
        this.openTasks = this.tasks.filter(task=> task.statusCode === StatusCode.Open);
        this.inProgressTask = this.tasks.filter(task=> task.statusCode === StatusCode.InProgress);
        this.resolvedTask = this.tasks.filter(task=> task.statusCode === StatusCode.Resolved);

      });
  }
}
