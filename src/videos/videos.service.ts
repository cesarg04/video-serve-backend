import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/auth/entities/user.entity';
import { FindVideoDto } from './dto/find-vide.dto';


@Injectable()
export class VideosService {

  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly filesService: FilesService,
  ) { }

  async create(createVideoDto: CreateVideoDto, user: User) {
    try {

      const video = this.videoRepository.create({
        ...createVideoDto,
        user
      })

      await this.videoRepository.save(video)
      delete video.user.password
      return {
        video
      }

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error 500')
    }
  }

  async findAll() {
    const video = await this.videoRepository.find({})

    return video
  } 

  async findOne(id: string) {
    const video = await this.videoRepository.findOneBy({ id })
    if (!video) throw new NotFoundException(`Video with id: ${id} does not exist`)
    return video
    
  }

  update(id: string, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  async remove(id: string, user: User) {

    const video = await this.findOne(id);

    const query = this.videoRepository.createQueryBuilder('videos')

    try {
      await query
        .delete()
        .where({
          id: video.id,
          user
        })
        .execute()

      return {
        ok: true,
        message: 'Video deletes successfully'
      }

    } catch (error) {
      throw new InternalServerErrorException('Error to erasing the vide, please try again.')
    }
  }

  async findVideo(findVideoDto: FindVideoDto) {
    const { key } = findVideoDto
    const videos = await this.findAll()

    const filterVideos = videos.filter(video => video.title.toLowerCase().includes(key.toLowerCase()))

    if (filterVideos.length <= 0) throw new NotFoundException(`No videos found with title: ${key}`)

    return filterVideos
  }

  async addImagePreview(id: string, imageURL: string, user: User) {

    const query = this.videoRepository.createQueryBuilder()

    try {
      
      query
      .update(Video)
      .set({ image_portal: imageURL })
      .where("id = :id", { id })
      .execute()

      return {
        message: 'Image preview added successfully'
      }

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(`Error, please try again`)
    }


  }
}
