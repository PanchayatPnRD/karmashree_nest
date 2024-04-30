import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Scheme {
    @PrimaryGeneratedColumn()
    scheme_sl: number;

    @Column()
    schemeId: string;

    @Column({ length: 5 })
    schemeArea: string;

    @Column()
    departmentNo: number;

    @Column({ length: 2 })
    districtcode: string;

    @Column({ length: 2, nullable: true })
    municipalityCode: string ;

    @Column({ length: 4, nullable: true })
    blockcode: string ;

    @Column({ length: 6, nullable: true })
    gpCode: string ;

    @Column({ nullable: true })
    sansadID: number ;

    @Column({ length: 9 })
    village: string;

    @Column()
    schemeSector: number;

    @Column({ length: 255, nullable: true })
    schemeSubsector: string ;

    @Column({ length: 255 })
    schemeName: string;

    @Column()
    FundingDepttID: number;

    @Column({ length: 255 })
    FundingDeptname: string;

    @Column()
    ExecutingDepttID: number;

    @Column({ length: 255 })
    ExecutingDeptName: string;

    @Column()
    ImplementingAgencyID: number;

    @Column({ length: 255 })
    ImplementingAgencyName: string;

    @Column({ length: 1 })
    StatusOfWork: string;

    @Column({ type: 'date', nullable: true })
    tentativeStartDate: Date ;

    @Column({ type: 'date', nullable: true })
    ActualtartDate: Date ;

    @Column()
    ExpectedCompletionDate: Date;

    @Column('double', { precision: 19, scale: 2 })
    totalprojectCost: number;

    @Column('double', { precision: 19, scale: 2, nullable: true })
    totalWageCost: number ;

    @Column({ nullable: true })
    totalLabour: number ;

    @Column({ nullable: true })
    totalUnskilledWorkers: number;

    @Column({ nullable: true })
    totalSemiSkilledWorkers: number;

    @Column({ nullable: true })
    totalSkilledWorkers: number;

    @Column({ length: 255, nullable: true })
    workorderNo: string ;

    @Column({ length: 255, nullable: true })
    ControctorID: number ;

    @Column({ type: 'date', nullable: true })
    workOderDate: Date ;

    @Column({ length: 1 })
    schemeStatus: string;

    @Column()
    CurrentMonth: number;

    @Column()
    CurrentYear: number;

    @Column({ length: 9 })
    finYear: string;

    @Column({ length: 255, nullable: true })
    Remarks: string ;

    @Column({ length: 1, nullable: true })
    ex1: string ;

    @Column({ length: 1, nullable: true })
    ex2: string ;

    @Column({ length: 1, nullable: true })
    ex3: string ;

    @Column({ length: 1, nullable: true })
    ex4: string ;

    @Column({ length: 1, nullable: true })
    ex5: string ;

    @Column()
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    SubmitTime: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}

