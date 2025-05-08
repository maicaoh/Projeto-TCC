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
exports.Equipe_Tecnico = void 0;
const typeorm_1 = require("typeorm");
const Equipe_1 = require("./Equipe");
const Coach_1 = require("./Coach");
let Equipe_Tecnico = class Equipe_Tecnico {
};
exports.Equipe_Tecnico = Equipe_Tecnico;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Equipe_Tecnico.prototype, "equipeId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Equipe_Tecnico.prototype, "coachId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coach_1.Coach, (coach) => coach.equipeTecnico, { onDelete: "CASCADE" }),
    __metadata("design:type", Coach_1.Coach)
], Equipe_Tecnico.prototype, "coach", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipe_1.Equipe, (equipe) => equipe.equipeTecnico, { onDelete: "CASCADE" }),
    __metadata("design:type", Equipe_1.Equipe)
], Equipe_Tecnico.prototype, "equipe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Equipe_Tecnico.prototype, "data_contratacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Equipe_Tecnico.prototype, "data_desligamento", void 0);
exports.Equipe_Tecnico = Equipe_Tecnico = __decorate([
    (0, typeorm_1.Entity)('equipe_tecnico')
], Equipe_Tecnico);
