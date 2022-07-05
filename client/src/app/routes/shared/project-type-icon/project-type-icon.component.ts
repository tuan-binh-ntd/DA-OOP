import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-type-icon',
  templateUrl: './project-type-icon.component.html',
  styleUrls: ['./project-type-icon.component.css']
})
export class ProjectTypeIconComponent implements OnInit {
  @Input() projectType!: string;
 @Input() isShowLabel: boolean = false;
  constructor() {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]'
    })
  }

  ngOnInit(): void {
  }

  get selectedProjectTypeIcon() {
    return new ProjectTypeObject(this.projectType);
  }
}

export class ProjectTypeObject {
  value: string;
  icon: string;
  label: string;
  color: string;

  constructor(projectType: any) {
    this.value = projectType;
    this.label = ProjectLabel[projectType];
    this.icon = ProjectIcon[projectType];
    this.color = ProjectColors[projectType];
  }
}

export const ProjectColors = {
  ['MRP']: '#59d102',
  ['CTP']: '#ae10f9',
  ['MNP']: '#e60b09',
  ['RSP']: '#183182',
};

export const ProjectIcon = {
  ['MRP']: 'fa fa-life-bouy',
  ['CTP']: 'fa fa-road',
  ['MNP']: 'fa fa-bookmark',
  ['RSP']: 'fa fa-podcast',
};

export const ProjectLabel = {
  ['MRP']: 'Manufacturing Projects',
  ['CTP']: 'Construction Projects',
  ['MNP']: 'Management Projects',
  ['RSP']: 'Research Projects',
};