export class UserResponse {
  id: string;
  email: string;
  name: string;
}

export class AuthResponse {
  user: UserResponse;
  token: string;
}
