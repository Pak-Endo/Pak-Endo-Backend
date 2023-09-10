import { Model } from 'mongoose';
import { QueryParams } from 'src/dto/user.dto';
import { Status, User } from 'src/schemas/user.schema';
export declare enum SORT {
    ASC = "Ascending",
    DESC = "Descending"
}
declare class UserQueryParams extends QueryParams {
    name?: string;
}
export declare class UserService {
    private readonly _userModel;
    constructor(_userModel: Model<User>);
    getAllUsers(params: UserQueryParams): Promise<any>;
    addNewUser(newUser: User | any): Promise<any>;
    getUserById(id: string): Promise<any>;
    updateUser(userDto: User | any, userId: string): Promise<any>;
    deleteUser(userID: string): Promise<any>;
    setStatus(value: string): Status;
}
export {};
