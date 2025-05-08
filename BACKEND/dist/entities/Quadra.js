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
exports.Quadra = void 0;
const typeorm_1 = require("typeorm");
const Partida_1 = require("./Partida");
let Quadra = class Quadra {
};
exports.Quadra = Quadra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Quadra.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quadra.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Quadra.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Quadra.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Quadra.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 6, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Quadra.prototype, "comprimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 6, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Quadra.prototype, "largura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quadra.prototype, "endereco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quadra.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quadra.prototype, "piso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quadra.prototype, "responsavel", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Partida_1.Partida, (partida) => partida.quadra),
    __metadata("design:type", Array)
], Quadra.prototype, "partida", void 0);
exports.Quadra = Quadra = __decorate([
    (0, typeorm_1.Entity)("quadra")
], Quadra);
