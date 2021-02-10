import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {NotificationType} from 'src/app/enum/notification-type.enum';
import {CustomHttpResponse} from 'src/app/model/custom-http-response';
import {NotificationService} from 'src/app/service/notification.service';
import {UserService} from 'src/app/service/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public refreshing = false;

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const email: string = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(email).subscribe((response: CustomHttpResponse) => {
        this.sendNotification(NotificationType.SUCCESS, response.message);
        this.refreshing = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.DEFAULT, errorResponse.error.message);
        this.refreshing = false;
      }, () => {
        emailForm.reset();
      })
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Error. Please try again.');
    }
  }
}
