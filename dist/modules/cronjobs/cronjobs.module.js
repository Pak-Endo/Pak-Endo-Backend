"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronjobsModule = void 0;
const common_1 = require("@nestjs/common");
const cronjobs_service_1 = require("./cronjobs.service");
const mongoose_1 = require("@nestjs/mongoose");
const events_schema_1 = require("../../schemas/events.schema");
const user_schema_1 = require("../../schemas/user.schema");
let CronjobsModule = exports.CronjobsModule = class CronjobsModule {
};
exports.CronjobsModule = CronjobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Events', schema: events_schema_1.EventSchema },
                { name: 'User', schema: user_schema_1.UserSchema }
            ])
        ],
        providers: [cronjobs_service_1.CronjobsService]
    })
], CronjobsModule);
//# sourceMappingURL=cronjobs.module.js.map