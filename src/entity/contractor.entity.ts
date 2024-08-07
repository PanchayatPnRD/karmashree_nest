import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Contractor_master {
    @PrimaryGeneratedColumn()
    cont_sl: number;

    @Column({ type: 'varchar', length: 255, nullable: true,comment:'C-distLgd-randam' })
    contractor_uniqueNo: string;

    @Column({ type: 'int' ,comment:"from Dept List or Local Storage", nullable: true})
    DepartmentNo: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    districtcode: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    Municipality: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    blockcode: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    gpCode: number;

    @Column({ type: 'int' })
    c_month: number;

    @Column({ type: 'int' })
    c_Year: number;

    @Column({ type: 'varchar', length: 9 })
    finYear: string;

    @Column({ type: 'varchar', nullable: true})
    area: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    contractorName: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    contractorGSTIN: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    contractorPAN: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    contractorMobile: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    contractorAddress: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    contractorStatus: string;

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

    @Column({ type: 'int', comment:'from Local Storage/sesion Data'})
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;
  
    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}



@Entity()
export class Contractor_master_draft {
    @PrimaryGeneratedColumn()
    cont_sl: number;

    @Column({ type: 'varchar', length: 255, nullable: true,comment:'C-distLgd-randam' })
    contractor_uniqueNo: string;

    @Column({ type: 'int' ,comment:"from Dept List or Local Storage", nullable: true})
    DepartmentNo: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    districtcode: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    Municipality: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    blockcode: number;

    @Column({ type: 'int',  nullable: true,comment:'from  List or Local Storage' })
    gpCode: number;

    @Column({ type: 'int', nullable: true })
    c_month: number;

    @Column({ type: 'int', nullable: true })
    c_Year: number;

    @Column({ type: 'varchar', length: 9 })
    finYear: string;

    @Column({ type: 'varchar', nullable: true})
    area: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    contractorName: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    contractorGSTIN: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    contractorPAN: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    contractorMobile: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    contractorAddress: string;

    @Column({ type: 'varchar', length: 1, nullable: true })
    contractorStatus: string;

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
    is_draft: string;

    @Column({ type: 'int', comment:'from Local Storage/sesion Data'})
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;
  
    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}