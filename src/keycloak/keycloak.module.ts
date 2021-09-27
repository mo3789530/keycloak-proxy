import { Module } from '@nestjs/common';
import { KeycloakController } from './controllers/keycloak.controller';
import { KeycloakService } from './services/keycloak.service';

@Module({
  providers: [KeycloakService],
  controllers: [KeycloakController],
})
export class KeycloakModule {}
