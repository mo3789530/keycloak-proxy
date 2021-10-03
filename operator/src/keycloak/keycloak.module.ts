import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakController } from './controllers/keycloak.controller';
import { KeycloakEntity } from './models/entitiy/keycloak';
import { KeycloakService } from './services/keycloak.service';

@Module({
  providers: [KeycloakService],
  controllers: [KeycloakController],
  imports: [TypeOrmModule.forFeature([KeycloakEntity])],
  exports: [KeycloakService],
})
export class KeycloakModule {}
