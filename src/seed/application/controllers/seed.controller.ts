import { Controller, Get} from '@nestjs/common';

import { SeedService } from 'src/seed/domain/service/seed.service';
// import { ValidRoles } from 'src/auth/domain/interfaces';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }}
