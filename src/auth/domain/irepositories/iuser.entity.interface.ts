// import { CreateUserDto, LoginUserDto } from "src/auth/application/dto";
import { IUser } from "../ientities/iuser.entity.interface";
import { User } from "src/auth/infraestructure/entities/user.entity";
// import { JwtPayload } from "../interfaces";
import { CreateUserDto } from "src/auth/application/dto/create-user.dto";
import { LoginUserDto } from "src/auth/application/dto/login-user.dto";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

export interface IUserRepository{
    createUser(createUserDto: CreateUserDto): Promise<IUser>;
    login(loginUserDto: LoginUserDto): Promise<IUser>;
    checkAuthStatus(user: User): IUser;
    getJwtToken(payload: JwtPayload): string;
    findOneUser(user: IUser): Promise<User>;
    deleteAllUser();
}