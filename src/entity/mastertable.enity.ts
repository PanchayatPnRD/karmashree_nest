import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn,JoinColumn, PrimaryColumn, Index } from "typeorm";



@Entity()
export class user_role {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  role_type: string;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;
 


  @Column({nullable:true})
  is_deleted:boolean;


}






@Entity()
export class master_zp{
  @Column({ type: 'varchar', length: 30, collation: 'utf8_unicode_ci' })
  state: string;

  @Index()
  @Column({ name: 'stateLgd', type: 'varchar', length: 2, collation: 'utf8_unicode_ci' })
  stateLgd: string;

  @Column({ name: 'districtLgd', type: 'varchar', length: 5, collation: 'utf8_unicode_ci' })
  districtLgd: string;

  @Column({ name: 'districtName', type: 'varchar', length: 50, collation: 'utf8_unicode_ci' })
  districtName: string;

  @Index()
  @PrimaryColumn({ name: 'districtCode', type: 'varchar', length: 2, collation: 'utf8_unicode_ci' })
  districtCode: string;

 


}



@Entity()
export class master_urban{
  @Index() // Index on districtCode column
  @Column({ name: 'districtCode', type: 'varchar', length: 2, collation: 'utf8mb4_unicode_ci' })
  districtCode: string;

  @Index() 
  @Column({  name: 'districtName', type: 'varchar', length: 50, collation: 'utf8mb4_unicode_ci'  })
  districtName: string;

  // Primary key and index on urbanCode column
  @Index() 
  @PrimaryColumn({ name: 'urbanCode', type: 'varchar', length: 5, collation: 'utf8mb4_unicode_ci' })
  urbanCode: string;

  @Index() // Index on urbanName column
  @Column({ name: 'urbanName',  type: 'varchar',  length: 100, collation: 'utf8mb4_unicode_ci' })
  urbanName: string;
}


@Entity()
export class master_subdivision{
  @PrimaryColumn({ name: 'districtCode', type: 'varchar', length: 2, collation: 'utf8mb4_unicode_ci' })
  districtCode: string;

  @Column({  name: 'districtName', type: 'varchar', length: 150, collation: 'utf8mb4_unicode_ci' })
  districtName: string;

  @PrimaryColumn({  name: 'subdivCode', type: 'varchar', length: 3, collation: 'utf8mb4_unicode_ci'  })
  subdivCode: string;

  @Column({  name: 'subdivName',  type: 'varchar', length: 150, collation: 'utf8mb4_unicode_ci' })
  subdivName: string;
}

@Entity()
export class master_ps{
  @Column({ name: 'state', type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci' })
  state: string;

  @Column({  name: 'stateLgd', type: 'varchar',length: 2, collation: 'utf8mb4_unicode_ci'})
  stateLgd: string;

  @Column({ name: 'districtLgd', type: 'varchar', length: 5, collation: 'utf8mb4_unicode_ci' })
  districtLgd: string;

  @Column({ name: 'blockLgd', type: 'varchar', length: 10, collation: 'utf8mb4_unicode_ci'  })
  blockLgd: string;

  @Column({ name: 'districtName', type: 'varchar', length: 50, collation: 'utf8mb4_unicode_ci' })
  districtName: string;

  @Column({  name: 'districtCode', type: 'varchar', length: 2, collation: 'utf8mb4_unicode_ci' })
  districtCode: string;

  @Column({  name: 'blockName', type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci' })
  blockName: string;

  @PrimaryColumn({ name: 'blockCode', type: 'varchar', length: 4,  collation: 'utf8mb4_unicode_ci' })
  blockCode: string;
}

@Entity()
export class mastersector{
  @PrimaryColumn({  name: 'sectorname', type: 'varchar',  length: 150,  collation: 'utf8mb4_unicode_ci' })
  sectorname: string;

  @Index() // Index on sectorid column
  @Column({  name: 'sectorid',  type: 'int',  width: 11 })
  sectorid: number;
}

@Entity()
export class masterdepartment{

 @PrimaryGeneratedColumn()
  departmentNo: number;

  @Index() // Index on departmentName column
  @Column({ 
    name: 'departmentName', 
    type: 'varchar', 
    length: 100, 
    collation: 'utf8mb4_unicode_ci' 
  })
  departmentName: string;

  @Column({ 
    name: 'labourConverge', 
    type: 'varchar', 
    length: 1, 
    collation: 'utf8mb4_unicode_ci' 
  })
  labourConverge: string;

  @Column({ name: 'deptshort', type: 'varchar',   collation: 'utf8mb4_unicode_ci' })
  deptshort: string;

  @Column({ 
    name: 'Organization', 
    type: 'varchar', 
    length: 1, 
    collation: 'utf8mb4_unicode_ci' ,
    comment:'S=>State Organization, C=>Central Organization	'
  })
  organization: string;
}



@Entity()
export class gram_panchayat{
  @Index()
  @PrimaryColumn({ 
    name: 'gpCode', 
    type: 'varchar', 
    length: 6, 
    collation: 'utf8mb4_unicode_ci' 
  })
  gpCode: string;

  @Index() // Index on districtcode column
  @Column({ 
    name: 'districtcode', 
    type: 'varchar', 
    length: 25, 
    collation: 'utf8mb4_unicode_ci' 
  })
  districtcode: string;

  @Column({ 
    name: 'districtname', 
    type: 'varchar', 
    length: 255, 
    collation: 'utf8mb4_unicode_ci' 
  })
  districtname: string;

  @Column({ 
    name: 'subdiv', 
    type: 'varchar', 
    length: 255, 
    collation: 'utf8mb4_unicode_ci' 
  })
  subdiv: string;

  @Column({ 
    name: 'subdivname', 
    type: 'varchar', 
    length: 255, 
    collation: 'utf8mb4_unicode_ci' 
  })
  subdivname: string;

  @Column({ 
    name: 'block', 
    type: 'varchar', 
    length: 255, 
    collation: 'utf8mb4_unicode_ci' 
  })
  block: string;

  @Column({ 
    name: 'blockname', 
    type: 'varchar', 
    length: 255, 
    collation: 'utf8mb4_unicode_ci' 
  })
  blockname: string;

  @Index() // Index on blockcode column
  @Column({ 
    name: 'blockcode', 
    type: 'varchar', 
    length: 4, 
    collation: 'utf8mb4_unicode_ci' 
  })
  blockcode: string;

  @Column({ 
    name: 'gpName', 
    type: 'varchar', 
    length: 255, 
    collation: 'utf8mb4_unicode_ci' 
  })
  gpName: string;
}


@Entity()
export class masterdesignation{

  @PrimaryGeneratedColumn()
  designationId: number;

  @Index()
  @Column({ type: 'varchar', length: 5, collation: 'utf8mb4_unicode_ci', nullable: true })
  designationLevel: string;

  @Index()
  @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci', nullable: true })
  designation: string;

  @Index()
  @Column({ type: 'int', width: 11, nullable: true })
  designationstage: number;

  @Column({ type: 'varchar', length: 10, collation: 'utf8mb4_unicode_ci', nullable: true })
  userType: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci', nullable: true })
  officeName: string;
}

@Entity()
export class pedestalMaster{

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 5, collation: 'utf8mb4_unicode_ci', nullable: true })
  departmentNo: string;

  @Index()
  @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci', nullable: true })
  departmentName: string;

  @Index()
  @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci', nullable: true })
  pedestalName: string;


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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdateTime: Date;


}