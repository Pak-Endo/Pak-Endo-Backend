"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const mongoose_1 = require("@nestjs/mongoose");
const events_schema_1 = require("../../schemas/events.schema");
const events_controller_1 = require("./events.controller");
const gallery_schema_1 = require("../../schemas/gallery.schema");
const agenda_schema_1 = require("../../schemas/agenda.schema");
let EventsModule = exports.EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Events', schema: events_schema_1.EventSchema },
                { name: 'Gallery', schema: gallery_schema_1.GallerySchema },
                { name: 'Agenda', schema: agenda_schema_1.AgendaSchema },
            ])
        ],
        controllers: [events_controller_1.EventsController],
        providers: [events_service_1.EventsService]
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map