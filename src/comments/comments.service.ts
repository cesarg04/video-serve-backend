import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VideosService } from 'src/videos/videos.service';
import { Comments } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger('commetsService')


  constructor(
    private readonly videoService: VideosService,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>
  ){}

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  async findOne(id: string) {
    
    const comment = await this.commentsRepository.findOneBy({id})
    if (!comment) throw new NotFoundException(`Comment with id: ${ id } not found`)
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User) {
    
    const comment = await this.findOne( id );

    try {

      if (comment.user.id !== user.id) throw new UnauthorizedException('You do not have permission to delete this comment')

      const update = await this.commentsRepository.save({
        ...comment,
        ...updateCommentDto
      })

      return {
        update
      }

    } catch (error) {
      this.handleDBExceptions(error)
    }
    
  }

  async remove(id: string, user: User) {
    const comment = await this.findOne( id );
    const query = this.commentsRepository.createQueryBuilder('comments')

    try {
      return await query
      .delete()
      .where({ 
        id: comment.id,
        user
       })
       .execute()
    } catch (error) {
      
    }

  }

  async addComment( videoId: string, user: User, commentDto: CreateCommentDto ){

    const video = await this.videoService.findOne( videoId )

    if (!video) throw new NotFoundException('Error, video not found')

    const comment = this.commentsRepository.create({
      ...commentDto,
      video,
      user
    })
    await this.commentsRepository.save( comment )
    delete comment.user.password;

    return{
      message: 'Video created successfuly',
      comment
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logas')
  }
}
