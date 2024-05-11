import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MasterScheme {
    @PrimaryGeneratedColumn()
    scheme_sl: number;

    
    @Column({type: 'varchar'} )
    schemeId: string;

    @Column({ type: 'varchar',length: 5 })
    schemeArea: string;

    @Column({type: 'int'} )
    departmentNo: number;

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

    @Column({ type: 'varchar',length: 9 })
    village: string;

    @Column({type: 'int', nullable: true } )
    schemeSector: number;

    @Column({ type: 'varchar',length: 255, nullable: true })
    schemeSubsector: string ;

    @Column({ type: 'varchar',length: 255 })
    schemeName: string;

    @Column({type: 'int'} )
    FundingDepttID: number;

    @Column({ type: 'varchar',length: 255 })
    FundingDeptname: string;

    @Column({type: 'int'} )
    ExecutingDepttID: number;

    @Column({ type: 'varchar',length: 255 })
    ExecutingDeptName: string;

    @Column({type: 'int'} )
    ImplementingAgencyID: number;

    @Column({ type: 'varchar',length: 255 })
    ImplementingAgencyName: string;

    @Column({ type: 'varchar',length: 15 })
    StatusOfWork: string;

    @Column({ type: 'date', nullable: true })
    tentativeStartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ActualtartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ExpectedCompletionDate: Date;

    @Column('double', { precision: 19, scale: 2 })
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

    @Column({ type: 'varchar',length: 255, nullable: true })
    workorderNo: string ;


    @Column({ type: 'date', nullable: true })
    workOderDate: Date ;

    @Column({ type: 'int', nullable: true })
    ControctorID: number ;

    @Column({type: 'varchar', length: 1 })
    schemeStatus: string;

    @Column({ type: 'int' })
    CurrentMonth: number;

    @Column({ type: 'int' })
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

    @Column({type: 'int'} )
    departmentNo: number;

    @Column({ type: 'int' })
    districtcode: number;

    @Column({ type: 'int', nullable: true })
    municipalityCode: number ;

    @Column({ type: 'int', nullable: true })
    blockcode: number ;

    @Column({ type: 'int', nullable: true })
    gpCode: number ;

    @Column({ nullable: true })
    sansadID: number ;

    @Column({ type: 'varchar',length: 9 })
    village: string;

    @Column({type: 'int'} )
    schemeSector: number;

    @Column({ type: 'varchar',length: 255, nullable: true })
    schemeSubsector: string ;

    @Column({ type: 'varchar',length: 255 })
    schemeName: string;

    @Column({type: 'int'} )
    FundingDepttID: number;

    @Column({ type: 'varchar',length: 255 })
    FundingDeptname: string;

    @Column({type: 'int'} )
    ExecutingDepttID: number;

    @Column({ type: 'varchar',length: 255 })
    ExecutingDeptName: string;

    @Column({type: 'int'} )
    ImplementingAgencyID: number;

    @Column({ type: 'varchar',length: 255 })
    ImplementingAgencyName: string;

    @Column({ type: 'varchar',length: 19 })
    StatusOfWork: string;

    @Column({ type: 'date', nullable: true })
    tentativeStartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ActualtartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ExpectedCompletionDate: Date;

    @Column('double', { precision: 19, scale: 2 })
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

    @Column({ type: 'int' })
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    SubmitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}

