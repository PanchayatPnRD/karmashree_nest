import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Employment {
    @PrimaryGeneratedColumn()
    employmentsl: number;

    @Column({ type: 'varchar'})
    employmentID: string; // Assuming you'll generate this value in your code

    @Column({  nullable: true})
    demandid: string; // Assuming you'll generate this value in your code


    @Column({ type: 'varchar', nullable: true })
    schemeArea: string;

    @Column({ type: 'int', nullable: true })
    departmentNo: number;

    @Column({ type: 'int' })
    districtcode: number;

    @Column({ type: 'int', nullable: true })
    municipalityCode: number;

    @Column({ type: 'int', nullable: true })
    blockcode: number;

    @Column({ type: 'int', nullable: true })
    gpCode: number;

    @Column({ type: 'int' })
    schemeId: number;

    @Column({ type: 'int' })
    schemeSector: number;

    @Column({ type: 'int' , nullable: true })
    FundingDepttID: number;

    @Column({ type: 'varchar', length: 255,nullable: true })
    FundingDeptname: string;

    @Column({ type: 'int',nullable: true })
    ExecutingDepttID: number;

    @Column({ type: 'varchar', length: 255,nullable: true })
    ExecutingDeptName: string;

    @Column({ type: 'int', nullable: true })
    ImplementingAgencyID: number;

    @Column({ type: 'varchar', length: 255 , nullable: true})
    ImplementingAgencyName: string;

    @Column({ type: 'varchar', length: 255 })
    workAllocationID: string;

    @Column({ type: 'varchar', length: 255 })
    workerJobCardNo: string;

    @Column({ type: 'varchar', length: 255 })
    workerName: string;

    @Column({ type: 'date' })
    workAllocationFromDate: Date;

    @Column({ type: 'date' })
    workAllocationToDate: Date;

    @Column({ type: 'int', nullable: true  })
    noOfDaysWorkAlloted: number;

    @Column({ type: 'date', nullable: true  })
    empProvidedfrom: Date;

    @Column({ type: 'date' , nullable: true })
    empProvidedto: Date;

    @Column({ type: 'int', nullable: true })
    noOfDaysWorProvided: number;

    @Column({ type: 'double', precision: 19, scale: 2 })
    totalWagePaid: number;

    @Column({ type: 'date' })
    dateOfPayment: Date;

    @Column({ type: 'varchar', length: 255 })
    attandance: string;

    @Column({ type: 'int', nullable: true })
    currentMonth: number;

    @Column({ type: 'int', nullable: true })
    currentYear: number;

    @Column({ type: 'varchar', length: 9 })
    finYear: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex1: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex2: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex3: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex4: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    ex5: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    directempstatus: string;

    @Column({ type: 'int', comment:'from Local Storage/sesion Data'})
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;
  
    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}