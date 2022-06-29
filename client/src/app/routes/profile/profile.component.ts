import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { catchError, of } from 'rxjs';
import { Permission } from 'src/app/helpers/PermisionEnum';
import { Photo } from 'src/app/models/photo';
import { PhotoInput } from 'src/app/models/photo-input';
import { User } from 'src/app/models/user';
import { AppUser } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  user: User;
  departments: any[] = [];
  currentUser: AppUser = new AppUser();
  mainPhoto: Photo[];
  uploader: FileUploader;
  photoInput: PhotoInput = new PhotoInput();
  hasBaseDropZoneOver: false;
  baseUrl = "https://localhost:5001/api";

  permission: any[] = [
    { value: Permission.ProjectManager, viewValue: 'ProjectManager' },
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' },
  ];
  constructor(
    private userService: UserService,
    private departmentService: DepartmentService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchUserData();
    this.fetchDepartmentData();
    this.initializeUploader();
  }

  fetchUserData() {
    this.isLoading = true;
    this.showLoading();
    this.userService
      .getUser(this.user.id)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.currentUser = response;
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
    return this.departments.find((department) => department.id === id)
      ?.departmentName;
  }

  getPermission(permission: Permission) {
    return this.permission.find(
      (permissionCode) => permissionCode.value == permission
    )?.viewValue;
  }

  hideLoading() {
    document.getElementById('spinner').style.display = 'none';
  }

  showLoading() {
    document.getElementById('spinner').style.display = 'block';
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }


  setMainPhoto(photo: Photo) {
    this.photoInput.id = this.user.id;
    this.photoInput.photoId = photo.id;
    this.userService.setMainPhoto(this.photoInput).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.authenticationService.setCurrentUser(this.user);
      this.user.photoUrl = photo.url;
      this.currentUser.photos.map(p => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      })
    })
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/user/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo: Photo = JSON.parse(response);
      this.currentUser.photos.push(photo);
      if (photo.isMain) {
        this.user.photoUrl = photo.url;
        this.user.photoUrl = photo.url;
        this.authenticationService.setCurrentUser(this.user);
      }
    }
  }

  deletePhoto(photo: Photo) {
    this.photoInput.id = this.user.id;
    this.photoInput.photoId = photo.id;
    this.userService.deletePhoto(this.photoInput).subscribe(() => {
      this.currentUser.photos = this.currentUser.photos.filter(x => x.id != this.photoInput.photoId);
    })
  }


}
