import { Component, OnInit, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { ModalUserComponent } from '../shared/modal-user/modal-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('modalUser') modalUser!: ModalUserComponent;
  $: any;
  isShowModal: boolean = false;
  permission: any[] = [
    { value: Permission.ProjectManager, viewValue: 'ProjectManager' },
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' }
  ]
  constructor(private departmentService: DepartmentService,
    private userService: UserService,
  ) { }
  users: any[] = [];
  departments: any[] = [];
  disable: boolean = false;
  ngOnInit(): void {
    this.disable = Number(JSON.parse(localStorage.getItem('user')).permissionCode) === Permission.Employee;
    console.log(this.disable);
    this.fetchUserData();
    this.fetchDepartmentData();
  }

  fetchUserData() {
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
      });
  }

  fetchDepartmentData() {
    this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.departments = response;
      });
  }
  getDepartmentName(id: string) {
    return this.departments.find(department => department.id === id)?.departmentName
  }

  getPermission(permission: string){
    return this.permission.find((permissionCode) => permissionCode.value == permission)?.viewValue;
  }

  openDetailModal(data: any, mode: string, isEdit: boolean) {
    var myModal = new bootstrap.Modal(
      document.getElementById('createUserModal')!
    );
    myModal.show();
    this.isShowModal = true;
    this.modalUser.openModal(data, mode, isEdit);
  }

  onChangeUser() {
    var myModal = new bootstrap.Modal(
      document.getElementById('createUserModal')!
    );

    // $('#createProjectModal').modal('hide')
    // $('#createProjectModal').hide;
    myModal.hide();
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
    this.isShowModal = false;
    this.fetchUserData();
  }
}
