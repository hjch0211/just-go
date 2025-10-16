import { UserDocument } from '../schemas/user.schema';
import { AuthResponse, UserResponse } from './_responses';

export class AuthConverter {
  static toUserResponse(user: UserDocument): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }

  static toAuthResponse(user: UserDocument, token: string): AuthResponse {
    return {
      user: this.toUserResponse(user),
      token,
    };
  }
}
