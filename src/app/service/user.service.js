var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
let UserService = class UserService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.host = environment.apiUrl;
    }
    getUsers() {
        return this.httpClient.get(`${this.host}/user/list`);
    }
    addUser(formData) {
        return this.httpClient.post(`${this.host}/user/add`, formData);
    }
    updateUser(formData) {
        return this.httpClient.put(`${this.host}/user/update`, formData);
    }
    updateProfileImage(formData) {
        return this.httpClient.put(`${this.host}/user/update/profile-image`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }
    deleteUser(userId) {
        return this.httpClient.delete(`${this.host}/user/delete/${userId}`);
    }
    addUsersToLocalCache(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    getUsersFromLocalCache() {
        if (localStorage.getItem('users')) {
            return JSON.parse(String(localStorage.getItem('users')));
        }
        return [];
    }
    resetPassword(email) {
        return this.httpClient.get(`${this.host}/user/reset-password/${email}`);
    }
    createUserFormData(loggedInUsername, user, profileImage) {
        const formData = new FormData();
        if (loggedInUsername !== null) {
            formData.append('currentUsername', loggedInUsername);
        }
        if (profileImage !== null) {
            formData.append('profileImage', profileImage);
        }
        formData.append('username', user.username);
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);
        formData.append('role', user.role);
        formData.append('active', JSON.stringify(user.active));
        formData.append('notLocked', JSON.stringify(user.notLocked));
        return formData;
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserService);
export { UserService };
