import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WorkAllocation {

   @PrimaryGeneratedColumn()
    workallocationsl:number;


  @Column({ name: 'workAllocationID',nullable: true })
  workAllocationID: string;


  @Column({ nullable: true })
  demanduniqueID:string;

  @Column({ name: 'schemeArea' })
  schemeArea: string;

  @Column({ name: 'departmentNo' })
  departmentNo: number;

  @Column({ name: 'districtcode'})
  districtcode: number; // Changed type to number

  @Column({ name: 'municipalityCode',  nullable: true })
  municipalityCode: number; // Changed type to number

  @Column({ name: 'blockcode',  nullable: true })
  blockcode: number; 

  @Column({ name: 'gpCode',  nullable: true })
  gpCode: number; 

  

  @Column({ name: 'schemeId', length: 255 })
  schemeId: string;

  @Column({ name: 'SchemeName'})
  schemeName: string;


  @Column({ name: 'workallocstatus',  nullable: true })
  workallocstatus: string;

  @Column({ name: 'ContractorID',  nullable: true })
  contractorID: string;

  @Column({ name: 'WorkerJobCardNo', length: 255 })
  workerJobCardNo: string;

  @Column({ name: 'WorkerName', length: 255 })
  workerName: string;

  @Column({ length: 255, nullable: true })
  empStatus: string;

  @Column({  nullable: true })
  empDate: Date;

  @Column({  nullable: true })
  empId: string;

  @Column({ name: 'DateOfApplicationForWork', type: 'date' })
  dateOfApplicationForWork: Date;

  @Column({ name: 'NoOfDaysWorkDemanded' })
  noOfDaysWorkDemanded: number;

  @Column({ name: 'WorkAllocationFromDate', type: 'date' })
  workAllocationFromDate: Date;

  @Column({ name: 'WorkAllocationToDate', type: 'date' })
  workAllocationToDate: Date;

  @Column({ name: 'NoOfDaysWorkAlloted' })
  noOfDaysWorkAlloted: number;

  @Column({ name: 'CurrentMonth' })
  currentMonth: number;

  @Column({ name: 'CurrentYear' })
  currentYear: number;

  @Column({ name: 'finYear', length: 9 })
  finYear: string;

  @Column({ name: 'ex1', nullable: true })
  ex1: string;

  @Column({ name: 'ex2', nullable: true })
  ex2: string;

  @Column({ name: 'ex3', nullable: true })
  ex3: string;

  @Column({ name: 'ex4', nullable: true })
  ex4: string;

  @Column({ name: 'ex5', nullable: true })
  ex5: string;

  @Column()
  userIndex: number;

  
  @Column({nullable: true })
  requzitionuserIndex: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submitTime: Date;

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  UpdateTime: Date;
}
