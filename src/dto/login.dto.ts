/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto{

    @ApiProperty({
        example: 'PES/E/01',
        description: 'The member ID of the User',
        format: 'string',
      })
    @IsNotEmpty()
    memberID: string;

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

    
    @ApiProperty()
    deviceToken: string;

}