import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { gram_panchayat, master_ps, master_subdivision, master_zp, masterdepartment, masterdesignation, user_role } from 'src/entity/mastertable.enity';
import { master_users } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { Libariry } from 'src/entity/library.entity';

@Module({  imports: [

  TypeOrmModule.forFeature([user_role,master_users,master_zp,masterdepartment,master_subdivision,master_ps,gram_panchayat,masterdesignation,Libariry]),

],

  controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
