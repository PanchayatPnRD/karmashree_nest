import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { master_zp, masterdepartment, user_role } from 'src/entity/mastertable.enity';
import { master_users } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Module({  imports: [

  TypeOrmModule.forFeature([user_role,master_users,master_zp,masterdepartment]),

],

  controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
