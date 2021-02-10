import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {NotificationType} from '../enum/notification-type.enum';
import {AuthenticationService} from '../service/authentication.service';
import {NotificationService} from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    let result: boolean;
    if (this.authenticationService.isLoggedIn()) {
      result = true;
    } else {
      result = false;
      this.router.navigate(['/login']).then();
      this.notificationService.notify(NotificationType.ERROR, 'You need to log in to access this page');
    }
    return result;
  }
}
