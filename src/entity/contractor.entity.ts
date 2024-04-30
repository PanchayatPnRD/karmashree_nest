import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Contractor_master {
    @PrimaryGeneratedColumn()
    cont_sl: number;

    @Column({ type: 'varchar', length: 255, nullable: false,comment:'C-distLgd-randam' })
    contractor_uniqueNo: string;

    @Column({ type: 'int' ,comment:"from Dept List or Local Storage"})
    DepartmentNo: number;

    @Column({ type: 'varchar', length: 2, nullable: false,comment:'from  List or Local Storage' })
    districtcode: string;

    @Column({ type: 'varchar', length: 10, nullable: true,comment:'from  List or Local Storage' })
    Municipality: string;

    @Column({ type: 'varchar', length: 4, nullable: true,comment:'from  List or Local Storage' })
    blockcode: string;

    @Column({ type: 'varchar', length: 6, nullable: true,comment:'from  List or Local Storage' })
    gpCode: string;

    @Column({ type: 'int' })
    c_month: number;

    @Column({ type: 'int' })
    c_Year: number;

    @Column({ type: 'varchar', length: 9 })
    finYear: string;

    @Column({ type: 'varchar'})
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

    @Column({ type: 'varchar', length: 1, nullable: false })
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
    updateTime: Date;
}