import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class jobcardformat {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({ type: 'bigint' })
  nregaStateCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  nregaStateName: string;

  @Column({ type: 'bigint' })
  nregaDistrictCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  nregaDistrictName: string;

  @Column({ type: 'bigint' })
  nregaBlockCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  nregaBlockName: string;

  @Column({ type: 'bigint' })
  nregaPanchCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  nregaPanchayatName: string;

  @Column({ type: 'bigint' })
  lgdStateCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  lgdStateName: string;

  @Column({ type: 'bigint' })
  lgdDistrictCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  lgdDistrictName: string;

  @Column({ type: 'bigint' })
  lgdBlockCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  lgdBlockName: string;

  @Column({ type: 'bigint' })
  lgdPanchCode: number;

  @Column({ length: 255, collation: 'utf8mb4_unicode_ci' })
  lgdPanchName: string;

  @Column({ type: 'bigint' })
  districtCode: number;

  @Column({ type: 'bigint' })
  blockCode: number;

  @PrimaryColumn()
  gpCode: number;

  @Column({  nullable: true  })
  is_deleted:boolean;


  

}
