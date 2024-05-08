import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity()
export class MasterWorkerRequirement {
  @PrimaryGeneratedColumn()
  workersl: number;

  @Column({ unique: true })
  workerreqID: number;

  @Column({ nullable: false })
  schemeArea: string;

  @Column({ nullable: false })
  departmentNo: number;

  @Column({ nullable: false })
  districtcode: string;

  @Column({ nullable: true })
  municipalityCode: string;

  @Column({ nullable: true })
  blockcode: string;

  @Column({ nullable: true })
  gpCode: string;

  @Column({ nullable: true })
  sansadID: number;

  @Column({ nullable: false })
  village: string;

  @Column({ nullable: false })
  workCodeSchemeID: number;

  @Column({ nullable: true }) // Hiding this column
  ContractorID: number;

  @Column({ nullable: false })
  contactPersonName: string;

  @Column({ nullable: false })
  contactPersonPhoneNumber: string;

  @Column({ nullable: false })
  reportingPlace: string;

  @Column({ nullable: false })
  nearestLandMark: string;

  @Column({ nullable: false })
  fromDate: Date;

  @Column({ nullable: false })
  noOfDays: number;

  @Column({ nullable: false })
  currentMonth: number;

  @Column({ nullable: false })
  currentYear: number;

  @Column({ nullable: false })
  finYear: string;

  @Column({ nullable: true })
  ex1: string;

  @Column({ nullable: true })
  ex2: string;

  @Column({ nullable: true })
  ex3: string;

  @Column({ nullable: true })
  ex4: string;

  @Column({ nullable: true })
  ex5: string;

  @Column({ nullable: false })
  userIndex: number;

 
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  SubmitTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdateTime: Date;
 
}



@Entity()
export class MasterWorkerRequirement_allotment {
  @PrimaryGeneratedColumn()
  workersl: number;

  @Column({ type: 'int' })
  workerreqID: number;

  @Column({ type: 'varchar', length: 5, nullable: false })
  schemeArea: string;

  @Column({ type: 'int', nullable: false })
  departmentNo: number;

  @Column({ type: 'varchar', length: 2, nullable: false })
  districtcode: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  municipalityCode: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  blockcode: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  gpCode: string;

  @Column({ type: 'int', nullable: true })
  workCodeSchemeID: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  contractorID: string;

  @Column({ type: 'date', nullable: false })
  dateofwork: Date;

  @Column({ type: 'int', nullable: true })
  unskilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  semiSkilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  skilledWorkers: number;

  @Column({ type: 'int', nullable: false })
  currentMonthWork: number;

  @Column({ type: 'int', nullable: false })
  currentYearWork: number;

  @Column({ type: 'varchar', length: 9, nullable: false })
  finYearWork: string;

  @Column({ type: 'int', nullable: false})
  allocationID: number;

  @Column({ type: 'date', nullable: false })
  dateofallotment: Date;

  @Column({ type: 'int', nullable: true })
  noUnskilledWorkers: number;

  @Column({ type: 'int', nullable: true})
  noSemiSkilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  noSkilledWorkers: number;

  @Column({ type: 'int', nullable: false })
  currentMonthAllot: number;

  @Column({ type: 'int', nullable: false})
  currentYearAllot: number;

  @Column({ type: 'varchar', length: 9, nullable: false })
  finYearAllot: string;

  @Column({ type: 'int', nullable: true })
  allotmentuserIndex: number;

  @Column({ type: 'varchar', length: 1, nullable: true })
  ex1: string;

  @Column({ type: 'varchar', length: 1, nullable: true})
  ex2: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  ex3: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  ex4: string;

  @Column({ type: 'varchar', length: 1, nullable: true})
  ex5: string;

  @Column({ type: 'int', nullable: false })
  userIndex: number;

  @Column({ type: 'timestamp', nullable: true })
  submitTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  updateTime: Date;
}
