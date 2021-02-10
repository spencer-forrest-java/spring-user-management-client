import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<unknown>, handler: HttpHandler): Observable<HttpEvent<unknown>> {
    const urls = [
      '/user/login',
      '/user/register'
    ];

    // leave interceptor if one of the urls above is found
    if (this.includes(request, urls)) {
      return handler.handle(request);
    }

    this.authenticationService.loadToken();

    const tokenRequest = request.clone({
      setHeaders: {
        authorization: `Bearer ${this.authenticationService.getToken()}`
      }
    });
    return handler.handle(tokenRequest);
  }

  private includes(request: HttpRequest<unknown>, urls: string[]): boolean {
    let isIncluded = false;
    urls.forEach(element => {
      if (request.url.includes(element)) {
        isIncluded = true;
        return;
      }
    });
    return isIncluded;
  }

}
