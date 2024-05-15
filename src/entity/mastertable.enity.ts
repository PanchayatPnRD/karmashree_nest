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

  
  @PrimaryColumn({ type: 'int', collation: 'utf8_unicode_ci' })
  districtCode: number;

  @Column({  type: 'varchar', length: 50, collation: 'utf8_unicode_ci' })
  districtName: string;

  
  @Column({  type: 'int',  collation: 'utf8_unicode_ci' })
  DIST_LGD_PRI: number;



 


}



@Entity()
export class master_urban{
 
  @Column({  type: 'int', nullable: true,  collation: 'utf8mb4_unicode_ci' })
  districtCode: number;

 
  @Column({  type: 'varchar', nullable: true, length: 50, collation: 'utf8mb4_unicode_ci'  })
  districtName: string;

 

 
  @PrimaryColumn({  type: 'int',  collation: 'utf8mb4_unicode_ci' })
  urbanCode: number;





  @Column({  type: 'varchar',  nullable: true, length: 50, collation: 'utf8mb4_unicode_ci' })
  urbanName: string;
}





@Entity()
export class master_subdivision{
  @Index()
  @Column({  type: 'int',  collation: 'utf8mb4_unicode_ci' })
  districtCode: number;

  @Column({  name: 'districtName', type: 'varchar', length: 50, collation: 'utf8mb4_unicode_ci' })
  districtName: string;

  @PrimaryColumn({  name: 'subdivCode', type: 'int',  collation: 'utf8mb4_unicode_ci'  })
  subdivCode: number;

  @Column({   type: 'varchar', nullable: true, length: 50, collation: 'utf8mb4_unicode_ci' })
  subdivName: string;
}



@Entity()
export class master_ps{
  
  @Column({  type: 'int',  collation: 'utf8mb4_unicode_ci' })
  districtCode: number;

 
  @PrimaryColumn({  type: 'int',  collation: 'utf8mb4_unicode_ci'  })
  blockCode: number;

  @Column({  type: 'varchar', length: 50, collation: 'utf8mb4_unicode_ci' })
  blockName: string;



  @Index()
  @Column({   type: 'int',  collation: 'utf8mb4_unicode_ci' })
  subdivCode: number;

  @Column({  type: 'varchar', length: 50, collation: 'utf8mb4_unicode_ci' })
  subdivName: string;

  

}

@Entity()
export class mastersector{


  // Index on sectorid column
  @PrimaryGeneratedColumn()
  sectorid: number;

  @Column({  name: 'sectorname', type: 'varchar',  length: 150,  collation: 'utf8mb4_unicode_ci' })
  sectorname: string;
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
  @Column({   type: 'int',    collation: 'utf8mb4_unicode_ci'  })
  districtCode: number;

  @Index()
  @Column({  type: 'int',  collation: 'utf8mb4_unicode_ci' })
  blockCode: number;

  @Index()
  @PrimaryColumn({ name: 'gpCode', type: 'int',  collation: 'utf8mb4_unicode_ci' })
  gpCode: number;

  @Column({  name: 'gpName',  type: 'varchar',  length: 50,  collation: 'utf8mb4_unicode_ci'})
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

  @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  UpdateTime: Date;


}