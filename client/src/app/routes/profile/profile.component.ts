import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, finalize } from 'rxjs';
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
  profileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  index: number = 0;
  isEdit: boolean = false;
  baseUrl = 'https://localhost:5001/api';

  permission: any[] = [
    { value: Permission.ProjectManager, viewValue: 'ProjectManager' },
    { value: Permission.Leader, viewValue: 'Leader' },
    { value: Permission.Employee, viewValue: 'Employee' },
  ];
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fetchUserData();
    this.fetchDepartmentData();
    this.initializeUploader();
    this.initForm();
    this.checkEditForm();
  }

  initForm() {
    this.profileForm = this.fb.group({
      id: [Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      password: [null, Validators.required],
      departmentId: [null],
      permissionCode: [null, Validators.required],
      permissionCreator: [null],
    });
    this.changePasswordForm = this.fb.group({
      id: [Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      newPassword: [null, Validators.required],
      passwordConfirm: [null, Validators.required],
    });
  }

  fetchUserData() {
    this.isLoading = true;
    this.showLoading();
    this.userService
      .getUser(this.user.id)
      .pipe(catchError((err) => of(err)))
      .subscribe((response) => {
        this.currentUser = response;
        this.profileForm.get('id')?.setValue(this.currentUser.id);
        this.profileForm.get('firstName')?.setValue(this.currentUser.firstName);
        this.profileForm.get('lastName')?.setValue(this.currentUser.lastName);
        this.profileForm.get('email')?.setValue(this.currentUser.email);
        this.profileForm.get('permissionCode')?.setValue(this.currentUser.permissionCode);
        this.profileForm.get('departmentId')?.setValue(this.currentUser.departmentId);
        this.profileForm.get('phone')?.setValue(this.currentUser.phone);
        this.profileForm.get('address')?.setValue(this.currentUser.address);
        this.profileForm.get('password')?.setValue(this.currentUser.password);
        this.profileForm.get('permissionCreator')?.setValue(this.currentUser.permissionCode);
        this.changePasswordForm.get('id')?.setValue(this.currentUser.id);
        this.changePasswordForm.get('email')?.setValue(this.currentUser.email);
        this.changePasswordForm.controls['email'].disable();
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
    return this.departments.find((department) => department.id === id)?.departmentName;
  }

  getPermission(permission: Permission) {
    return this.permission.find((permissionCode) => permissionCode.value == permission)?.viewValue;
  }

  hideLoading() {
    document.getElementById('spinner').style.display = 'none';
  }

  showLoading() {
    document.getElementById('spinner').style.display = 'block';
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
    this.uploader.uploadAll();
  }

  setMainPhoto(photo: Photo) {
    this.photoInput.id = this.user.id;
    this.photoInput.photoId = photo.id;
    this.userService.setMainPhoto(this.photoInput).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.authenticationService.setCurrentUser(this.user);
      this.user.photoUrl = photo.url;
      this.currentUser.photos.map((p) => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      });
    });
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/user/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo: Photo = JSON.parse(response);
      this.currentUser.photos.push(photo);
      if (photo.isMain) {
        this.user.photoUrl = photo.url;
        this.user.photoUrl = photo.url;
        this.authenticationService.setCurrentUser(this.user);
      }
    };
  }

  deletePhoto(photo: Photo) {
    this.photoInput.id = this.user.id;
    this.photoInput.photoId = photo.id;
    this.userService.deletePhoto(this.photoInput).subscribe(() => {
      this.currentUser.photos = this.currentUser.photos.filter(
        (x) => x.id != this.photoInput.photoId
      );
    });
  }

  checkEditForm() {
    if (this.isEdit) {
      this.profileForm.enable();
      this.profileForm.controls['departmentId'].disable();
      this.profileForm.controls['permissionCode'].disable();
    } else {
      this.profileForm.disable();
    }
  }

  onChangeEdit(ev: any) {
    this.isEdit = ev;
    this.checkEditForm();
  }

  onSubmit() {
    this.isLoading = true;
    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }
    if (this.profileForm.valid) {
      this.profileForm.get('departmentId')?.setValue(this.currentUser.departmentId);
      this.profileForm.get('permissionCode')?.setValue(this.currentUser.permissionCode);
      this.userService
        .updateUser(this.profileForm.value)
        .pipe(
          catchError((err) => {
            return of(err);
          }),
          finalize(() => (this.isLoading = false))
        )
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Successfully!');
            this.isEdit = false;
            this.checkEditForm();
            this.fetchUserData();
          } else {
            this.toastr.error(
              'You must had permission or department had leader'
            );
          }
        });
    } else {
      this.toastr.warning('Invalid data');
      this.isLoading = false;
    }
  }

  checkPassword() {
    if (
      this.changePasswordForm.value.passwordConfirm == this.changePasswordForm.value.newPassword 
      && this.changePasswordForm.value.password == this.currentUser.password
    ) {
      this.changePassword();
    } else if (
      this.changePasswordForm.value.passwordConfirm !== this.changePasswordForm.value.newPassword
    ) {
      this.toastr.warning('PasswordConfirm is incorrected');
    } else {
      this.toastr.warning('Password is incorrected');
    }
  }

  changePassword() {
    this.isLoading = true;
    for (const i in this.changePasswordForm.controls) {
      this.changePasswordForm.controls[i].markAsDirty();
      this.changePasswordForm.controls[i].updateValueAndValidity();
    }
    this.changePasswordForm.value.password =
      this.changePasswordForm.value.passwordConfirm;
    if (this.changePasswordForm.valid) {
      this.userService
        .changePassword(this.changePasswordForm.value)
        .pipe(
          catchError((err) => {
            return of(err);
          }),
          finalize(() => (this.isLoading = false))
        )
        .subscribe((response) => {
          if (response) {
            this.toastr.success('Successfully!');
          } else {
            this.toastr.error('Failed');
          }
        });
    } else {
      this.toastr.warning('Invalid data');
      this.isLoading = false;
    }
  }
}
