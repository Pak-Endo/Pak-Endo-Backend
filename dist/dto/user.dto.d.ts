export declare class UserDto {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    prefix: string;
    phoneNumber: string;
    gender: string;
    city: string;
}
export declare class AdminDto {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
}
export declare class MemberCheckDto {
    memberID: string;
}
export declare class PasswordDto {
    userID: string;
    newPassword: string;
    confirmPassword: string;
}
export declare class QueryParams {
    limit: number;
    offset: number;
}
export declare class approveDto {
    type: string;
}
