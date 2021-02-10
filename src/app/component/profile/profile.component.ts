import {HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NotificationType} from 'src/app/enum/notification-type.enum';
import {Role} from 'src/app/enum/role.enum';
import {FileUploadProgress} from 'src/app/model/file-upload.progress';
import {User} from 'src/app/model/user';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {NotificationService} from 'src/app/service/notification.service';
import {UserService} from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @Input() public loggedInUser = new User();

  public fileStatus = new FileUploadProgress();
  public profileImage: File | null = null;
  public refreshing = false;

  private cachedUser = new User();
  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService) {
  }

  get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  ngOnInit(): void {
    this.fileStatus.percentage = 100;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public onUpdateCurrentUser(): void {
    this.refreshing = true;
    this.cachedUser = this.authenticationService.getUserFromLocalCache();
    const formData = this.userService.createUserFormData(this.cachedUser.username, this.loggedInUser, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe((response: User) => {
        this.profileImage = null;
        this.refreshing = false;
        this.authenticationService.addUserToLocalCache(response);
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        // logout if role has been changed.
        if (this.cachedUser.role !== response.role) {
          this.onLogOut();
        }
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.profileImage = null;
        this.refreshing = false;
      })
    );
  }

  public onUpdateProfileImage(target: EventTarget | null): void {
    const formData = new FormData();
    const files = (target as HTMLInputElement).files;
    if (files !== null) {
      this.profileImage = files[0];
      formData.append('profileImage', this.profileImage);
    }
    formData.append('username', this.loggedInUser.username);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe((event: HttpEvent<any>) => {
        this.reportProgress(event);
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.fileStatus.status = 'done';
      })
    );
  }

  public updateProfileImage(): void {
    document.getElementById('profile-image-input')?.click();
  }

  public onLogOut(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login').then();
    this.sendNotification(NotificationType.SUCCESS, 'You logged out successfully.');
  }

  private reportProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.Sent:
        this.fileStatus.percentage = 0;
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = event.total !== undefined ? Math.round(event.loaded * 100 / event.total) : 0;
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.fileStatus.percentage = 100;
          this.fileStatus.status = 'done';
          this.loggedInUser.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}'s profile image updated successfully`);
        } else {
          this.sendNotification(NotificationType.ERROR, `Upload failed. Try again.`);
        }
        break;
      default:
        console.log('default');
    }
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Error. Please try again.');
    }
  }
}
