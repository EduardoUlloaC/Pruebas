import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

import { SeedController } from './application/controllers/seed.controller';
import { SeedService } from './domain/service/seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ProductsModule,
    AuthModule,
  ]
})
export class SeedModule {}
