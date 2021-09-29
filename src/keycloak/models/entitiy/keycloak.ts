import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('keycloak')
export class KeycloakEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ unique: true })
  url: string;

  @Column({ default: false })
  isWriteable: boolean;
}
