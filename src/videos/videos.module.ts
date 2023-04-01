import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [TypeOrmModule.forFeature([Video]), ConfigModule, FilesModule, AuthModule],
  exports: [TypeOrmModule, VideosService]
})
export class VideosModule {}
