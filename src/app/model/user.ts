export class User {
  public userId: string;
  public username: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public role: string;
  public authorities: string[];
  public lastLoginDate: Date | null;
  public lastLoginDisplay: Date | null;
  public joinDate: Date | null;
  public active: boolean;
  public notLocked: boolean;
  private profilePictureUrl: string;

  constructor() {
    this.userId = '';
    this.username = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.role = '';
    this.authorities = [];
    this.active = false;
    this.notLocked = false;
    this.lastLoginDate = null;
    this.lastLoginDisplay = null;
    this.joinDate = null;
    this.profilePictureUrl = '';
  }

  get profileImageUrl(): string {
    return this.profilePictureUrl;
  }

  set profileImageUrl(url: string) {
    this.profilePictureUrl = url + `?time=${new Date().getTime()}`;
  }
}
