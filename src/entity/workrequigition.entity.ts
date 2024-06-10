import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

@Entity()
export class MasterWorkerRequirement {
  @PrimaryGeneratedColumn()
  workersl: number;

  @Column({ unique: true })
  workerreqID: string;

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

  
  @Column({ type: 'varchar',  nullable: true })
  FundingDeptname:string;

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

  @Column({  nullable: true })
  workerreqID: string;

  @Column({ type: 'varchar', length: 11, nullable: true})
  schemeArea: string;

  @Column({ type: 'int', nullable: true })
  departmentNo: number;

  @Column({  nullable: true })
  districtcode: number;


  @Column({  nullable: true })
  municipalityCode: number;

  @Column({  nullable: true })
  blockcode: number;

  @Column({  nullable: true })
  gpCode: number;

  @Column({ type: 'int', nullable: true })
  workCodeSchemeID: number;

  @Column({  nullable: true })
  contractorID: number;

  @Column({ type: 'date', nullable: true })
  dateofwork: Date;

  @Column({ type: 'int', nullable: true })
  unskilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  semiSkilledWorkers: number;

  @Column({ type: 'int', nullable: true })
  skilledWorkers: number;

  @Column({ nullable: true })
  contactPersonName: string;

  @Column({ nullable: true })
  contactPersonPhoneNumber: string;


  @Column({ type: 'varchar',  nullable: true })
  FundingDeptname:string;

  @Column({ type: 'int', nullable: true })
  ImplementingAgencyID: number;


  @Column({ type: 'varchar',  nullable: true })
  ImplementingAgencyName: string;

  @Column({ type: 'int', nullable: true })
  currentMonthWork: number;

  @Column({ type: 'int', nullable: true })
  currentYearWork: number;

  @Column({ type: 'varchar', length: 9, nullable: true })
  finYearWork: string;

  @Column({  nullable: true})
  allocationID: string;

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

  @Column({ type: 'int', nullable: true })
  userIndex: number;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submitTime: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  UpdateTime: Date;
}
