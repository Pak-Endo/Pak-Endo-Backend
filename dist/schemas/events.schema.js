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
exports.EventStatus = exports.EventSchema = exports.Event = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const gallery_schema_1 = require("./gallery.schema");
let Event = exports.Event = class Event extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Event.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", Number)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", Number)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Event.prototype, "featuredImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: {}, required: false }),
    __metadata("design:type", gallery_schema_1.Gallery)
], Event.prototype, "gallery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, required: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "deletedCheck", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'upcoming', required: false }),
    __metadata("design:type", String)
], Event.prototype, "eventStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [], required: true }),
    __metadata("design:type", Array)
], Event.prototype, "agenda", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Event.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], Event.prototype, "organizer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], Event.prototype, "organizerContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, required: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "openForPublic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: false }),
    __metadata("design:type", Number)
], Event.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, required: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isFavorite", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, required: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isAttended", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)()
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);
exports.EventSchema.set('timestamps', true);
exports.EventSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
var EventStatus;
(function (EventStatus) {
    EventStatus["ONGOING"] = "ongoing";
    EventStatus["UPCOMING"] = "upcoming";
    EventStatus["FINSIHED"] = "finished";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
//# sourceMappingURL=events.schema.js.map