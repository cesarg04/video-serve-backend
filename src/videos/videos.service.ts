import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/auth/entities/USER.entity';


@Injectable()
export class VideosService {

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly filesService: FilesService,
  ){}

  async create(createVideoDto: CreateVideoDto, user: User) {
    try {

      const video = this.videoRepository.create({
        ...createVideoDto,
        user
      })

      await this.videoRepository.save( video )
      delete video.user.password
      return {
        video
      }
      
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error 500')      
    }
  }

  findAll() {
    return this.videoRepository.find({})
  }

  async findOne(id: string) {
    
      const video = await this.videoRepository.findOneBy({id})

      if (!video) throw new NotFoundException(`Video with id: ${ id } does not exist`)

      return video
  }

  update(id: string, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  async remove(id: string) {
    
    // const video = await this.findOne( id );
    // await this.videoRepository.delete(video)

    // return {
    //   ok: true,
    //   message: 'Video deletes successfully'
    // }
  }
}
