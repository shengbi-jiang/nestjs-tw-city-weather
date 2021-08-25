import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Weather {
  @PrimaryColumn({ type: 'varchar', length: 63 })
  id: string;

  @Column({ type: 'varchar', length: 63, unique: true })
  city: string;

  @Column({ type: 'json' })
  data: Record<string, unknown>;
}
