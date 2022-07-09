import { UnreadNotifies } from './../../../models/unreadnotifies';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { GetAllTask } from 'src/app/models/getalltask';
import { User } from 'src/app/models/user';
import { PresenceService } from 'src/app/services/presence.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {
  user: User;
  tasks: any[] = [];
  projectId: string;
  @Output() emitCountMessage = new EventEmitter();
  getAllTask: GetAllTask = new GetAllTask();
  unreadNotifies: UnreadNotifies = new UnreadNotifies();
  constructor(
    public presenceService: PresenceService,
    private taskService: TaskService,
    protected router: Router,
    ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchTaskData();
  }

  fetchTaskData() {
    this.taskService
      .getAllTask(this.getAllTask)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.tasks = response;
      });
  }

  onViewTask(projectId?: string, taskId?: string, id?: string, appUserId?: string):any {
    this.unreadNotifies.id = id;
    this.unreadNotifies.appUserId = appUserId;
    this.presenceService.readNotification(this.unreadNotifies).then(() => {});

    if(projectId != null) {
      this.projectId = projectId;
    } else {
      this.projectId = this.tasks.find((t) => t.id == taskId)?.projectId;
    }
    this.router.navigate(['../projects/tasks', this.projectId, 'list']);
  }

  getTaskMessageName(msg: string) {
    return msg.split('in').pop();
  }
  getContentMessage(str: string) {
    return str.substring(0, str.indexOf('in'));
  }
}
