import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  constructor(private projectService: ProjectService) {}
  data: any[] = [];
  ngOnInit(): void {}

  fetchData() {
    this.projectService
      .getAllProject()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.data = response;
      });
  }
}
