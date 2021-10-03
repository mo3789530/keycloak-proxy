import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createConnection,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { CreateTenantDto } from '../models/dto/tenant.dto';
import { TenantEntity } from '../models/entitiy/tenant';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;
  let repository: Repository<TenantEntity>;
  const testConnectionName = 'testConnection_1';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(TenantEntity),
          useClass: Repository,
        },
      ],
    }).compile();
    const connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [TenantEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });
    repository = getRepository(TenantEntity, testConnectionName);
    service = new TenantService(repository);
  });

  afterEach(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be create', async () => {
      const params: CreateTenantDto = { tenantName: 'test' };
      try {
        const result = await service.create(params, 'fakeId');
        expect(result.keycloakId).toEqual('fakeId');
        expect(result.tenantName).toEqual('test');
      } catch (e) {
        fail();
      }
    });

    it('should be create fail', async () => {
      const params: CreateTenantDto = { tenantName: 'test' };
      try {
        const result = await service.create(params, 'fakeId');
        await service.create(params, 'fakeId');
      } catch (e) {
        expect(e.status).toBe(400);
        return;
      }
      fail();
    });
  });

  describe('find', () => {
    it('should be find all', async () => {
      const params: CreateTenantDto = { tenantName: 'test1' };
      const params2: CreateTenantDto = { tenantName: 'test2' };
      await service.create(params, 'aaa');
      await service.create(params2, 'aaa');
      const res = await service.findAll();
      expect(res.length).toBe(2);
    });

    it('should be find by tenant name', async () => {
      const params: CreateTenantDto = { tenantName: 'test1' };
      const params2: CreateTenantDto = { tenantName: 'test2' };
      const inDb = await service.create(params, 'aaa');
      await service.create(params2, 'aaa');
      const res = await service.findByName('test1');
      expect(res.keycloakId).toBe(inDb.keycloakId);
      expect(res.tenantName).toBe(inDb.tenantName);
      expect(res.uuid).toBe(inDb.uuid);
    });
  });
});
