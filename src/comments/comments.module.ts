import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { VideosModule } from 'src/videos/videos.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [TypeOrmModule.forFeature([Comments]), ConfigModule, AuthModule, VideosModule],
  exports: [TypeOrmModule]
})
export class CommentsModule {}
