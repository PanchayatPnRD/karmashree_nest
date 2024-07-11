import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { master_users } from 'src/entity/user.entity';
import { masterdepartment, user_role } from 'src/entity/mastertable.enity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([user_role,master_users,masterdepartment]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '20m' },
    }),
  ],




  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
