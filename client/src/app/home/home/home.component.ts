import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName:string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToTask(){
    this.router.navigateByUrl('projects')
  }

}
