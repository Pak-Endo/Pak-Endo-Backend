/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  prefix: string

  @ApiProperty()
  phoneNumber: string

  @ApiProperty()
  gender: string;

  @ApiProperty()
  city: string;
}

export class AdminDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  prefix: string

  @ApiProperty()
  phoneNumber: string

  @ApiProperty()
  gender: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  role: string

  @ApiProperty()
  status: any
  
  @ApiProperty()
  memberID: any

  @ApiProperty()
  fullName: any
}
export class MemberCheckDto {
  @ApiProperty()
  memberID: string;
}

export class PasswordDto {
  @ApiProperty()
  userID: string

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmPassword: string
}

export class QueryParams {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number
}

export class approveDto {
  @ApiProperty()
  type: string;
}