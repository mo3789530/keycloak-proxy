import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { CreateTenantDto, TenantDto } from '../models/dto/tenant.dto';
import { TenantEntity } from '../models/entitiy/tenant';
import { toTenantDto } from '../models/mapper';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private tenantRepository: Repository<TenantEntity>,
  ) {}

  private logger = new Logger(TenantService.name);

  async findAll(): Promise<TenantDto[]> {
    const entities = await this.tenantRepository.find();
    if (entities === undefined) return [];
    return entities.map((x) => toTenantDto(x));
  }

  async findByName(name: string): Promise<TenantDto> {
    const entitiy = await this.tenantRepository.findOne({
      where: { tenantName: name },
    });
    return toTenantDto(entitiy);
  }

  async findByUUID(uuid: string): Promise<TenantEntity> {
    return await this.tenantRepository.findOne({
      where: { uuid },
    });
  }

  async create(
    createTenant: CreateTenantDto,
    keycloakId: string,
    keycloakUrl: string,
  ): Promise<TenantDto> {
    const tenantInDb = await this.findByName(createTenant.tenantName);
    if (tenantInDb !== undefined) {
      this.logger.error('tenant is already exist');
      throw new HttpException(
        'Tenant is already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tenant = await this.tenantRepository.create({
      tenantName: createTenant.tenantName,
      uuid: ulid(),
      keycloakId: keycloakId,
      keycloakUri: keycloakUrl,
    });
    try {
      await this.tenantRepository.save(tenant);
      return toTenantDto(tenant);
    } catch (e) {
      this.logger.error('Error' + e);
      throw new HttpException('Error' + e, HttpStatus.BAD_REQUEST);
    }
  }
}
