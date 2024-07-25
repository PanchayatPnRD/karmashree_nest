import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class DemandMaster {
    @PrimaryGeneratedColumn()
    demandsl: number;

    @Column()
    demanduniqueID: string;

    @Column({  nullable: true })
    schemeArea: string;

    @Column({ nullable: true })
    departmentNo: number;

    @Column({ type: 'int', nullable: true  })
    districtcode: number;

    @Column({ type: 'int', nullable: true  })
    municipalityCode: number;

    @Column({ type: 'int', nullable: true  })
    blockcode: number;

    @Column({ type: 'int', nullable: true  })
    gpCode: number;

    @Column({ length: 100, nullable: true })
    workerJobCardNo: string;

    @Column({ length: 255, nullable: true })
    workerName: string;

    @Column({ length: 5, nullable: true })
    gender: string;

    @Column({ length: 6, nullable: true })
    caste: string;

    @Column({ length: 1, nullable: true })
    whetherMinority: string;

    @Column({ length: 1, nullable: true })
    whetherMigrantWorker: string;

    @Column({ length: 10, nullable: true })
    mobileNo: string;

    
    @Column({ length: 15, nullable: true })
    workallostatus: string;

    @Column({  nullable: true })
    total_pending: number;

    @Column({ type: 'date', nullable: true })
    dateoflastallocation: Date;

    @Column({ length: 16, nullable: true })
    aadhaarNo: string;

    @Column({ length: 15, nullable: true })
    typeOfWorkers: string;

    @Column({ length: 15, nullable: true })
    workerdemandstatus: string;

    @Column({ type: 'date', nullable: true })
    dateOfApplicationForWork: Date;

    @Column({ nullable: true })
    noOfDaysWorkDemanded: number;

    @Column({ nullable: true })
    currentMonth: number;

    @Column({ nullable: true })
    currentYear: number;

    @Column({ nullable: true })
    age: number;

    
    @Column({  nullable: true })
    remark: string;

    @Column({ length: 9, nullable: true })
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
    demanduniqueID: string;

    @Column({  nullable: false })
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

    @Column({ type: 'date', nullable: true })
    dateofwork: Date;

    @Column({ length: 1, nullable: true })
    workAllotedstatus: string;

    @Column({ nullable: true })
    CurrentMonth_work: number;

    @Column({ nullable: true })
    CurrentYear_work: number;

    @Column({ nullable: true })
    age: number;

    
    @Column({  nullable: true })
    remark: string;


    @Column({ length: 9, nullable: true })
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

    @Column({ nullable: true })
    userIndex: number;

     
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}



@Entity()
export class MasterWorkerDemand_allotmenthistroy {
    @PrimaryGeneratedColumn()
    demandsl: number;

    @Column()
    demanduniqueID: string;




    @Column({ length: 100, nullable: true })
    empid:string;

    @Column({  nullable: true })
    empStatus: string;
  
    @Column({ type: 'double', precision: 19, scale: 2 ,nullable: true  })
    totalWagePaid: number;

    @Column({ length: 100, nullable: true })
    workerJobCardNo: string;

    @Column({ type: 'date', nullable: true })
    dateofwork: Date;


    @Column({ length: 1, nullable: true })
    workAllotedstatus: string;

   

    @Column({ length: 9, nullable: true })
    finYear_work: string;

    @Column({ nullable: true })
    allocationID: string;

    @Column({ type: 'date', nullable: true })
    dateofallotmentfrom: Date;

    @Column({ type: 'date', nullable: true })
    dateofallotmentto: Date;

    @Column({ nullable: true })
    CurrentMonth_allot: number;

    @Column({ nullable: true })
    CurrentYear_allot: number;

    @Column({ length: 9, nullable: true })
    finYear_allot: string;

    @Column({ nullable: true })
    allotmentuserIndex: number;

     
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}

@Entity()
export class DemandMaster_draft {
    @PrimaryGeneratedColumn()
    demandsl: number;

    @Column()
    demanduniqueID: string;

    @Column({  nullable: true })
    schemeArea: string;

    @Column({ nullable: true })
    departmentNo: number;

    @Column({ type: 'int', nullable: true  })
    districtcode: number;

    @Column({ type: 'int', nullable: true  })
    municipalityCode: number;

    @Column({ type: 'int', nullable: true  })
    blockcode: number;

    @Column({ type: 'int', nullable: true  })
    gpCode: number;

    @Column({ length: 100, nullable: true })
    workerJobCardNo: string;

    @Column({ length: 255, nullable: true })
    workerName: string;

    @Column({ length: 5, nullable: true })
    gender: string;

    @Column({ length: 6, nullable: true })
    caste: string;

    @Column({ length: 1, nullable: true })
    whetherMinority: string;

    @Column({ length: 1, nullable: true })
    whetherMigrantWorker: string;

    @Column({ length: 10, nullable: true })
    mobileNo: string;

    
    @Column({ length: 15, nullable: true })
    workallostatus: string;

    @Column({  nullable: true })
    total_pending: number;

    @Column({ type: 'date', nullable: true })
    dateoflastallocation: Date;

    @Column({ length: 16, nullable: true })
    aadhaarNo: string;

    @Column({ length: 15, nullable: true })
    typeOfWorkers: string;

    @Column({ length: 15, nullable: true })
    workerdemandstatus: string;

    @Column({ type: 'date', nullable: true })
    dateOfApplicationForWork: Date;

    @Column({ nullable: true })
    noOfDaysWorkDemanded: number;

    @Column({ nullable: true })
    currentMonth: number;

    @Column({ nullable: true })
    currentYear: number;

    @Column({ nullable: true })
    age: number;

    
    @Column({  nullable: true })
    remark: string;

    @Column({ length: 9, nullable: true })
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