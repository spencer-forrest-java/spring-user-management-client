import {HttpErrorResponse} from '@angular/common/http';
import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NotificationType} from 'src/app/enum/notification-type.enum';
import {Role} from 'src/app/enum/role.enum';
import {CustomHttpResponse} from 'src/app/model/custom-http-response';
import {User} from 'src/app/model/user';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {NotificationService} from 'src/app/service/notification.service';
import {UserService} from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  public loggedInUser: User = new User();
  public editUser: User = new User();
  public selectedUser: User = new User();
  public currentUsername = '';
  public users: User[] = [];
  public refreshing = false;
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private router: Router) {
  }

  get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  private static clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

  ngOnInit(): void {
    this.getUsers(true);
    this.loggedInUser = this.authenticationService.getUserFromLocalCache();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @HostListener('document:click', ['$event'])
  click(): void {
    if (!this.authenticationService.isLoggedIn()) {
      const shadeEffectElement = document.getElementsByClassName('modal-backdrop show').item(0);
      if (shadeEffectElement != null) {
        document.body.removeChild(shadeEffectElement);
      }
      this.sendNotification(NotificationType.WARNING, 'You were logged out. Please login.');
      this.router.navigateByUrl('/login').then();
    }
  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    UserComponent.clickButton('openUserInfo');
  }

  public onEditUser(selectedUser: User): void {
    this.editUser = selectedUser;
    this.currentUsername = selectedUser.username;
    UserComponent.clickButton('openUserEdit');
  }

  public onDeleteUser(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe((response: CustomHttpResponse) => {
        this.sendNotification(NotificationType.SUCCESS, `${response.message}`);
        this.getUsers(false);
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, `${errorResponse.error.message}`);
      })
    );
  }

  public searchUsers(searchInput: any): void {
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()) {
      if (user.firstName.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
        user.userId?.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchInput) {
      this.users = this.userService.getUsersFromLocalCache();
    }
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe((response: User[]) => {
        this.userService.addUsersToLocalCache(response);
        this.users = response;
        this.selectedUser = new User();
        this.refreshing = false;
        if (showNotification) {
          this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully`);
        }
      }, (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      })
    );
  }

  public refreshLoggedInUser(): void {
    this.loggedInUser = this.authenticationService.getUserFromLocalCache();
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
