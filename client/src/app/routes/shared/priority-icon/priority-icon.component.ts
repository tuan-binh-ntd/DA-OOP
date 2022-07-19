import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-priority-icon',
  templateUrl: './priority-icon.component.html',
  styleUrls: ['./priority-icon.component.css']
})
export class PriorityIconComponent implements OnInit {
  @Input() priorityCode!: number;
 @Input() isShowLabel: boolean = false;
  constructor() {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]'
  })
   }

  ngOnInit(): void {
  }
  get selectedPriorityIcon() {
    return new PriorityObject(this.priorityCode);
  }
 
}



export class PriorityObject {
  value: number;
  icon: string;
  label: string;
  color: string;

  constructor(priority: Priority) {
    this.value = priority;
    this.label = PriorityLabel[priority];
    this.icon = PriorityIcon[priority];
    this.color = PriorityColors[priority];
  }
}

export enum Priority
{
    Normal = 1,
    Low = 2,
    Medium = 3,
    High = 4,
    Urgent =5
}

export const PriorityColors = {
  [Priority.Normal]: '#2D8738',
  [Priority.Low]: '#57A55A',
  [Priority.Medium]: '#E97F33',
  [Priority.High]: '#E9494A',
  [Priority.Urgent]: '#b57bee',
};

export const PriorityIcon = {
  [Priority.Normal]: 'fa fa-angle-down',
  [Priority.Low]: 'fa fa-angle-double-down',
  [Priority.Medium]: 'fa fa-angle-up',
  [Priority.High]: 'fa fa-angle-double-up',
  [Priority.Urgent]: 'fa fa-angle-double-up',
};

export const PriorityLabel = {
  [Priority.Normal]: 'Normal',
  [Priority.Low]: 'Low',
  [Priority.Medium]: 'Medium',
  [Priority.High]: 'High',
  [Priority.Urgent]: 'Urgent',
};

