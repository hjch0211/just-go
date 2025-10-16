import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { SignupRequest, LoginRequest } from './_requests';
import { AuthConverter } from './_converters';
import { AuthResponse, UserResponse } from './_responses';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(request: SignupRequest): Promise<AuthResponse> {
    const { email, password, name } = request;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate token
    const token = this.generateToken(user);

    return AuthConverter.toAuthResponse(user, token);
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const { email, password } = request;

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return AuthConverter.toAuthResponse(user, token);
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.userModel.findById(userId).select('-password');
    return AuthConverter.toUserResponse(user);
  }

  private generateToken(user: UserDocument): string {
    const payload = { id: user._id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
