import { Component, Input, OnInit } from '@angular/core';
import { StatusCode } from 'src/app/helpers/StatusCodeEnum';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
 @Input() statusCode!: number
  constructor() { }

  ngOnInit(): void {
  }
  
  public get code(): typeof StatusCode {
    return StatusCode; 
  }

}



