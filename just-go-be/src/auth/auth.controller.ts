import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequest, LoginRequest } from './_requests';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() request: SignupRequest) {
    return this.authService.signup(request);
  }

  @Post('login')
  async login(@Body() request: LoginRequest) {
    return this.authService.login(request);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return this.authService.getMe(req.user._id);
  }
}
