import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosModule } from './videos/videos.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { Video } from './videos/entities/video.entity';
import { CommentsModule } from './comments/comments.module';
import { Comments } from './comments/entities/comment.entity';
import { CommonModule } from './common/common.module';
import { AudiosModule } from './audios/audios.module';
import { Audio } from './audios/entities/audio.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, //localhost
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      entities: [ User, Video, Comments, Audio ]
    }),
    VideosModule,
    FilesModule,
    AuthModule,
    CommentsModule,
    CommonModule,
    AudiosModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
