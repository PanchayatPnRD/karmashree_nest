import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MasterScheme {
    @PrimaryGeneratedColumn()
    scheme_sl: number;

    
    @Column({type: 'varchar'} )
    schemeId: string;

    @Column({ type: 'varchar'})
    schemeArea: string;

    @Column({type: 'int'} )
    departmentNo: number;

    @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true  })
    deptWing: string;

    @Column({ type: 'int', nullable: true  })
    districtcode: number;

    @Column({ type: 'int', nullable: true })
    municipalityCode: number ;

    @Column({ type: 'int', nullable: true })
    blockcode: number ;

    @Column({ type: 'int', nullable: true })
    gpCode: number ;

    @Column({ nullable: true })
    sansadID: number ;

    @Column({  nullable: true })
    village: string;

    @Column({type: 'int', nullable: true } )
    schemeSector: number;

    @Column({ type: 'varchar',length: 255, nullable: true })
    schemeSubsector: string ;

    @Column({ type: 'varchar',length: 255, nullable: true  })
    schemeName: string;

    @Column({type: 'int', nullable: true } )
    FundingDepttID: number;

    @Column({ type: 'varchar',length: 255, nullable: true  })
    FundingDeptname: string;

    @Column({type: 'int', nullable: true } )
    ExecutingDepttID: number;

    @Column({ type: 'varchar',length: 255, nullable: true  })
    ExecutingDeptName: string;

    @Column({type: 'int', nullable: true} )
    ImplementingAgencyID: number;

    @Column({ type: 'varchar',length: 255, nullable: true })
    ImplementingAgencyName: string;

    @Column({ type: 'varchar',length: 15, nullable: true })
    StatusOfWork: string;

    @Column({ type: 'date', nullable: true })
    tentativeStartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ActualtartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ExpectedCompletionDate: Date;

    @Column('double', { precision: 19, scale: 2, nullable: true })
    totalprojectCost: number;

 

    @Column({
        type: 'double',
        precision: 10, // Adjust according to your needs
        scale: 2, // Adjust according to your needs
        nullable: true // Ensure this is a valid default value
      })
      totalwagescostinvoled: number;
    

    @Column({ nullable: true })
    totalLabour: number ;


    @Column('double', { precision: 19, scale: 2,nullable: true })
    totalCostprovided: number;


    @Column({ nullable: true })
    personDaysGeneratedprovided:number;


    
    @Column({ nullable: true })
    totalLabourprovided: number ;



    @Column({ nullable: true })
    personDaysGenerated:number;

    @Column({ nullable: true })
    totalUnskilledWorkers: number;

    @Column({ nullable: true })
    totalSemiSkilledWorkers: number;

    @Column({ nullable: true })
    totalSkilledWorkers: number;

    @Column({ type: 'varchar',length: 255, nullable: true })
    workorderNo: string ;


    @Column({ type: 'date', nullable: true })
    workOderDate: Date ;

    @Column({ type: 'int', nullable: true })
    ControctorID: number ;

    @Column({type: 'varchar', length: 1 })
    schemeStatus: string;

    @Column({ type: 'int', nullable: true })
    CurrentMonth: number;

    @Column({ type: 'int', nullable: true })
    CurrentYear: number;

    @Column({  type: 'varchar',length: 9, nullable: true }) 
    finYear: string;

    @Column({  type: 'varchar',length: 255, nullable: true })
    Remarks: string ;

    @Column({  type: 'varchar',length: 1, nullable: true })
    ex1: string ;

    @Column({  type: 'varchar',length: 1, nullable: true })
    ex2: string ;

    @Column({  type: 'varchar',length: 1, nullable: true })
    ex3: string ;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex4: string ;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex5: string ;

    @Column({ type: 'int' })
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    SubmitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}

@Entity()
export class MasterSchemeExpenduture {
    @PrimaryGeneratedColumn()
    schemeExpsl: number;

    @Column({type: 'int'} )
    schemeId: number;

    @Column({ type: 'varchar',length: 5 })
    schemeArea: string;

    @Column({type: 'int', nullable: true} )
    departmentNo: number;


    @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true  })
    deptWing: string;

    @Column({ type: 'int', nullable: true })
    districtcode: number;

    @Column({ type: 'int', nullable: true })
    municipalityCode: number ;

    @Column({ type: 'int', nullable: true })
    blockcode: number ;

    @Column({ type: 'int', nullable: true })
    gpCode: number ;

    @Column({ nullable: true })
    sansadID: number ;

    @Column({  nullable: true})
    village: string;

    @Column({type: 'int'} )
    schemeSector: number;

    @Column({ type: 'varchar',length: 255, nullable: true })
    schemeSubsector: string ;

    @Column({ type: 'varchar',length: 255, nullable: true })
    schemeName: string;

    @Column({type: 'int', nullable: true} )
    FundingDepttID: number;

    @Column({ type: 'varchar',length: 255 , nullable: true})
    FundingDeptname: string;

    @Column({type: 'int', nullable: true} )
    ExecutingDepttID: number;

    @Column({ type: 'varchar',length: 255 , nullable: true})
    ExecutingDeptName: string;

    @Column({type: 'int', nullable: true} )
    ImplementingAgencyID: number;

    @Column({ type: 'varchar',length: 255 , nullable: true})
    ImplementingAgencyName: string;

    @Column({ type: 'varchar',length: 19, nullable: true })
    StatusOfWork: string;

    @Column({ type: 'date', nullable: true })
    tentativeStartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ActualtartDate: Date ;

    @Column({ type: 'date', nullable: true ,})
    ExpectedCompletionDate: Date;

    @Column('double', { precision: 19, scale: 2,nullable: true  })
    totalprojectCost: number;

   

    

    @Column('double', { precision: 19, scale: 2, nullable: true })
    totalWageCost: number ;

    @Column({ nullable: true })
    totalLabour: number ;

    @Column({ nullable: true })
    personDaysGenerated:number;

    @Column({ nullable: true })
    totalUnskilledWorkers: number;

    @Column({ nullable: true })
    totalSemiSkilledWorkers: number;

    @Column({ nullable: true })
    totalSkilledWorkers: number;

   

    @Column({  type: 'varchar',length: 9, nullable: true }) 
    finYear: string;


    @Column({  type: 'varchar',length: 1, nullable: true })
    ex1: string ;

    @Column({  type: 'varchar',length: 1, nullable: true })
    ex2: string ;

    @Column({  type: 'varchar',length: 1, nullable: true })
    ex3: string ;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex4: string ;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex5: string ;

    @Column({ type: 'int', nullable: true })
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    SubmitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}


@Entity()
export class masterscheme_2024_2025 {
  @PrimaryGeneratedColumn()
  schemeId: number;

  @Column({ type: 'varchar', length: 6, nullable: false })
  schemeArea: string;

  @Column({ type: 'int', nullable: false })
  departmentNo: number;

  @Column({ type: 'varchar', length: 250, charset: 'utf8mb3', nullable: false })
  schemeName: string;

  @Column({ type: 'int', nullable: true })
  schemeSector: number;

  @Column({ type: 'varchar', length: 255, charset: 'utf8mb3', nullable: true })
  schemeSubsector: string;

  @Column({ type: 'varchar', length: 2, charset: 'utf8mb3', nullable: false })
  districtcode: string;

  @Column({ type: 'varchar', length: 4, charset: 'utf8mb3', nullable: false })
  blockcode: string;

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

  @Column({ type: 'int', nullable: true })
  OrganizerId: number;

  @Column({ type: 'varchar', length: 100, charset: 'utf8mb3', nullable: true })
  OrganizerName: string;

  @Column({ type: 'varchar', length: 10, charset: 'utf8mb3', default: '2024-2025' })
  finYear: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  submitDate: Date;
}
