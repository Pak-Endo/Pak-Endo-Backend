"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeakersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const speakers_schema_1 = require("../../schemas/speakers.schema");
const speakers_controller_1 = require("./speakers.controller");
const speakers_service_1 = require("./speakers.service");
let SpeakersModule = exports.SpeakersModule = class SpeakersModule {
};
exports.SpeakersModule = SpeakersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Speakers', schema: speakers_schema_1.SpeakerSchema }
            ])
        ],
        controllers: [speakers_controller_1.SpeakerController],
        providers: [speakers_service_1.SpeakerService]
    })
], SpeakersModule);
//# sourceMappingURL=speakers.module.js.map