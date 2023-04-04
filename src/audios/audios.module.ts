import { Module } from '@nestjs/common';
import { AudiosService } from './audios.service';
import { AudiosController } from './audios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audio } from './entities/audio.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AudiosController],
  providers: [AudiosService],
  imports: [TypeOrmModule.forFeature([Audio]), AuthModule, FilesModule, ConfigModule],
  exports: [TypeOrmModule, AudiosService]
})
export class AudiosModule {}
