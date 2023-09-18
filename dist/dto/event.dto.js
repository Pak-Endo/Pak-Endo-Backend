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
exports.EventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const events_schema_1 = require("../schemas/events.schema");
const gallery_schema_1 = require("../schemas/gallery.schema");
class EventDto {
}
exports.EventDto = EventDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], EventDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], EventDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "featuredImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            mediaUrl: ['']
        }
    }),
    __metadata("design:type", gallery_schema_1.Gallery)
], EventDto.prototype, "gallery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "eventStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], EventDto.prototype, "deletedCheck", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "streamUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "organizer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], EventDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], EventDto.prototype, "openForPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EventDto.prototype, "organizerContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                _id: '',
                from: '',
                day: 0,
                agendaTitle: '',
                to: '',
                venue: '',
                streamUrl: '',
                speaker: ''
            }
        ]
    }),
    __metadata("design:type", Array)
], EventDto.prototype, "agenda", void 0);
//# sourceMappingURL=event.dto.js.map