import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Libariry {
    @PrimaryGeneratedColumn()
    doc_id: number;


    @Column({  nullable: true  })
    category: string;

    @Column({  nullable: true  })
    caption: string;

    @Column({  nullable: true  })
    YoutubeLink: string;

    @Column({  nullable: true  })
    UploadFileLink: string;


 
    @Column({ type: 'varchar', nullable: true  })
    status: string;

    @Column({  nullable: true  })
    pedastal: string;
    
    @Column({  nullable: true  })
    base64: string;

    @Column({  nullable: true  })
    orderno: string;
    
 
    @Column({  nullable: true  })
    orderDate: Date;
 

    @Column({ type: 'varchar', nullable: true  })
    ex1: string;

    @Column({  nullable: true  })
  originalFilename: string; // This will store the original filename of the uploaded file

  @Column({  nullable: true  })
  mimeType: string; // This will store the MIME type of the uploaded file

  @Column({  nullable: true  })
  fileBuffer: Buffer; 


    @Column({ type: 'varchar',comment:'1 for delete 0 for not delete', nullable: true  })
    is_deleted: string;


    
    @Column({ type: 'int' })
    userIndex: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    submitTime: Date;

    @Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    UpdateTime: Date;
}

