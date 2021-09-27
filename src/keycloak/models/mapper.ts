import { KeycloakDto } from './dto/keycloak.dto';
import { KeycloakEntity } from './entitiy/keycloak';

export const toKeyclaokDto = (data: KeycloakEntity): KeycloakDto => {
  if (data === undefined) {
    return undefined;
  }
  const { id, uuid, url, isWriteable } = data;
  const keycloakDto: KeycloakDto = {
    id,
    uuid,
    url,
    isWriteable,
  };
  return keycloakDto;
};
