var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
let AuthenticationService = class AuthenticationService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.host = environment.apiUrl;
        this.jwtHelper = new JwtHelperService();
        this.token = '';
        this.loggedInUsername = '';
    }
    get loggedUsername() {
        return this.loggedInUsername;
    }
    login(user) {
        return this.httpClient.post(`${this.host}/user/login`, user, { observe: 'response' });
    }
    register(user) {
        return this.httpClient.post(`${this.host}/user/register`, user);
    }
    logout() {
        this.token = '';
        this.loggedInUsername = '';
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('users');
    }
    saveToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }
    addUserToLocalCache(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    getUserFromLocalCache() {
        const userString = localStorage.getItem('user');
        const result = userString === null ? null : JSON.parse(userString);
        return result;
    }
    loadToken() {
        const token = localStorage.getItem('token');
        this.token = token === null ? '' : token;
    }
    getToken() {
        return this.token;
    }
    isLoggedIn() {
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
};
AuthenticationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthenticationService);
export { AuthenticationService };
