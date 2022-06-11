import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  loading(){
    this.loadingCount++;
    this.spinnerService.show();

  }

  idle(){
      this.spinnerService.hide();
  }
}
