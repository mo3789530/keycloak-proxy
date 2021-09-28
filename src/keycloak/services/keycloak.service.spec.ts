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

  describe('Find keycloak', () => {
    it('should be find all', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      await service.createKeycloak(params);
      const params2: CreateKeycloakDto = { url: 'http://example2.com' };
      await service.createKeycloak(params2);

      const all = await service.findAll();
      expect(all.length).toEqual(2);
    });
    it('should be none array', async () => {
      const all = await service.findAll();
      expect(all.length).toEqual(0);
    });
    it('should be find by url', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      const save = await service.createKeycloak(params);

      const keycloak = await service.findByUrl(params.url);
      expect(params.url).toEqual(keycloak.url);
      expect(keycloak.uuid).toBe(save.uuid);
    });

    it('should be not find by url', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      await service.createKeycloak(params);

      const keycloak = await service.findByUrl('http://aaaa.example.com');
      expect(keycloak).toBeUndefined();
    });

    it('should be find by uuid', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      const saved = await service.createKeycloak(params);

      const keycloak = await service.findByUUID(saved.uuid);
      expect(params.url).toEqual(keycloak.url);
      expect(keycloak.uuid).toBe(saved.uuid);
      expect(keycloak.isWriteable).toBeTruthy();
    });
    it('should be not find by uuid', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      await service.createKeycloak(params);

      const keycloak = await service.findByUUID('test');
      expect(keycloak).toBeUndefined();
    });

    it('should be find by writeable', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      const saved = await service.createKeycloak(params);

      const keycloak = await service.findByWriteable();
      expect(params.url).toEqual(keycloak.url);
      expect(keycloak.uuid).toBe(saved.uuid);
      expect(keycloak.isWriteable).toBeTruthy();
    });
    it('should be not find by writeable', async () => {
      const keycloak = await service.findByWriteable();
      expect(keycloak).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should be readonely', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      const saved = await service.createKeycloak(params);

      const keycloak = await service.readonly(saved.uuid);
      expect(params.url).toEqual(keycloak.url);
      expect(keycloak.uuid).toBe(saved.uuid);
      expect(keycloak.isWriteable).toBeFalsy();
    });

    it('should be not  readonely', async () => {
      const params: CreateKeycloakDto = { url: 'http://example.com' };
      const saved = await service.createKeycloak(params);
      try {
        const keycloak = await service.readonly('fakeid');
      } catch (ex) {
        expect(ex.status).toBe(400);
        return;
      }
      fail();
    });
  });
});
