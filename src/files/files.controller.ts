import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, ParseFilePipe, FileTypeValidator, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/FileNamer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('videos')
  @UseInterceptors(
    FileInterceptor('video', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/videos',
        filename: fileNamer
      }),
    })
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File
  ){

    if (!file) throw new BadRequestException('Make sure that the file is an image')

    console.log(file.filename)

    return this.filesService.uploadFileToCloud( file )
  }
}
