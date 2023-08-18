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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.Status = exports.UserRole = exports.Type = exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("@nestjs/mongoose");
let User = exports.User = class User extends mongoose_1.Document {
};
__decorate([
    (0, mongoose_2.Prop)({ default: '' }),
    __metadata("design:type", String)
], User.prototype, "_id", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], User.prototype, "prefix", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], User.prototype, "memberID", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: 2, required: false }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: false, required: false }),
    __metadata("design:type", Boolean)
], User.prototype, "deletedCheck", void 0);
exports.User = User = __decorate([
    (0, mongoose_2.Schema)()
], User);
exports.UserSchema = mongoose_2.SchemaFactory.createForClass(User);
exports.UserSchema.set('timestamps', true);
exports.UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
exports.UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    this.email = this.email.toLowerCase();
    next();
});
var Type;
(function (Type) {
    Type["E"] = "PES Executive Member";
    Type["H"] = "PES Honorary Member";
    Type["I"] = "International Executive Membership";
    Type["S"] = "Scientific Members";
    Type["SE"] = "Scientific Executive Members";
})(Type || (exports.Type = Type = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MEMBER"] = "member";
})(UserRole || (exports.UserRole = UserRole = {}));
var Status;
(function (Status) {
    Status[Status["APPROVED"] = 1] = "APPROVED";
    Status[Status["PENDING"] = 2] = "PENDING";
    Status[Status["REJECTED"] = 3] = "REJECTED";
    Status[Status["BANNED"] = 4] = "BANNED";
})(Status || (exports.Status = Status = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "Male";
    Gender["FEMALE"] = "Female";
    Gender["OTHER"] = "Other";
})(Gender || (exports.Gender = Gender = {}));
//# sourceMappingURL=user.schema.js.map