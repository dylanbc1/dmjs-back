import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { passwordDto } from '../dto/password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  create(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('forgot')
  sendMail(@Body('email') email:string){
      return this.authService.sendMail(email)
  }

  @Post('change/:id')
  changePassword(@Param('id') id:string, @Body() passwordDto:passwordDto){
    return this.authService.changePassword(id, passwordDto.password)
  }

  
}
