import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class DemandMaster {
    @PrimaryGeneratedColumn()
    demandsl: number;

    @Column()
    demanduniqueID: number;

    @Column({ length: 5, nullable: false })
    schemeArea: string;

    @Column({ nullable: false })
    departmentNo: number;

    @Column({ type: 'int', nullable: true  })
    districtcode: number;

    @Column({ type: 'int', nullable: true  })
    municipalityCode: number;

    @Column({ type: 'int', nullable: true  })
    blockcode: number;

    @Column({ type: 'int', nullable: true  })
    gpCode: number;

    @Column({ length: 100, nullable: false })
    workerJobCardNo: string;

    @Column({ length: 255, nullable: false })
    workerName: string;

    @Column({ length: 5, nullable: false })
    gender: string;

    @Column({ length: 6, nullable: true })
    caste: string;

    @Column({ length: 1, nullable: true })
    whetherMinority: string;

    @Column({ length: 1, nullable: true })
    whetherMigrantWorker: string;

    @Column({ length: 10, nullable: true })
    mobileNo: string;

    @Column({ length: 16, nullable: true })
    aadhaarNo: string;

    @Column({ length: 15, nullable: false })
    typeOfWorkers: string;

    @Column({ type: 'date', nullable: false })
    dateOfApplicationForWork: Date;

    @Column({ nullable: false })
    noOfDaysWorkDemanded: number;

    @Column({ nullable: false })
    currentMonth: number;

    @Column({ nullable: false })
    currentYear: number;

    @Column({ length: 9, nullable: false })
    finYear: string;

    @Column({ length: 1, nullable: true })
    ex1: string;

    @Column({ length: 1, nullable: true })
    ex2: string;

    @Column({ length: 1, nullable: true, default: '0' })
    ex3: string;

    @Column({ length: 1, nullable: true })
    ex4: string;

    @Column({ length: 1, nullable: true })
    ex5: string;

    @Column({ nullable: false })
    userIndex: number;

   
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;
  
    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;

}


@Entity()
export class MasterWorkerDemand_allotment {
    @PrimaryGeneratedColumn()
    demandsl: number;

    @Column()
    demanduniqueID: number;

    @Column({ length: 5, nullable: false })
    schemeArea: string;

    @Column({ nullable: false })
    departmentNo: number;

    @Column({ nullable: false })
    districtcode: number;

    @Column({ nullable: false })
    municipalityCode: number;

    @Column({ nullable: false })
    blockcode: number;

    @Column({ nullable: false })
    gpCode: number;

    @Column({ length: 100, nullable: true })
    workerJobCardNo: string;

    @Column({ type: 'date', nullable: false })
    dateofwork: Date;

    @Column({ length: 1, nullable: false })
    workAllotedstatus: string;

    @Column({ nullable: false })
    CurrentMonth_work: number;

    @Column({ nullable: false })
    CurrentYear_work: number;

    @Column({ length: 9, nullable: false })
    finYear_work: string;

    @Column({ nullable: true })
    allocationID: number;

    @Column({ type: 'date', nullable: true })
    dateofallotment: Date;

    @Column({ nullable: true })
    CurrentMonth_allot: number;

    @Column({ nullable: true })
    CurrentYear_allot: number;

    @Column({ length: 9, nullable: true })
    finYear_allot: string;

    @Column({ nullable: true })
    allotmentuserIndex: number;

    @Column({ length: 1, nullable: true })
    ex1: string;

    @Column({ length: 1, nullable: true })
    ex2: string;

    @Column({ length: 1, nullable: true })
    ex3: string;

    @Column({ length: 1, nullable: true })
    ex4: string;

    @Column({ length: 1, nullable: true })
    ex5: string;

    @Column({ nullable: false })
    userIndex: number;

     
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}