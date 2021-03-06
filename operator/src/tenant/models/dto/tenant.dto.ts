import { ApiProperty } from '@nestjs/swagger';

export class TenantDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  tenantName: string;

  @ApiProperty()
  keycloakId?: string;

  @ApiProperty()
  keycloakUri?: string;
}

export class CreateTenantDto {
  @ApiProperty()
  tenantName: string;
}
