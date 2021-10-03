import { Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakEntity } from 'operator/src/keycloak/models/entitiy/keycloak';
import { TenantEntity } from './models/entitiy/tenant';
import { KeycloakService } from 'operator/src/keycloak/services/keycloak.service';

@Module({
  providers: [TenantService, KeycloakService],
  controllers: [TenantController],
  imports: [TypeOrmModule.forFeature([KeycloakEntity, TenantEntity])],
})
export class TenantModule {}
