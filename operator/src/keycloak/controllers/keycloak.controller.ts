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
import { text } from 'express';
import { CreateKeycloakDto, KeycloakDto } from '../models/dto/keycloak.dto';
import { KeycloakService } from '../services/keycloak.service';

@Controller('keycloak')
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}
  private logger = new Logger(KeycloakController.name);

  @Get()
  @ApiResponse({ status: 200, type: KeycloakDto, isArray: true })
  @HttpCode(200)
  public async getAll() {
    return await this.keycloakService.findAll();
  }

  @Get('id/:id')
  @ApiResponse({ status: 200, type: KeycloakDto, isArray: false })
  @ApiResponse({ status: 404, type: text })
  public async findById(@Param('id') id: string) {
    const res = await this.keycloakService.findByUUID(id);
    if (res === undefined) {
      this.logger.log(id + ' is not found');
      throw new NotFoundException(id + ' is not found');
    }
    return res;
  }

  @Get('active')
  @ApiResponse({ status: 200, type: KeycloakDto, isArray: false })
  @ApiResponse({ status: 404, type: text })
  public async findByWriteable() {
    const res = await this.keycloakService.findByWriteable();
    if (res === undefined) {
      this.logger.log('Active keycloak is not found');
      throw new NotFoundException();
    }
    return res;
  }

  @Post()
  @ApiResponse({ status: 200, type: KeycloakDto, isArray: false })
  @ApiResponse({ status: 400 })
  public async create(@Body() create: CreateKeycloakDto) {
    return await this.keycloakService.createKeycloak(create);
  }
}
