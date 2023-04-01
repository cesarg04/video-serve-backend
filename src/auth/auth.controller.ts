import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth/auth.decorator';
import { GetUser } from './decorators/get-user/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.();
  // }

  @Post('login')
  login( @Body() loginDto: LoginDto ){
    return this.authService.sinign(loginDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Get('me')
  @Auth()
  me(
    @GetUser() user: User
  ){

    delete user.password
    return {
      user
    }
  }
}
