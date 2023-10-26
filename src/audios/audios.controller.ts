import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { AudiosService } from './audios.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user/get-user.decorator';
import { User } from 'src/auth/entities';
import { FileInterceptor } from '@nestjs/platform-express';
import { audiosFilter, fileNamer } from 'src/files/helpers';
import { diskStorage } from 'multer';

@Controller('audios')
export class AudiosController {
  constructor(
    private readonly audiosService: AudiosService,
    
    ) {}

  @Post()
  @Auth()
  @UseInterceptors(
    FileInterceptor('audio', {
      fileFilter: audiosFilter,
      storage: diskStorage({
        destination: './static/audios',
        filename: fileNamer
      }),
    })
  )
  create(
    @Body() createAudioDto: CreateAudioDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {

    console.log('file mp3');
    if (!file) throw new BadRequestException('File not found please insert the file')

    return this.audiosService.create( createAudioDto, user, file );
  }

  @Get()
  findAll() {
    return this.audiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.audiosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAudioDto: UpdateAudioDto) {
    return this.audiosService.update(+id, updateAudioDto);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
    ) {
    return this.audiosService.remove(id, user);
  }

  @Post('find')
  @Auth()
  findAudio(
    @Body() key: string
  ){
    return this.audiosService.findAudio(key)
  }


}
