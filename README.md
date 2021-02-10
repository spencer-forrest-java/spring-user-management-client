# User Management Client

Web Client to perform CRUD operations on users and reset passwords.<br>
(Back-End - <a href="https://github.com/spencer-forrest-java/spring-user-management-api">User Management API</a>)
<br><br>
For any questions contact me at 
[Spencer Forrest](mailto:spencer.forrest.java@gmail.com?subject=[GitHub]%20User%20Management%20Client).

## Technologies used

1. Angular 11
2. Angular CLI 11
3. Boostrap 4.5

## Description

This application allows logged user with enough credentials to perform CRUD operations on a user. The user will receive
a new automatically generated password by email upon registration or by having their password reset by an admin or a super
admin.<br>

## Screenshots

### Large Screens

Login Screen

![Login Screen](images/login.png)

Wrong password / username notification

![Notification wrong password](images/login-error.png)

Account locked notification after 6 failed attempts

![Notification account locked](images/login-locked.png)

Registration form

![Registration form](images/registration.png)

Admin and Super Admin page - list of users

![Administration list users](images/admin-list.png)

User page - list of users

![User list users](images/user-list.png)

Users loaded notification after clicking on the refresh button

![Users loaded notification](images/loaded-users.png)

User adding form after clicking on the add button

![Adding New User](images/new-user.png)

User information appears after clicking on his/her row

![User information](images/info.png)

User editing form after clicking on his/her edit button

![User editing form](images/edit.png)

Admin and Super Admin: reset password

![Administration reset password](images/password.png)

Admin and Super Admin: reset password - Email not found notification

![Administration reset password error](images/password-error.png)

Special Admin profile is not allowed to be modified

![Special Administration Profile](images/profile.png)

Super Admin profile page

![Super Admin profile](images/super-profile.png)

Admin profile page

![Admin profile](images/admin-profile.png)

Manager profile page

![Manager profile](images/manager-profile.png)

User profile page

![User profile](images/user-profile.png)

### Small Screens (Phone size)

![Login Screen](images/responsive/login-sm.png) ![Notification wrong password](images/responsive/login-error-sm.png) ![Notification account locked](images/responsive/login-locked-sm.png)

![Registration form](images/responsive/registration-sm.png) ![Administration list users](images/responsive/admin-list-sm.png) ![User list users](images/responsive/user-list-sm.png)

![Users loaded notification](images/responsive/loaded-users-sm.png) ![Adding New User](images/responsive/new-user-sm.png) ![User information](images/responsive/info-sm.png)

![User editing form](images/responsive/edit-sm.png) ![Administration reset password](images/responsive/password-sm.png) ![Administration reset password error](images/responsive/password-error-sm.png)

![Special Administration Profile](images/responsive/profile-sm.png) ![Special Administration Profile](images/responsive/profile-2-sm.png) ![Super Admin profile](images/responsive/super-profile-sm.png)

![Super Admin profile](images/responsive/super-profile-2-sm.png) ![Admin profile](images/responsive/admin-profile-sm.png) ![Admin profile](images/responsive/admin-profile-2-sm.png)

![Manager profile](images/responsive/manager-profile-sm.png) ![Manager profile](images/responsive/manager-profile-2-sm.png) ![User profile](images/responsive/user-profile-sm.png)

![User profile](images/responsive/user-profile-2-sm.png)

## Roles and Authorities

There are 4 authorities (permissions):

* Create a user
* Read a user information
* Update a user
* Delete a user

A user is assigned a role. There are 4 roles in total:

* Super Admin can:
  * Add new users
  * Read users information
  * Update user's information
  * Delete a user
  * Reset a user's password
* Admin can:
  * Add new users
  * Read users information
  * Update user's information
  * Reset a user's password
* Manager can:
  * Read users information
  * Update user's information except:
    * His/her role
* User can:
  * Read users information
  * Update his/her own information except:
    * Active status
    * Locked status
    * His/her role

## More Business Logic

* There is a special super admin with the username "admin".
  <br>
  This user cannot be deleted or updated except for his profile picture.
  <br><br>
* If a user tries to log in with a correct username but fails 6 times in a row,
  <br>
  the account will be locked. Only a manager, admin or super admin can unlock this account.
  <br><br>
* Passwords are automatically generated and sent by email to users 
  upon registration or upon resetting it. 
  <br><br>
* There is a search functionality. It helps to look for a user by first name, last name, username or email.
  <br><br>
* Unauthorized actions will result in an error being sent by
  <a href="https://github.com/spencer-forrest-java/spring-user-management-api">the backend</a>:
  * For instance, the delete button is intentionally shown for users with the role "admin" even though they do not have
    the "Delete" authority.
  * If an "admin" tries to delete a user, an error message will appear stating that this user does not have enough
    permission to perform this action.
    <br><br>
    ![Delete error](images/delete-error.png)
