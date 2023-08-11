import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { User } from '../../infraestructure/entities/user.entity';
import { UserRepository } from 'src/auth/infraestructure/repositories/user.repository';

import { IUserRepository } from '../irepositories/iuser.entity.interface';
// import { CreateUserDto, LoginUserDto } from '../../application/dto';
import { IUser } from '../ientities/iuser.entity.interface';
import { CreateUserDto } from 'src/auth/application/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/application/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) { }
// TODO: insertar los try y catch, y modificar el jwtToken para que quede en el service
  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.createUser(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    return await this.userRepository.login(loginUserDto);
  }

  // TODO: ajustar el jwtToken para que no este dentro del repository
  // debe estar en el service, usar el handleDBErrors
  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async getUser(user: IUser): Promise<User>{
    return await this.userRepository.findOneUser(user);
  }

  private getJwtToken(payload: JwtPayload) {
    const toke = this.jwtService.sign(payload);
    return toke;
  }

  async deleteAllUser(){
    return await this.deleteAllUser();
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
