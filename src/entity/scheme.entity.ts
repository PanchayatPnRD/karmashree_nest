import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class masterscheme {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  schemeId: number;

  @Index()
  @Column({ type: 'varchar', length: 255, collation: 'utf8_unicode_ci',comment: 'K-[DEPT Short]-Scheme_id' })
  scheme_code: string;

  @Index()
  @Column({ type: 'varchar', length: 6, collation: 'utf8_unicode_ci' })
  schemeArea: string;

  @Index()
  @Column({ type: 'int', width: 11 })
  departmentNo: number;

  @Index()
  @Column({ type: 'varchar', length: 250, collation: 'utf8_unicode_ci' })
  schemeName: string;

  @Column({ type: 'int', width: 11, nullable: true })
  schemeSector: number;

  @Column({ type: 'varchar', length: 255, collation: 'utf8_unicode_ci', nullable: true })
  schemeSubsector: string;

  @Index()
  @Column({ type: 'varchar', length: 2, collation: 'utf8_unicode_ci' })
  districtcode: string;

  @Index()
  @Column({ type: 'varchar', length: 4, collation: 'utf8_unicode_ci' })
  blockcode: string;

  @Index()
  @Column({ type: 'varchar', length: 6, collation: 'utf8_unicode_ci' })
  gpCode: string;

  @Column({ type: 'date', nullable: true })
  startedOn: Date;

  @Column({ type: 'date', nullable: true })
  finishedOn: Date;

  @Column({ type: 'double', precision: 19, scale: 2, nullable: true })
  projectCost: number;

  @Column({ type: 'double', precision: 19, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ type: 'int', width: 11, default: 0 })
  totalLabour: number;

  @Column({ type: 'varchar', length: 255, collation: 'utf8_unicode_ci', nullable: true })
  remarks: string;

  @Column({ type: 'int', width: 11, default: 0 })
  currentStatus: number;

  @Column({ type: 'int', width: 11 })
  userIndex: number;

  @Column({ type: 'int', width: 11, nullable: true,comment: 'Funding Deptt.' })
  OrganizerId: number;

  @Column({ type: 'varchar', length: 100, collation: 'utf8_unicode_ci', nullable: true,comment: 'Funding Deptt.' })
  OrganizerName: string;

  @Column({ type: 'varchar', length: 10, collation: 'utf8_unicode_ci', default: '2023-2024' })
  finYear: string;

  @Column({ type: 'int', width: 11, nullable: true })
  sansadID: number;

  @Column({ type: 'varchar', length: 100, collation: 'utf8_unicode_ci', default: '-' })
  village: string;

  @Column({ type: 'int', width: 11 ,comment: '	Executing Deptt. (Auto fill)'})
  executingDept: number;

  @Column({ type: 'int', width: 11 ,comment: 'Implementing Agency under the Executing Department'})
  implementingAgency: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submitDate: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updateTIme: Date;
}
