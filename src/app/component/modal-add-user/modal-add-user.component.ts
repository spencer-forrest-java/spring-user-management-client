import {HttpErrorResponse} from '@angular/common/http';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NotificationType} from 'src/app/enum/notification-type.enum';
import {Role} from 'src/app/enum/role.enum';
import {User} from 'src/app/model/user';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {NotificationService} from 'src/app/service/notification.service';
import {UserService} from 'src/app/service/user.service';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.css']
})
export class ModalAddUserComponent implements OnInit, OnDestroy {

  public profileImage: File | null = null;
  public fileName: string | null = null;
  @Output() private added = new EventEmitter<any>();
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService) {
  }

  get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData(null, userForm.value, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe((response: User) => {
        userForm.reset();
        this.added.next();
        this.profileImage = null;
        this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} added successfully`);
        document.getElementById('new-user-close')?.click();
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      })
    );
  }

  public onClose(userForm: NgForm, fileInput: HTMLInputElement): void {
    userForm.resetForm();
    this.resetFileInput(fileInput);
  }

  public onProfileImageChange(target: EventTarget | null): void {
    const files = (target as HTMLInputElement).files;
    if (files !== null) {
      this.profileImage = files[0];
      this.fileName = this.profileImage.name;
    }
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
