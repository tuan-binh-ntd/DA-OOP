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
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.isLoading = true;
      this.spinner.show();
      let payload;
      if(event.container.id === 'reopen') {
         payload = {
          // @ts-ignore
          taskId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Reopened
        }
      }
      else if(event.container.id === 'open') {
         payload = {
          // @ts-ignore
          taskId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Open
        }
      }
      else if(event.container.id === 'inProgress') {
         payload = {
          // @ts-ignore
          taskId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.InProgress
        }
      }
      else{

         payload = {
          // @ts-ignore
          taskId:  event.previousContainer.data[event.previousIndex].id,
         statusCode: StatusCode.Resolved
        }
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.showLoading();
      this.taskService
      .patchTask(payload)
      .pipe(
        catchError((err) => {
          return of(err);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.toastr.success('Successfully!');
          this.hideLoading();
          this.isLoading = false;
          setTimeout(()=>{
            this.toastr.clear()
          },700)
        } else {
          this.toastr.error('Failed');
          this.hideLoading();
          this.isLoading = false;
        }
      });
      // this.spinner.hide();
    }
  }

  fetchTaskData() {
    this.isLoading = true;
    this.showLoading();
    this.sub = this.taskService
      .getAllTask(this.getAllTask)
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
        this.hideLoading();
        this.isLoading = false;
      });
  }

  getUserAvatar(id:string){
   const task = this.tasks.find(task=> task.id === id);
   const leader = this.users.find(user => user.appUserId === task.appUserId)
   const assignee = this.users.find(user => user.appUserId === task.createUserId)
   let users= []
   if(leader?.appUserId === assignee?.appUserId){
    users.push(leader)
   }else{
    users=[leader,assignee]
   }
   return users;
  }
  hideLoading(){
    document.getElementById('spinner')
    .style.display = 'none';
  }

  showLoading(){
      document.getElementById('spinner')
              .style.display = 'block';
  }
}
