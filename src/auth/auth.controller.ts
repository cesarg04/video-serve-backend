import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth/auth.decorator';
import { GetUser } from './decorators/get-user/get-user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFilter } from 'src/files/helpers/imagesFilter';
import { diskStorage } from 'multer';
import { fileNamer } from 'src/files/helpers/FileNamer';
import { FilesService } from 'src/files/files.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly filesService: FilesService
    
    ) { }

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.();
  // }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.sinign(loginDto)
  }

  @Auth()
  @Patch('update-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: './static/images',
        filename: fileNamer
      }),
    })
  )
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ){
    const imageUrl = await this.filesService.uploadAvatarUser(file, user);

    const avatar_url = {
      avatar_url: imageUrl
    }
    return this.authService.updateAvatar(user, avatar_url);
  } 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Get('me')
  @Auth()
  me(
    @GetUser() user: User
  ) {

    delete user.password
    return user
    
  }

  @Patch('update-password')
  @Auth()
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User
  ){
    return this.authService.updatePassword(updatePasswordDto, user)
  }

}
