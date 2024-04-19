export class UserCredentials {
  constructor(
    public username: string,
    public password: string,
  ) {}
}

export class AuthResponse {
  constructor(
    public authToken: string,
    public userId: string,
  ) {}
}
