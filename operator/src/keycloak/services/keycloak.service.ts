import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { CreateKeycloakDto, KeycloakDto } from '../models/dto/keycloak.dto';
import { KeycloakEntity } from '../models/entitiy/keycloak';
import { toKeyclaokDto } from '../models/mapper';

@Injectable()
export class KeycloakService {
  constructor(
    @InjectRepository(KeycloakEntity)
    private keycloakRepository: Repository<KeycloakEntity>,
  ) {}

  private logger = new Logger(KeycloakService.name);

  async findAll(): Promise<KeycloakDto[]> {
    const entities = await this.keycloakRepository.find();
    if (entities === undefined) throw new NotFoundException('Not found');
    return entities.map((x) => toKeyclaokDto(x));
  }

  async findByUUID(uuid: string): Promise<KeycloakDto> {
    const entity = await this.keycloakRepository.findOne({ where: { uuid } });
    return toKeyclaokDto(entity);
  }

  async findByWriteable(): Promise<KeycloakDto> {
    const entity = await this.keycloakRepository.findOne({
      where: { isWriteable: true },
    });
    return toKeyclaokDto(entity);
  }

  async findByUrl(url: string): Promise<KeycloakDto> {
    const entity = await this.keycloakRepository.findOne({
      where: { url },
    });
    return toKeyclaokDto(entity);
  }

  async createKeycloak(
    createKeycloakDto: CreateKeycloakDto,
  ): Promise<KeycloakDto> {
    const keycloakInDb = await this.findByUrl(createKeycloakDto.url);
    if (keycloakInDb !== undefined) {
      this.logger.log('Keycloak is already exist');
      throw new HttpException(
        'Keycloak is already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const keycloak = await this.keycloakRepository.create({
      isWriteable: true,
      url: createKeycloakDto.url,
      uuid: ulid(),
    });
    await this.keycloakRepository.save(keycloak);
    return toKeyclaokDto(keycloak);
  }

  async readonly(uuid: string): Promise<KeycloakDto> {
    const keycloakInDb = await this.keycloakRepository.findOne({
      where: { uuid },
    });
    if (keycloakInDb === undefined) {
      console.log('Keycloak is already exist');
      throw new HttpException(
        'Keycloak is already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    keycloakInDb.isWriteable = false;
    const updated = await this.keycloakRepository.save(keycloakInDb);
    return toKeyclaokDto(updated);
  }
}
