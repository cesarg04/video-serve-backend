import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { NestCloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [NestCloudinaryModule, ConfigModule],
  exports: [FilesService]
})
export class FilesModule {}
