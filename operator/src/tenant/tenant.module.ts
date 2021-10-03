import { Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './models/entitiy/tenant';
import { KeycloakService } from '..//keycloak/services/keycloak.service';
import { KeycloakEntity } from '../keycloak/models/entitiy/keycloak';

@Module({
  providers: [TenantService, KeycloakService],
  controllers: [TenantController],
  imports: [TypeOrmModule.forFeature([KeycloakEntity, TenantEntity])],
})
export class TenantModule {}
