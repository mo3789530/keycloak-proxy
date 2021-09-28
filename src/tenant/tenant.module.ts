import { Module } from '@nestjs/common';
import { TenantServcieService } from './tenant-servcie/tenant-servcie.service';
import { TenantService } from './tenant/tenant.service';
import { TenantController } from './tenant/tenant.controller';

@Module({
  providers: [TenantServcieService, TenantService],
  controllers: [TenantController]
})
export class TenantModule {}
