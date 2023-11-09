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
    deviceId: string;
    deviceToken: string;
    isAndroid: boolean;
}
export declare class AdminDto {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    prefix: string;
    phoneNumber: string;
    gender: string;
    city: string;
    role: string;
    status: any;
    memberID: any;
    fullName: any;
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
export declare class DeviceDto {
    email: string;
    deviceId: string;
    deviceToken: string;
    isAndroid: boolean;
}
