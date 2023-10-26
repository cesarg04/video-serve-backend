import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload, UploadavatarUser } from './interfaces';
import { LoginDto } from './dto/login-user.dto';
import { FilesService } from 'src/files/files.service';
import { UpdatePasswordDto } from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly filesService: FilesService
  ) { }

  async create(createAuthDto: CreateAuthDto) {

    try {

      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)
      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      console.log(error)
      this.handleErrors(error)
    }

  }

  async findOne( id: string ){
      const user =  await this.userRepository.findOneBy({id})
      if (!user) throw new NotFoundException(`User with id: ${ id } is empty...`)
      return user 
  }

  async sinign(loginDto: LoginDto) {

    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        username
      },
      // select: { username: true, password: true, id: true, email: true, isActive: true, avatar_url: true }
    })

    if (!user) throw new NotFoundException('Credentials not valid (username)');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials not valid (pssword)')
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }
  async updateAvatar( user: User, url: UploadavatarUser) {
    
    const query = this.userRepository.createQueryBuilder();
    try {
      await query
      .update(User)
      .set({
        avatar_url: url.avatar_url
      })
      .where("id = :id", { id: user.id })
      .execute()

      return {
        message: 'Avatar updated successfully'
      };
    } catch (error) {
        console.log(error)
        this.handleErrors(error)
    }

  }

  async updatePassword( updatePasswordDto: UpdatePasswordDto, user: User ){

    if ( !bcrypt.compareSync(updatePasswordDto.old_password, user.password) ) 
      throw new UnauthorizedException('Old password incorrect')

    const newPass = bcrypt.hashSync( updatePasswordDto.new_password, 10 );
    const query = this.userRepository.createQueryBuilder()

    try {

      await query
      .update(User)
      .set({ password: newPass })
      .where("id = :id", { id: user.id })
      .execute()
      
      return {
        message: 'Password updated successuly'
      }
    } catch (error) {
        console.log(error)
        this.handleErrors(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;

  }
  private handleErrors(errors: any): never {
    if (errors.code === '23505') {
      throw new BadRequestException(errors.detail)
    }
    throw new InternalServerErrorException(`Server internal error, please check server logs`)
  }

  async validateGoogleUser (id: string):Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        googleId: id
      }
    })
    return user
  }
}
