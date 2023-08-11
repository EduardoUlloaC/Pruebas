import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { IUserRepository } from "src/auth/domain/irepositories/iuser.entity.interface";
// import { CreateUserDto, LoginUserDto } from "src/auth/application/dto";
import { IUser } from "src/auth/domain/ientities/iuser.entity.interface";
// import { JwtPayload } from "src/auth/domain/interfaces";
import * as bcrypt from 'bcrypt';
import { BadRequestException, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/auth/application/dto/create-user.dto";
import { LoginUserDto } from "src/auth/application/dto/login-user.dto";
import { JwtPayload } from "src/auth/domain/interfaces/jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {
    private readonly logger = new Logger('UserRepository');
    private readonly jwtService = new JwtService;

    async createUser(createUserDto: CreateUserDto): Promise<IUser> {
        try {
            const { password, ...userDate } = createUserDto;
            const user = this.create({
                ...userDate,
                password: bcrypt.hashSync(password, 10)
            });
            await this.save(user);
            // delete user.password;
            return {
                ...user,
                token: this.getJwtToken({ id: user.id }),
            };
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<IUser> {
        const { password, email } = loginUserDto;
        const user = await this.findOne({
            where: { email: email.toLocaleLowerCase() },
            select: { email: true, password: true, id: true }
        });

        if (!user && !bcrypt.compareSync(password, user.password))
            throw new UnauthorizedException('Credentials are not valid');

        delete user.password;
        return {
            ...user,
            token: this.getJwtToken({ id: user.id }),
        };
    }

    checkAuthStatus(user: User): IUser {
        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };
    }

    async deleteAllUser(){
        const query = await this.createQueryBuilder();
        return await query.delete().where({}).execute();
    }

    getJwtToken(payload: JwtPayload): string {
        const toke = this.jwtService.sign(payload);
        return toke;
    }

    async findOneUser(user: IUser){
        return await this.findOneBy({id: user.id});
    }

    private handleDBErrors(error: any): never {
        if (error.code === '23505')
            throw new BadRequestException(error.detail);
        // TODO: cambiar por el loggin
        this.logger.error(error);
        throw new InternalServerErrorException('Please check server logs');
    }
}