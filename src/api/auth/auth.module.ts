import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { master_users } from 'src/entity/user.entity';
import { user_role } from 'src/entity/mastertable.enity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [

    TypeOrmModule.forFeature([user_role,master_users]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '20m' },
    }),
  ],




  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
