import { Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';

@Module({
  providers: [TenantService],
  controllers: [TenantController],
})
export class TenantModule {}
