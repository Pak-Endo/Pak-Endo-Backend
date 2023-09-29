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
exports.UserService = exports.SORT = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const user_dto_1 = require("../../dto/user.dto");
const user_schema_1 = require("../../schemas/user.schema");
const mail_service_1 = require("../mail/mail.service");
var SORT;
(function (SORT) {
    SORT["ASC"] = "Ascending";
    SORT["DESC"] = "Descending";
})(SORT || (exports.SORT = SORT = {}));
class UserQueryParams extends user_dto_1.QueryParams {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserQueryParams.prototype, "name", void 0);
let UserService = exports.UserService = class UserService {
    constructor(_userModel, mailer) {
        this._userModel = _userModel;
        this.mailer = mailer;
    }
    async getAllUsers(params) {
        params.limit = Number(params.limit) < 1 ? 10 : Number(params.limit);
        params.offset = Number(params.offset) < 0 ? 0 : Number(params.offset);
        const totalCount = await this._userModel.countDocuments({ deletedCheck: false });
        let filters = {}, sort = {};
        if (params.name) {
            let nameSort = SORT.ASC ? 1 : -1;
            sort = { ...sort, firstName: nameSort };
        }
        if (params.name.trim().length) {
            const query = new RegExp(`${params.name}`, 'i');
            filters = { ...filters, firstName: query };
        }
        const usersList = await this._userModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    role: user_schema_1.UserRole.MEMBER,
                    ...filters
                }
            },
            {
                $sort: Object.keys(sort).length > 0 ? sort : { createdAt: -1 }
            }
        ])
            .skip(Number(params.offset))
            .limit(Number(params.limit));
        return {
            users: usersList,
            totalCount: totalCount,
            currentCount: usersList.length
        };
    }
    async addNewUser(newUser) {
        const user = await this._userModel.findOne({ email: newUser.email });
        if (user) {
            throw new common_1.ForbiddenException('Email already exists');
        }
        let usersByMemberID = await this._userModel.aggregate([
            {
                $match: {
                    deletedCheck: false,
                    memberID: new RegExp(`/(?<=/)${newUser.type}(?=/)`)
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
        ]);
        if (usersByMemberID?.length > 0) {
            let newMemberID = usersByMemberID[0]?.memberIDCount?.slice(0, -1) + `0${Number(usersByMemberID[usersByMemberID?.length - 1]?.memberIDCount) + 1}`;
            let memberIDGen = `PES/${newUser?.type}/${newMemberID}`;
            newUser.memberID = memberIDGen;
        }
        else {
            let memberIDGen = `PES/${newUser?.type}/00`;
            newUser.memberID = memberIDGen;
        }
        newUser._id = new mongoose_2.Types.ObjectId().toString();
        newUser.role = 'member';
        newUser.fullName = newUser?.firstName + ' ' + newUser?.lastName;
        newUser.status = this.setStatus(newUser.status);
        await this.mailer.sendDefaultPasswordEmail(newUser);
        return await new this._userModel(newUser).save();
    }
    async getUserById(id) {
        let user = await this._userModel.findById({ _id: id, deletedCheck: false });
        if (!user) {
            throw new common_1.NotFoundException('User does not exist');
        }
        return user;
    }
    async updateUser(userDto, userId) {
        const user = await this._userModel.findOne({ _id: userId });
        if (!user) {
            throw new common_1.NotFoundException('User does not exist');
        }
        if (user.type !== userDto.type) {
            let usersByMemberID = await this._userModel.aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        memberID: new RegExp(`/(?<=/)${userDto.type}(?=/)`)
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
            ]);
            if (usersByMemberID?.length > 0) {
                let newMemberID = usersByMemberID[0]?.memberIDCount?.slice(0, -1) + `0${Number(usersByMemberID[usersByMemberID?.length - 1]?.memberIDCount) + 1}`;
                let memberIDGen = `PES/${userDto?.type}/${newMemberID}`;
                userDto.memberID = memberIDGen;
            }
            else {
                let memberIDGen = `PES/${userDto?.type}/00`;
                userDto.memberID = memberIDGen;
            }
        }
        if (typeof userDto.status == 'string') {
            userDto.status = this.setStatus(userDto.status);
        }
        userDto.fullName = userDto?.firstName + ' ' + userDto?.lastName;
        let updatedUser = await this._userModel.updateOne({ _id: userId }, userDto);
        if (updatedUser) {
            return await this._userModel.findOne({ _id: userId });
        }
    }
    async deleteUser(userID) {
        const event = await this._userModel.findOne({ _id: userID, deletedCheck: false });
        if (!event) {
            throw new common_1.NotFoundException('User not found');
        }
        return await this._userModel.updateOne({ _id: userID }, { deletedCheck: true });
    }
    setStatus(value) {
        if (value === 'Approved') {
            return user_schema_1.Status.APPROVED;
        }
        if (value === 'Rejected') {
            return user_schema_1.Status.REJECTED;
        }
        if (value === 'Pending') {
            return user_schema_1.Status.PENDING;
        }
        return user_schema_1.Status.BANNED;
    }
};
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model, mail_service_1.MailService])
], UserService);
//# sourceMappingURL=user.service.js.map