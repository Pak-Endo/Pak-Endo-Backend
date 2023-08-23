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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const user_dto_1 = require("../../dto/user.dto");
const login_dto_1 = require("../../dto/login.dto");
const admin_login_dto_1 = require("../../dto/admin-login.dto");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return await this.authService.loginUser(loginDto);
    }
    async signup(signupDto) {
        return await this.authService.registerUser(signupDto);
    }
    async AddAdminUser(signupDto) {
        return await this.authService.addAdmin(signupDto);
    }
    async checkMember(memberDto) {
        return await this.authService.checkIfMemberIDExistsWithPassword(memberDto?.memberID);
    }
    async loginAdmin(loginDto) {
        return await this.authService.loginUser(loginDto);
    }
    async sendForgotPassEmail(email) {
        return await this.authService.forgotPassword(email);
    }
    async resetUserPassword(passDto) {
        return await this.authService.resetPassword(passDto);
    }
    async approveUser(userData, id) {
        return await this.authService.approveUser(id, userData);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('addAdmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "AddAdminUser", null);
__decorate([
    (0, common_1.Post)('checkIfMemberExistsWithPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.MemberCheckDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkMember", null);
__decorate([
    (0, common_1.Post)('loginAdmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.Post)('forgotPassword/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendForgotPassEmail", null);
__decorate([
    (0, common_1.Post)('resetPassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.PasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetUserPassword", null);
__decorate([
    (0, common_1.Put)('approveUser/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.approveDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "approveUser", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map