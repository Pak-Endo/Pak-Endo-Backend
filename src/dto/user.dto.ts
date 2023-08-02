/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    _id: string

    @ApiProperty()
    firstName: string

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    prefix: string

    @ApiProperty()
    memberID: string

    @ApiProperty()
    type: string

    @ApiProperty()
    role: string

    @ApiProperty()
    phoneNumber: string

    @ApiProperty()
    deletedCheck: boolean;
}

export class AdminDto {
    @ApiProperty()
    _id: string

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    role: string
}
export class MemberCheckDto {
    @ApiProperty()
    memberID: string;
}