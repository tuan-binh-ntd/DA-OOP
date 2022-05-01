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
  enterpriseCount = 0;
  userCount = 0;
  percentCount = 0;

  ngOnInit(): void {
  }
  enterpriseCountStop = setInterval(()=>{
    this.enterpriseCount ++;
    if(this.enterpriseCount  === 25){
      clearInterval(this.enterpriseCountStop)
    }
  }, 50)
  userCountStop = setInterval(()=>{
    this.userCount ++;
    if(this.userCount  === 250){
      clearInterval(this.userCountStop)
    }
  }, 1)  
  percentCountStop = setInterval(()=>{
    this.percentCount ++;
    if(this.percentCount  === 92){
      clearInterval(this.percentCountStop)
    }
  }, 20)  
  navigateToTask(){
    this.router.navigateByUrl('projects')
  }

}
