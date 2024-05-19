import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity()
export class MasterWorkerRequirement {
  @PrimaryGeneratedColumn()
  workersl: number;

  @Column({ unique: true })
  workerreqID: number;

  @Column({ nullable: true })
  schemeArea: string;

  @Column({ nullable: true })
  departmentNo: number;

  @Column({ nullable: true })
  districtcode: number;

  @Column({ nullable: true })
  municipalityCode: number;

  @Column({ nullable: true })
  blockcode: number;

  @Column({ nullable: true })
  gpCode: number;

  @Column({ nullable: true })
  sansadID: number;

  @Column({ nullable: true })
  village: string;

  @Column({ nullable: false })
  workCodeSchemeID: number;

  @Column({ nullable: true }) // Hiding this column
  ContractorID: number;

  @Column({ nullable: true })
  contactPersonName: string;

  @Column({ nullable: true })
  contactPersonPhoneNumber: string;

  @Column({ nullable: true })
  reportingPlace: string;

  @Column({ nullable: true })
  nearestLandMark: string;

  @Column({ nullable: true ,type: 'date'})
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

  @Column({ type: 'varchar', length: 11, nullable: true})
  schemeArea: string;

  @Column({ type: 'int', nullable: true })
  departmentNo: number;

  @Column({ type: 'varchar', length: 2, nullable: true })
  districtcode: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  municipalityCode: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  blockcode: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  gpCode: string;

  @Column({ type: 'int', nullable: true })
  workCodeSchemeID: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contractorID: string;

  @Column({ type: 'date', nullable: true })
  dateofwork: Date;

  @Column({ type: 'int', nullable: true })
  unskilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  semiSkilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  skilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  currentMonthWork: number;

  @Column({ type: 'int', nullable: true })
  currentYearWork: number;

  @Column({ type: 'varchar', length: 9, nullable: true })
  finYearWork: string;

  @Column({ type: 'int', nullable: true})
  allocationID: number;

  @Column({ type: 'date', nullable: true })
  dateofallotment: Date;

  @Column({ type: 'int', nullable: true })
  noUnskilledWorkers: number;

  @Column({ type: 'int', nullable: true})
  noSemiSkilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  noSkilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  currentMonthAllot: number;

  @Column({ type: 'int', nullable: true})
  currentYearAllot: number;

  @Column({ type: 'varchar', length: 9, nullable: true })
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

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  UpdateTime: Date;
}
