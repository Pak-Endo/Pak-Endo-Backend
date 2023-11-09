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
exports.VenueSchema = exports.Venue = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Venue = exports.Venue = class Venue extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Venue.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: false }),
    __metadata("design:type", String)
], Venue.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Venue.prototype, "venueName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [], required: false }),
    __metadata("design:type", Array)
], Venue.prototype, "halls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, required: false }),
    __metadata("design:type", Boolean)
], Venue.prototype, "deletedCheck", void 0);
exports.Venue = Venue = __decorate([
    (0, mongoose_1.Schema)()
], Venue);
exports.VenueSchema = mongoose_1.SchemaFactory.createForClass(Venue);
exports.VenueSchema.set('timestamps', true);
exports.VenueSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=venues.schema.js.map