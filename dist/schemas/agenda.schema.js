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
exports.AgendaSchema = exports.Agenda = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const events_schema_1 = require("./events.schema");
let Agenda = exports.Agenda = class Agenda extends Document {
};
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Agenda.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Agenda.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Agenda.prototype, "day", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", Number)
], Agenda.prototype, "from", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", Number)
], Agenda.prototype, "to", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Agenda.prototype, "venue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", events_schema_1.Speaker)
], Agenda.prototype, "speaker", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', required: true }),
    __metadata("design:type", String)
], Agenda.prototype, "streamUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, required: false }),
    __metadata("design:type", Boolean)
], Agenda.prototype, "deletedCheck", void 0);
exports.Agenda = Agenda = __decorate([
    (0, mongoose_1.Schema)()
], Agenda);
exports.AgendaSchema = mongoose_1.SchemaFactory.createForClass(Agenda);
exports.AgendaSchema.set('timestamps', true);
exports.AgendaSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=agenda.schema.js.map