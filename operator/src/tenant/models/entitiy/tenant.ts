import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tenant')
export class TenantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ unique: true })
  tenantName: string;

  @Column()
  keycloakId: string;

  @Column()
  keycloakUri: string;
}
