import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './component/login/login.component';
import { UserComponent } from './component/user/user.component';
import { RegisterComponent } from './component/register/register.component';
import { FormsModule } from '@angular/forms';
import { NotificationModule } from './notification/notification.module';
import { SettingsComponent } from './component/settings/settings.component';
import { ProfileComponent } from './component/profile/profile.component';
import { ModalUserInfoComponent } from './component/modal-user-info/modal-user-info.component';
import { ModalAddUserComponent } from './component/modal-add-user/modal-add-user.component';
import { ModalEditUserComponent } from './component/modal-edit-user/modal-edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    SettingsComponent,
    ProfileComponent,
    ModalUserInfoComponent,
    ModalAddUserComponent,
    ModalEditUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NotificationModule,
    AppRoutingModule
  ],
  providers: [
    AuthenticationService,
    NotificationService,
    UserService,
    AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: AuthenticationInterceptor }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
