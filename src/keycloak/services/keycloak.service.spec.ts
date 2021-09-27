import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createConnection,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { CreateKeycloakDto } from '../models/dto/keycloak.dto';
import { KeycloakEntity } from '../models/entitiy/keycloak';
import { KeycloakService } from './keycloak.service';

describe('KeycloakService', () => {
  let service: KeycloakService;
  let repository: Repository<KeycloakEntity>;
  const testConnectionName = 'testConnection_1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakService,
        {
          provide: getRepositoryToken(KeycloakEntity),
          useClass: Repository,
        },
      ],
    }).compile();
    const connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [KeycloakEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });
    repository = getRepository(KeycloakEntity, testConnectionName);
    service = new KeycloakService(repository);
  });

  afterEach(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create keycloak', () => {
    it('should be create', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      const result = await service.createKeycloak(params);
      expect(result.url).toBe(params.url);
      expect(result.isWriteable).toBe(true);
    });
    it('shoud be fail by already exit', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      // create befroe test

      await service.createKeycloak(params);
      try {
        await service.createKeycloak(params);
      } catch (ex) {
        expect(ex.status).toBe(400);
        return;
      }
      fail();
    });
  });
});
