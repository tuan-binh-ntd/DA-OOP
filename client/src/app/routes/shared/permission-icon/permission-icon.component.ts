import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-permission-icon',
  templateUrl: './permission-icon.component.html',
  styleUrls: ['./permission-icon.component.css']
})
export class PermissionIconComponent implements OnInit {
  @Input() permission!: any;
  @Input() isShowLabel: boolean = false;
  constructor() {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]'
    })
  }

  ngOnInit(): void {
  }

  get selectedPermissionIcon() {
    return new PermissionObject(this.permission);
  }
}

export class PermissionObject {
  value: any;
  icon: string;
  label: string;
  color: string;

  constructor(permission: any) {
    this.value = permission;
    this.label = PermissionLabel[permission];
    this.icon = PermissionIcon[permission];
    this.color = PermissionColors[permission];
  }
}

export enum Permission {
  ProjectManager = 1,
  Leader = 2,
  Employee = 3
}

export const PermissionColors = {
  [Permission.ProjectManager]: '#e60b09',
  [Permission.Leader]: '#57A55A',
  [Permission.Employee]: '#45caff',
};

export const PermissionIcon = {
  [Permission.ProjectManager]: 'fa fa-universal-access',
  [Permission.Leader]: 'fa fa-user-secret',
  [Permission.Employee]: 'fa fa-user',
};

export const PermissionLabel = {
  [Permission.ProjectManager]: 'ProjectManager',
  [Permission.Leader]: 'Leader',
  [Permission.Employee]: 'Employee',
};
