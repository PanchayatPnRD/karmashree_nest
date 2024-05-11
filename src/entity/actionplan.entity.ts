

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Actionplan_master {
    @PrimaryGeneratedColumn()
    actionSL: number;

    @Column({ type: 'int' })
    departmentNo: number;

    @Column({ type: 'int' ,  comment: '	No of Schemes Proposed (Out of Col 7)', nullable: true })
    schemeSector: number;

    @Column({ type: 'varchar', length: 6,comment:'RURAL=>R,URBEN=>U	', nullable: true  })
    schemeArea: string;

    @Column({ type: 'int', nullable: true  })
    districtCode: number;

    
    @Column({ type: 'int', nullable: true  })
    blockCode: number;

    @Column({ type: 'int', nullable: true  })
    gpCode: number;

    @Column({ type: 'int', nullable: true  })
    municipalityCode: number;



    @Column({ type: 'varchar', length: 10, nullable: true  })
    finYear: string;

    @Column({ type: 'int', nullable: true  })
    acMonth: number;

    @Column({ type: 'int', nullable: true  })
    acYear: number;

    @Column({ type: 'double',  precision: 19, scale: 2 , comment: '		Tentative Total Cost of Schemes', nullable: true })
    tentativeCostOfScheme: number;

    @Column({ type: 'double',  precision: 19, scale: 2 ,   comment: '	Tentative Total Wage to be paid in the Schemes', nullable: true })
    totWagesPaid: number;

    @Column({ type: 'int',  comment: '	Total Persondays to be Generated', nullable: true })
    totPersonDays: number;

    @Column({ type: 'int',  comment: '	Total no. of Job Card Holders to be engaged', nullable: true })
    totJobCard: number;

    @Column({ type: 'int',  comment: '		Average Days of Employment to be provided per family', nullable: true })
    averageDays: number;


    @Column({ type: 'varchar', nullable: true  })
    ex1: string;

    @Column({ type: 'varchar', nullable: true  })
    ex2: string;

    @Column({ type: 'varchar' , nullable: true })
    ex3: string;

    @Column({ type: 'varchar' , nullable: true })
    ex4: string;

    @Column({ type: 'varchar', nullable: true  })
    ex5: string;

    @Column({ type: 'varchar',comment:'1 for delete 0 for not delete', nullable: true  })
    is_deleted: string;


    @Column({ type: 'int' , nullable: true })
    schemeProposed:number;
    
    @Column({ type: 'int' })
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}

