import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityIconComponent } from './priority-icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    PriorityIconComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  exports:[
    PriorityIconComponent,
  ]
})
export class SharedModuleModule { }
