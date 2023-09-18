"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const config_2 = require("./config");
const user_module_1 = require("./modules/user/user.module");
const events_module_1 = require("./modules/events/events.module");
const media_upload_module_1 = require("./modules/media-upload/media-upload.module");
const schedule_1 = require("@nestjs/schedule");
const cronjobs_module_1 = require("./modules/cronjobs/cronjobs.module");
const favorites_module_1 = require("./modules/favorites/favorites.module");
const attended_module_1 = require("./modules/attended/attended.module");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: 'src/config/development.env',
                isGlobal: true
            }),
            mongoose_1.MongooseModule.forRoot(config_2.default.mongoURI),
            auth_module_1.AuthModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            user_module_1.UserModule,
            events_module_1.EventsModule,
            favorites_module_1.FavoritesModule,
            attended_module_1.AttendedModule,
            media_upload_module_1.MediaUploadModule,
            cronjobs_module_1.CronjobsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map