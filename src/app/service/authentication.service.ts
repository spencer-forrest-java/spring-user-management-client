import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private host = environment.apiUrl;
  private jwtHelper = new JwtHelperService();
  private token = '';
  private loggedInUsername = '';

  constructor(private httpClient: HttpClient) {
  }

  get loggedUsername(): string {
    return this.loggedInUsername;
  }

  public login(user: User): Observable<HttpResponse<User>> {
    return this.httpClient.post<User>(`${this.host}/user/login`, user, {observe: 'response'});
  }

  public register(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/user/register`, user);
  }

  public logout(): void {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    const userString = localStorage.getItem('user');
    const result = userString === null ? null : JSON.parse(userString);
    return result;
  }

  public loadToken(): void {
    const token = localStorage.getItem('token');
    this.token = token === null ? '' : token;
  }

  public getToken(): string {
    return this.token;
  }

  public isLoggedIn(): boolean {
    this.loadToken();

    const decodedToken = this.jwtHelper.decodeToken(this.token);
    const isTokenEmpty = this.token === '';

    if (!isTokenEmpty) {
      const isSubjectEmpty = decodedToken.sub === null;
      const isTokenExpired = this.jwtHelper.isTokenExpired(this.token);
      if (!isSubjectEmpty && !isTokenExpired) {
        this.loggedInUsername = decodedToken.sub;
        return true;
      }
    }

    this.logout();
    return false;
  }
}
