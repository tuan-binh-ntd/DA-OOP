
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission } from '../helpers/PermisionEnum';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRightGuard implements CanActivate {
    constructor(private authenticationService: AuthenticationService, private toastr: ToastrService,private router: Router) {}
    canActivate(): Observable<boolean> {
      return this.authenticationService.currentUser.pipe(
        map(user => {
          if(Number(user.permissionCode)=== Permission.Leader || Number(user.permissionCode)=== Permission.ProjectManager) {
            return true;
          }
          else {
            this.router.navigateByUrl('forbidden');
            return false;
          }
        })
      );
    }
  
  }
  