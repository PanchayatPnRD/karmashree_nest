import { Entity, Column, PrimaryColumn, Unique, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class district_job {
  
  @PrimaryColumn({ type: 'varchar', length: 2, collation: 'utf8mb3_unicode_ci' })
  district_code: string;

  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  district_name: string;

  @PrimaryColumn({ type: 'int', nullable: false })
  DIST_LGD: number;

  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  DIST_NAME: string;
}



@Entity()
@Unique(['gpCode'])
export class gram_panchayat_job {
  
  @PrimaryColumn({ type: 'varchar', length: 6, collation: 'utf8mb3_unicode_ci' })
  GP_LGD: string;

  @Column({ type: 'varchar', length: 2, collation: 'utf8mb3_unicode_ci', nullable: false })
  districtCode: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb3_unicode_ci', nullable: false })
  districtName: string;

  @Column({ type: 'varchar', length: 3, collation: 'utf8mb3_unicode_ci', nullable: false })
  DIST_LGD: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb3_unicode_ci', nullable: false })
  DIST_NAME: string;

  @Column({ type: 'varchar', length: 4, collation: 'utf8mb3_unicode_ci', nullable: false })
  blockCode: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb3_unicode_ci', nullable: false })
  blockName: string;

  @Column({ type: 'varchar', length: 4, collation: 'utf8mb3_unicode_ci', nullable: false })
  BLOCK_LGD: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb3_unicode_ci', nullable: false })
  BLOCK_NAME: string;

  @Column({ type: 'varchar', length: 6, collation: 'utf8mb3_unicode_ci', nullable: false })
  gpCode: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb3_unicode_ci', nullable: false })
  gpName: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb3_unicode_ci', nullable: false })
  GP_NAME: string;
}


@Entity()
export class master_ps_job {
  
  @PrimaryColumn({ type: 'varchar', length: 2, collation: 'utf8mb3_unicode_ci' })
  districtCode: string;

  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  districtName: string;

  @PrimaryColumn({ type: 'int', nullable: false })
  DIST_LGD: number;

  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  DIST_NAME: string;


  @PrimaryColumn({ type: 'varchar', length: 4, collation: 'utf8mb3_unicode_ci', nullable: false })
  blockCode: string;


  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  blockName: string;


  @PrimaryColumn({ type: 'int', nullable: false })
  BLOCK_LGD: number;


  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  BLOCK_NAME: string;
}


@Entity()
export class master_zp_job {
  
  @PrimaryColumn({ type: 'varchar', length: 2, collation: 'utf8mb3_unicode_ci' })
  districtCode: string;

  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  districtName: string;

  @PrimaryColumn({ type: 'int', nullable: false })
  DIST_LGD: number;

  @Column({ type: 'varchar', length: 30, collation: 'utf8mb3_unicode_ci', nullable: false })
  DIST_NAME: string;
}

@Entity()
export class masterscheme_2024_2025 {
  @PrimaryGeneratedColumn()
  schemeId: number;

  @Column({ type: 'varchar', length: 6, nullable: false })
  schemeArea: string;

  
  @Index()
  @Column({ type: 'int', nullable: false })
  departmentNo: number;

  
  @Index()
  @Column({ type: 'varchar', length: 250, charset: 'utf8mb3', nullable: false })
  schemeName: string;

  
  @Index()
  @Column({ type: 'int', nullable: true })
  schemeSector: number;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb3', nullable: true })
  schemeSubsector: string;

  
  @Index()
  @Column({ type: 'varchar', length: 2, charset: 'utf8mb3', nullable: false })
  districtcode: string;


  
  @Index()
  @Column({ type: 'varchar', length: 4, charset: 'utf8mb3', nullable: false })
  blockcode: string;


  
  @Index()
  @Column({ type: 'varchar', length: 6, charset: 'utf8mb3', nullable: false })
  gpCode: string;

  @Column({ type: 'date', nullable: true })
  startedOn: Date;

  @Column({ type: 'date', nullable: true })
  finishedOn: Date;

  @Column({ type: 'double', precision: 19, scale: 2, nullable: true })
  projectCost: number;

  @Column({ type: 'double', precision: 19, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ type: 'int', default: 0 })
  totalLabour: number;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb3', nullable: true })
  remarks: string;

  @Column({ type: 'int', default: 0 })
  currentStatus: number;

  @Column({ type: 'int', nullable: false })
  userIndex: number;

  
  @Index()
  @Column({ type: 'int', nullable: true })
  OrganizerId: number;

  @Column({ type: 'varchar', length: 100, charset: 'utf8mb3', nullable: true })
  OrganizerName: string;


  
  @Index()
  @Column({ type: 'varchar', length: 10, charset: 'utf8mb3', default: '2024-2025' })
  finYear: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  submitDate: Date;
}