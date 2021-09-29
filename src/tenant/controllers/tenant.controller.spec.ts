import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from '../../keycloak/services/keycloak.service';
import { TenantService } from '../services/tenant.service';
import { TenantController } from './tenant.controller';

class KeycloakMock {}
class TenantMock {}

describe('TenantController', () => {
  let controller: TenantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],

      providers: [
        {
          provide: KeycloakService,
          useClass: KeycloakMock,
        },
        {
          provide: TenantService,
          useClass: TenantMock,
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
