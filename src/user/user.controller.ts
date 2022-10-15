import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: UserLoginDto) {
    return this.userService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() dto: UserRegisterDto) {
    return this.userService.register(dto);
  }
}
