import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class jobcardformat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int',nullable: true   })
  nregaStateCode: number;

  @Column({ type: 'varchar', nullable: true  })
  nregaStateName: string;

  @Column({ type: 'int',nullable: true   })
  nregaDistrictCode: number;

  @Column({ type: 'varchar', nullable: true  })
  nregaDistrictName: string;

  @Column({ type: 'int',nullable: true   })
  nregaBlockCode: number;

  @Column({ type: 'varchar', nullable: true  })
  nregaBlockName: string;

  @Column({ type: 'int',nullable: true   })
  nregaPanchCode: number;

  @Column({ type: 'varchar', nullable: true  })
  nregaPanchayatName: string;

  @Column({ type: 'int',nullable: true   })
  lgdStateCode: number;

  @Column({ type: 'varchar', nullable: true  })
  lgdStateName: string;

  @Column({ type: 'int',nullable: true   })
  lgdDistrictCode: number;

  @Column({ type: 'varchar', nullable: true  })
  lgdDistrictName: string;

  @Column({ type: 'int',nullable: true   })
  lgdBlockCode: number;

  @Column({ type: 'varchar', nullable: true  })
  lgdBlockName: string;

  @Column({ type: 'int',nullable: true   })
  lgdPanchCode: number;

  @Column({ type: 'varchar', nullable: true  })
  lgdPanchName: string;

  @Column({  nullable: true  })
  is_deleted:boolean;

  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submitTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updateTime: Date;
}