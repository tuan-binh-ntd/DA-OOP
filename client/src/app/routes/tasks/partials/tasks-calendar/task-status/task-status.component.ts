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
  reOpenTask: any[] = [];
  openCount: number = 0;
  inProgressCount: number = 0;
  resolvedCount: number = 0;
  reOpendCount: number = 0;

  drop(event: CdkDragDrop<string[]>) {
    debugger
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let payload;
      if(event.container.id === 'reopen') {
         payload = {
          // @ts-ignore
         id:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Reopened
        }
      }
      else if(event.container.id === 'open') {
         payload = {
          // @ts-ignore
         id:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Open
        }
      }
      else if(event.container.id === 'inProgress') {
         payload = {
          // @ts-ignore
         id:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.InProgress
        }
      }
      else{
         payload = {
          // @ts-ignore
         id:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Resolved
        }
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.taskService.patchTask(payload).subscribe(res=>{
        if(res){
          this.toastr.success('Update status successfully!!');
          this.fetchTask();
        }else{
          this.toastr.success('Update status failed!');

        }
      })
    }
  }

  fetchTaskData() {
    this.sub = this.taskService
      .getAllTask(this.projectId, this.userId, this.createUserId, this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
        this.reOpenTask = this.tasks.filter(task=> task.statusCode === StatusCode.Reopened);
        this.reOpendCount = this.reOpenTask.length;
        this.openTasks = this.tasks.filter(task=> task.statusCode === StatusCode.Open);
        this.openCount = this.openTasks.length;
        this.inProgressTask = this.tasks.filter(task=> task.statusCode === StatusCode.InProgress);
        this.inProgressCount = this.inProgressTask.length;
        this.resolvedTask = this.tasks.filter(task=> task.statusCode === StatusCode.Resolved);
        this.resolvedCount = this.resolvedTask.length;

      });
  }
}
