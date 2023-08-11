import { Injectable } from '@nestjs/common';

import { initialData } from '../../infraestructure/data/seed-data';
import { ProductsService } from 'src/products/domain/service/products.service';

import { IUser } from 'src/auth/domain/ientities/iuser.entity.interface';
import { AuthService } from 'src/auth/domain/service/auth.service';

@Injectable()
export class SeedService {
  
  constructor(
    private readonly productsService: ProductsService,
    private readonly userService: AuthService,
  ){}

  async runSeed(){
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    // const admin = await this.userService.getUser(adminUser);
    await this.insertNewProducts(adminUser);
    return 'SEED EXECUTED';
  }
  
  private async deleteTables(){
    await this.productsService.deleteAll();
    await this.userService.deleteAllUser();
  }
  
  private async insertUsers(){
    const seedUsers = initialData.users;
    const users: IUser[] = [];
    seedUsers.forEach(async user =>{
      users.push( await this.userService.create(user))
    });
    await Promise.all(users);
    return users[0];
  }

  private async insertNewProducts(user: IUser){
    // await this.productsService.deleteAll();
    const products = initialData.products;
    const insertPromises = [];
    
    products.forEach( product => {
      insertPromises.push(this.productsService.create(product, user));
    })
    
    await Promise.all(insertPromises);
    return true;
  }
}
