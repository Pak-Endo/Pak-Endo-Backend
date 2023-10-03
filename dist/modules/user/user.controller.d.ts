import { UserService } from './user.service';
import { UserDto } from 'src/dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(limit?: number, offset?: number, name?: string): Promise<any>;
    getUserByID(userID: string): Promise<any>;
    addNewUser(newUser: UserDto): Promise<any>;
    updateUserById(userDto: UserDto, userID: string): Promise<any>;
    deleteUserByID(userID: string): Promise<any>;
}
