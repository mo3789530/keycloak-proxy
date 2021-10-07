import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { KeycloakService } from '../../keycloak/services/keycloak.service';
import { CreateTenantDto, TenantDto } from '../models/dto/tenant.dto';
import { TenantService } from '../services/tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly keycloakService: KeycloakService,
  ) {}

  private logger = new Logger(TenantController.name);

  @Get()
  @ApiResponse({ status: 200, type: TenantDto, isArray: true })
  @HttpCode(200)
  public async getAll() {
    return await this.tenantService.findAll();
  }

  @Get('name/:name')
  @ApiResponse({ status: 200, type: TenantDto, isArray: false })
  @ApiResponse({ status: 404 })
  public async findById(@Param('name') name: string) {
    const res = await this.tenantService.findByName(name);
    if (res === undefined) {
      this.logger.log(name + 'is not found');
      throw new NotFoundException(name + ' is not found');
    }
    return res;
  }
  @Post()
  @ApiResponse({ status: 200, type: TenantDto, isArray: false })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  public async create(@Body() create: CreateTenantDto) {
    const keycloak = await this.keycloakService.findByWriteable();
    if (keycloak === undefined || keycloak.uuid === undefined) {
      this.logger.log('Writeable keycloak is not found');
      throw new NotFoundException('Writeable keycloak is not found');
    }

    return await this.tenantService.create(
      create,
      keycloak.id.toString(),
      keycloak.url,
    );
  }
}
