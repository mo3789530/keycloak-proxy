import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from '../services/keycloak.service';
import { KeycloakController } from './keycloak.controller';

class KeycloakMock {}

describe('KeycloakController', () => {
  let controller: KeycloakController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeycloakController],
      providers: [
        {
          provide: KeycloakService,
          useClass: KeycloakMock,
        },
      ],
    }).compile();

    controller = module.get<KeycloakController>(KeycloakController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
