import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NotificationType} from 'src/app/enum/notification-type.enum';
import {User} from 'src/app/model/user';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {NotificationService} from 'src/app/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public showLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/user').then();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }

  public onRegister(user: User): void {
    this.showLoading = true;

    this.subscriptions.push(
      this.authenticationService.register(user).subscribe((response: User) => {
        const message = `Your new account has been created. Please check your email to login: ${response.email} .`;
        this.sendNotification(NotificationType.SUCCESS, message);
        this.showLoading = false;
        this.router.navigateByUrl('/login').then();
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        this.showLoading = false;
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
