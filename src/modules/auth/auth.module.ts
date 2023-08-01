import { DynamicModule, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './jwt-strategy';
import { UserSchema } from 'src/schemas/user.schema';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        JwtModule.register({
          secret: config.SECRET_KEY,
          signOptions: { expiresIn: '3600s'}
        }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema}]),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
      module: AuthModule
    }
  }
}
