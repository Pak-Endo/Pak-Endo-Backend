"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../../schemas/user.schema");
const mail_service_1 = require("../mail/mail.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(_userModel, jwtService, mailService) {
        this._userModel = _userModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    generateToken(payload) {
        return {
            access_token: `Bearer ${this.jwtService.sign(payload)}`
        };
    }
    async commonLoginMethod(user, password) {
        if (!user) {
            throw new common_1.UnauthorizedException('Incorrect Credentials');
        }
        if (user?.status !== user_schema_1.Status.APPROVED) {
            throw new common_1.UnauthorizedException('Your account is still pending for approval');
        }
        const isValidCredentials = await bcrypt.compare(password, user.password);
        if (!isValidCredentials) {
            throw new common_1.UnauthorizedException('Incorrect Credentials');
        }
        !user.fullName ? user.fullName = user?.prefix + ' ' + user?.firstName + ' ' + user?.lastName : user.fullName;
        user = JSON.parse(JSON.stringify(user));
        delete user.password;
        const token = this.generateToken(user);
        return { user, token: token.access_token };
    }
    async registerUser(newUser) {
        const user = await this._userModel.findOne({ email: newUser.email });
        if (user) {
            throw new common_1.ForbiddenException('Email already exists');
        }
        newUser.status = user_schema_1.Status.PENDING;
        newUser._id = new mongoose_2.Types.ObjectId().toString();
        newUser.role = 'member';
        newUser.fullName = newUser?.prefix + ' ' + newUser?.firstName + ' ' + newUser?.lastName;
        await this.mailService.sendApprovalRequestToAdmin(newUser);
        return await new this._userModel(newUser).save();
    }
    async registerAdmin(newUser) {
        const user = await this._userModel.findOne({ email: newUser.email });
        if (user) {
            throw new common_1.ForbiddenException('Email already exists');
        }
        let adminExists = await this._userModel.findOne({ role: user_schema_1.UserRole.ADMIN });
        if (adminExists) {
            throw new common_1.ForbiddenException('Admin user already exists');
        }
        newUser.status = user_schema_1.Status.APPROVED;
        newUser._id = new mongoose_2.Types.ObjectId().toString();
        newUser.role = 'admin';
        newUser.memberID = 'PES/SA/00';
        newUser.fullName = newUser?.prefix + ' ' + newUser?.firstName + ' ' + newUser?.lastName;
        return await new this._userModel(newUser).save();
    }
    async loginUser(loginDto) {
        if (loginDto?.memberID) {
            let user = await this._userModel.findOne({ $or: [
                    { memberID: loginDto.memberID },
                    { email: loginDto.memberID }
                ],
                deletedCheck: false,
                status: user_schema_1.Status.APPROVED
            });
            return this.commonLoginMethod(user, loginDto?.password);
        }
        let user = await this._userModel.findOne({ email: loginDto.email, deletedCheck: false, status: user_schema_1.Status.APPROVED });
        if (user?.role !== user_schema_1.UserRole.ADMIN) {
            throw new common_1.UnauthorizedException('Incorrect Credentials');
        }
        return this.commonLoginMethod(user, loginDto?.password);
    }
    async checkIfMemberIDExistsWithPassword(memberID) {
        const user = await this._userModel.findOne({
            memberID: memberID
        });
        if (user) {
            return user?.password ? true : false;
        }
        return false;
    }
    async checkIfMemberIDExists(memberID) {
        const user = await this._userModel.findOne({
            memberID: memberID
        });
        return user ? true : false;
    }
    async forgotPassword(email) {
        let user = await this._userModel.findOne({ email: email, deletedCheck: false });
        if (!user) {
            throw new common_1.NotFoundException('This email is not registered to a user');
        }
        const token = Math.floor(10000 + Math.random() * 90000).toString();
        let emailNotif = await this.mailService.sendUserConfirmation(user, token);
        if (!emailNotif) {
            throw new common_1.BadRequestException('Something went wrong. Please try again');
        }
        return { message: 'An email with the link to reset your password has been sent!' };
    }
    async resetPassword(passwordDto) {
        let user = await this._userModel.findOne({ _id: passwordDto?.userID, deletedCheck: false });
        if (!user) {
            throw new common_1.NotFoundException('User does not exist');
        }
        if (passwordDto?.newPassword?.trim() !== passwordDto?.confirmPassword?.trim()) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const salt = await bcrypt.genSalt();
        let password = await bcrypt.hash(passwordDto?.newPassword, salt);
        if (!password) {
            throw new common_1.BadRequestException('Failed to generate password. Please try again');
        }
        let updatedUser = await this._userModel.updateOne({ _id: passwordDto?.userID }, { password: password });
        if (updatedUser) {
            return { message: 'Password saved. User updated successfully' };
        }
    }
    async approveUser(id, userData) {
        let user = await this._userModel.findById({ _id: id, deletedCheck: false });
        if (!user) {
            throw new common_1.NotFoundException('User does not exist');
        }
        if (user?.memberID || user?.memberID !== "") {
            throw new common_1.BadRequestException('User is already approved');
        }
        if (!user?.memberID || user?.memberID == "") {
            let usersByMemberID = await this._userModel.aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        memberID: new RegExp(`/(?<=/)${userData.type}(?=/)`)
                    }
                },
                {
                    $project: {
                        _id: 0,
                        memberID: 1,
                        memberIDCount: {
                            $substrBytes: [
                                "$memberID", 7, 1
                            ]
                        }
                    }
                }
            ]).sort({ memberID: -1 });
            let data = new Object(user_schema_1.Type);
            let memberShipType = '';
            for (const key in data) {
                if (key == userData.type) {
                    memberShipType = data[key];
                }
            }
            if (usersByMemberID?.length > 0) {
                let newMemberID = usersByMemberID[0]?.memberIDCount?.slice(0, -1) + `0${Number(usersByMemberID[usersByMemberID?.length - 1]?.memberIDCount) + 1}`;
                let memberIDGen = `PES/${userData?.type}/${newMemberID}`;
                let emailNotif = await this.mailService.sendEmailToMember(user, memberIDGen, memberShipType);
                if (!emailNotif) {
                    throw new common_1.BadRequestException('Something went wrong. Please try again');
                }
                return await this._userModel.updateOne({ _id: id, deletedCheck: false }, { ...userData, status: user_schema_1.Status.APPROVED, memberID: memberIDGen });
            }
            else {
                let memberIDGen = `PES/${userData?.type}/00`;
                let emailNotif = await this.mailService.sendEmailToMember(user, memberIDGen, memberShipType);
                if (!emailNotif) {
                    throw new common_1.BadRequestException('Something went wrong. Please try again');
                }
                return await this._userModel.updateOne({ _id: id, deletedCheck: false }, { ...userData, status: user_schema_1.Status.APPROVED, memberID: memberIDGen });
            }
        }
        return await this._userModel.updateOne({ _id: id, deletedCheck: false }, { ...userData, status: user_schema_1.Status.APPROVED });
    }
    async deleteAllUsers() {
        return await this._userModel.deleteMany({});
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map