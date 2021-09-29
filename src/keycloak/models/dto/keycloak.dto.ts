import { ApiProperty } from '@nestjs/swagger';

export class KeycloakDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  uuid?: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  isWriteable: boolean;
}

export class CreateKeycloakDto {
  @ApiProperty()
  url: string;
}
