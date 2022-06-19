import { Component, OnInit, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { catchError, Observable, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { User } from 'src/app/models/user';
import { DepartmentService } from 'src/app/services/department.service';
import { PresenceService } from 'src/app/services/presence.service';
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
  isLoading: boolean = false;
  isShowModal: boolean = false;
  permission: any[] = [
    { value: Permission.ProjectManager, viewValue: 'ProjectManager' },
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' }
  ]
  constructor(
    private departmentService: DepartmentService,
    private userService: UserService,
    public presence: PresenceService
  ) { }
  users: any[] = [];
  departments: any[] = [];
  disable: boolean = false;
  user: User;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.disable = Number(JSON.parse(localStorage.getItem('user')).permissionCode) === Permission.Employee;
    this.fetchUserData();
    this.fetchDepartmentData();

  }

  fetchUserData() {
    this.isLoading = true;
    this.showLoading();
    this.userService
      .getAllUser()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.users = response;
        this.users = this.users.filter(e => Number(this.user.permissionCode) === Permission.ProjectManager || 
        ((e.permissionCode == Permission.Leader || e.permissionCode == Permission.Employee) && e.departmentId == this.user.departmentId && e.appUserId !== this.user.id));
        this.hideLoading();
        this.isLoading = false;
      });
  }

  fetchDepartmentData() {
    this.isLoading = true;
    this.showLoading();
    this.departmentService
      .getAllDepartment()
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.departments = response;
        this.hideLoading();
        this.isLoading = false;
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

  hideLoading(){
    document.getElementById('spinner').style.display = 'none';
  }

  showLoading(){
      document.getElementById('spinner').style.display = 'block';
  }
}
