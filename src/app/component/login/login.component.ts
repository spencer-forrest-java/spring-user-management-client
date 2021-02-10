import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {HeaderType} from 'src/app/enum/header-type.enum';
import {NotificationType} from 'src/app/enum/notification-type.enum';
import {User} from 'src/app/model/user';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {NotificationService} from 'src/app/service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public showLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {

    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/user');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }

  public onLogin(user: User): void {

    this.showLoading = true;

    this.subscriptions.push(
      this.authenticationService.login(user).subscribe((response: HttpResponse<User>) => {
        const token: any = response.headers.get(HeaderType.JWT_TOKEN);
        const loginUser = response.body;
        console.log(loginUser);
        if (token !== null && loginUser !== null) {
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(loginUser);
          this.router.navigateByUrl('/user').then();
          this.showLoading = false;
        }
      }, (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
        this.showLoading = false;
      })
    );
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Error. Please try again.');
    }
  }
}
