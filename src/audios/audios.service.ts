import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Audio } from './entities/audio.entity';
import { Repository } from 'typeorm';
import { Video } from 'src/videos/entities/video.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AudiosService {

  constructor(
    @InjectRepository(Audio)
    private readonly audiosRepository: Repository<Video>,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService
  ){}

  async create(createAudioDto: CreateAudioDto, user: User, file: Express.Multer.File) {
    const staticPathImage = this.configService.get('MUSIC_GENERIC_IMAGE');
  
    try {

      const { title } = createAudioDto;

      const audioUrl = await this.filesService.uploadAudio(file, user);

      const audio = this.audiosRepository.create({
        ...createAudioDto,
        url: audioUrl,
        user,
        image_portal: staticPathImage,
        title: title ? title : file.filename
      })

      await this.audiosRepository.save(audio)

      delete audio.user.password

      return audio;

    } catch (error) {
        console.log(error)
        this.handleErrors(error)
    }
    
  }

  findAll() {
    return this.audiosRepository.findBy({})
  }

  async findOne(id: string) {

    const audio = await this.audiosRepository.findOneBy({id})

    console.log(audio)
    
    if (!audio) throw new BadRequestException(`No audios with id: ${ id }`)

    return audio;

  }

  update(id: number, updateAudioDto: UpdateAudioDto) {
    
  }

  async remove(id: string, user: User) {

    const query = this.audiosRepository.createQueryBuilder('audios');

    const audio = await this.findOne( id )

    try {
      await query
      .delete()
      .from(Audio)
      .where("id = :id and userId = :userId",{
        id: audio.id,
        userId: user.id
      })
      .execute()

      return {
        message: 'Audio deleted'
      }
    } catch (error) {
      console.log(error)
      this.handleErrors(error)
    }
  
  }

  async findAudio (key: string){
    const audios = await this.findAll()
    const filterAudios = audios.filter(audio => audio.title.toLowerCase().includes(key.toLowerCase()))
    if ( !filterAudios ) throw new NotFoundException('Not audios with this title')
    return filterAudios

  }

  private handleErrors(errors: any): never {
    if (errors.code === '23505') {
      throw new BadRequestException(errors.detail)
    }
    throw new InternalServerErrorException(`Server internal error, please check server logs`)
  }
}
