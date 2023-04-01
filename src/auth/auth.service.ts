import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { User } from './entities/USER.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
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

  async sinign(loginDto: LoginDto) {

    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        username
      },
      select: { username: true, password: true, id: true, email: true }
    })

    if (!user) throw new NotFoundException('Credentials not valid (username)');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials not valid (pssword)')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
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
}
