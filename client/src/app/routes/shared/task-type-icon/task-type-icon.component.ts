import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-type-icon',
  templateUrl: './task-type-icon.component.html',
  styleUrls: ['./task-type-icon.component.css']
})
export class TaskTypeIconComponent implements OnInit {
  @Input() taskType!: any;
 @Input() isShowLabel: boolean = false;
  constructor() {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]'
    })
  }

  ngOnInit(): void {
  }

  get selectedTaskTypeIcon() {
    return new TaskTypeObject(this.taskType);
  }
}

export class TaskTypeObject {
  value: any;
  icon: string;
  label: string;
  color: string;

  constructor(taskType: any) {
    this.value = taskType;
    this.label = TaskLabel[taskType];
    this.icon = TaskIcon[taskType];
    this.color = TaskColors[taskType];
  }
}

export const TaskColors = {
  ['bug']: '#FF0000',
  ['feature']: '#00FF00',
  ['rnd']: '#0000FF',
};

export const TaskIcon = {
  ['bug']: 'fa fa-bug',
  ['feature']: 'fa fa-gg-circle',
  ['rnd']: 'fa fa-line-chart',
};

export const TaskLabel = {
  ['bug']: 'Bug',
  ['feature']: 'Feature',
  ['rnd']: 'Rnd',
};