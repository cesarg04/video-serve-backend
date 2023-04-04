import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/files/helpers/fileFilter';
import { diskStorage } from 'multer';
import { fileNamer } from 'src/files/helpers/FileNamer';
import { FilesService } from 'src/files/files.service';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { FindVideoDto } from './dto/find-vide.dto';
import { imageFilter } from 'src/files/helpers/imagesFilter';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly filesService: FilesService
  ) { }

  @Post()
  @Auth()
  @UseInterceptors(
    FileInterceptor('video', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/videos',
        filename: fileNamer
      }),
    })
  )
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User) {

    if (!file) throw new BadRequestException('The file does not exist')

    const imageUrl = await this.filesService.uploadFileToCloud(file, user)

    return this.videosService.create({
      ...createVideoDto,
      url: imageUrl,
    }, user);
  }

  @Patch('add-preview/:id')
  @Auth()
  @UseInterceptors(
    FileInterceptor('img_preview', {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: './static/images',
        filename: fileNamer
      })
    })
  )
  async addimagePreview(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {

    if (!file) throw new BadRequestException('The file does not exist')
    const imageUrl = await this.filesService.uploadImagePreview(file, user, 'videos');
    return this.videosService.addImagePreview(id, imageUrl, user)

  }


  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.videosService.remove(id, user);
  }

  @Post('find')
  findVideo(
    @Body() findVideoDto: FindVideoDto
  ) {
    return this.videosService.findVideo(findVideoDto)
  }


}
