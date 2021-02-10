import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../model/user';
import {CustomHttpResponse} from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/user/list`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.httpClient.put<User>(`${this.host}/user/update`, formData);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.httpClient.put<User>(`${this.host}/user/update/profile-image`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(String(localStorage.getItem('users')));
    }
    return [];
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.httpClient.get<CustomHttpResponse>(`${this.host}/user/reset-password/${email}`);
  }

  public createUserFormData(loggedInUsername: string | null, user: User, profileImage: File | null): FormData {
    const formData = new FormData();
    if (loggedInUsername !== null) { formData.append('currentUsername', loggedInUsername); }
    if (profileImage !== null) { formData.append('profileImage', profileImage); }
    formData.append('newUsername', user.username);
    formData.append('newFirstName', user.firstName);
    formData.append('newLastName', user.lastName);
    formData.append('newEmail', user.email);
    formData.append('newRole', user.role);
    formData.append('active', JSON.stringify(user.active));
    formData.append('notLocked', JSON.stringify(user.notLocked));
    return formData;
  }
}
