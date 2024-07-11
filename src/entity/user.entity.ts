import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class master_users{
  @PrimaryGeneratedColumn()
  userIndex: number;

  @Index()
  @Column({  type: 'varchar', length: 10,  collation: 'utf8mb4_unicode_ci', comment: 'HQ/ HD/ DEPT/ DIST/SUB/BLOCK/GP'
  })
  category: string;

  @Index()
  @Column({ type: 'int', width: 11 })
  departmentNo: number;

  @Column({ type: 'varchar', length: 6, collation: 'utf8mb4_unicode_ci', nullable: true  })
  area: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci' })
  deptWing: string;

  @Index()
  @Column({ type: 'int',  collation: 'utf8mb4_unicode_ci' })
  districtcode: number;

  @Index()
  @Column({ type: 'int',  collation: 'utf8mb4_unicode_ci',nullable:true })
  municipalityCode: number;

  @Column({ type: 'int',  collation: 'utf8mb4_unicode_ci', nullable: true })
  subDivision: number;

  @Column({ type: 'int',  collation: 'utf8mb4_unicode_ci', nullable: true })
  blockCode: number;

  @Column({ type: 'int',  collation: 'utf8mb4_unicode_ci', nullable: true })
  gpCode: number;

  @Index()
  @Column({ type: 'int', width: 11 })
  userType: number;

  
  @Column({ type: 'int', width: 11 , nullable: true })
  role_type: number;

  @Index()
  @Column({ type: 'varchar', length: 55, collation: 'utf8mb4_unicode_ci', nullable: true })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 16, collation: 'utf8mb4_unicode_ci', nullable: true })
  pwd: string;


  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  encryptpassword: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  officeName_hd: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  officeName_dept: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  officeName_dist: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  officeName_block: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  officeName_gp: string;

  @Column({ type: 'varchar', length: 5,   default: '0' ,collation: 'utf8mb4_unicode_ci', nullable: false })
  dno_status: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci',  comment: 'Nodal officer Name', nullable: true })
  userName: string;

  @Column({ type: 'varchar', length: 10, collation: 'utf8mb4_unicode_ci', nullable: true })
  contactNo: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  email: string;

  //
  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci',  comment: 'Nodal officer Name', nullable: true })
  technical_officer: string;

  @Column({ type: 'varchar', width: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  tech_designation_id: string;

  @Column({ type: 'varchar', width: 10, collation: 'utf8mb4_unicode_ci', nullable: true })
  tech_mobile: string;

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  tech_email: string;


  
  @Column({ type: 'int', width: 11 })
  designationID: number;

  @Column({ type: 'mediumtext', collation: 'utf8mb4_unicode_ci', nullable: true })
  UserAddress: string;

  @Column({ type: 'int', width: 11, nullable: true })
  entryBy: number;

  @Column({ type: 'int', width: 11, nullable: true })
  created_by: number;

  @Column({ type: 'varchar', length: 1, collation: 'utf8mb4_unicode_ci', nullable: true })
  currentStatus: string;

 

  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpCreatedAt:Date;


  @Column({ type: 'varchar', length: 255, collation: 'utf8mb4_unicode_ci', nullable: true })
  resetotp: string;

  @Column({ type: 'varchar', length: 2, collation: 'utf8mb4_unicode_ci', nullable: true })
  is_passwordreset: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}
