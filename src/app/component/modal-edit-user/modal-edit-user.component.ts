import {HttpErrorResponse} from '@angular/common/http';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotificationType} from 'src/app/enum/notification-type.enum';
import {Role} from 'src/app/enum/role.enum';
import {User} from 'src/app/model/user';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {NotificationService} from 'src/app/service/notification.service';
import {UserService} from 'src/app/service/user.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-modal-edit-user',
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.css']
})
export class ModalEditUserComponent implements OnInit, OnDestroy {

  @Input() public editUser = new User();
  @Input() public loggedInUser = new User();
  @Input() public currentUsername = '';
  public fileName: string | null = null;
  public profileImage: File | null = null;
  @Output() private userUpdated = new EventEmitter<any>();
  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private userService: UserService) {
  }

  get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  private static clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(element => element.unsubscribe());
  }

  public onUpdateUser(fileInput: HTMLInputElement): void {
    const formData = this.userService.createUserFormData(this.currentUsername, this.editUser, this.profileImage);
    const isCurrentUser = this.loggedInUser.username === this.currentUsername;
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe((response: User) => {
        ModalEditUserComponent.clickButton('closeEditUserModalButton');
        if (isCurrentUser) {
          this.loggedInUser = response;
        }
        this.resetFileInput(fileInput);
        this.fileName = null;
        this.profileImage = null;
        this.userUpdated.next();
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      })
    );
  }

  public onProfileImageChange(target: EventTarget | null): void {
    const files = (target as HTMLInputElement).files;
    if (files !== null) {
      this.profileImage = files[0];
      this.fileName = this.profileImage.name;
    }
  }

  public onClose(fileInput: HTMLInputElement): void {
    this.resetFileInput(fileInput);
  }

  private resetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.profileImage = null;
    this.fileName = null;
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
