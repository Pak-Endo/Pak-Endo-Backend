/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto{

    @ApiProperty({
        example: 'admin@gmail.com',
        description: 'The email of the User',
        format: 'email',
      })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '12345678',
        description: 'The password of the User',
        format: 'string',
        minLength: 5,
        maxLength: 1024,
      })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    password: string;


}