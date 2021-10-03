import { TenantDto } from './dto/tenant.dto';
import { TenantEntity } from './entitiy/tenant';

export const toTenantDto = (data: TenantEntity): TenantDto => {
  if (data === undefined) return undefined;
  const { id, uuid, tenantName, keycloakId, keycloakUri } = data;
  const dto = {
    id,
    uuid,
    tenantName,
    keycloakId,
    keycloakUri,
  };
  return dto;
};
