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
exports.Arbitro = void 0;
const typeorm_1 = require("typeorm");
const Partida_1 = require("./Partida");
const Falta_1 = require("./Falta");
let Arbitro = class Arbitro {
};
exports.Arbitro = Arbitro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Arbitro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Arbitro.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Arbitro.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Arbitro.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Arbitro.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Arbitro.prototype, "apelido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 11, nullable: true }),
    __metadata("design:type", String)
], Arbitro.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], Arbitro.prototype, "dataNascimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Arbitro.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Arbitro.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Arbitro.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Partida_1.Partida, partida => partida.arbitro),
    __metadata("design:type", Array)
], Arbitro.prototype, "partida", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Falta_1.Falta, (falta) => falta.arbitro),
    __metadata("design:type", Array)
], Arbitro.prototype, "falta", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Arbitro, (arbitro) => arbitro.arbitroCartao),
    __metadata("design:type", Array)
], Arbitro.prototype, "arbitroCartao", void 0);
exports.Arbitro = Arbitro = __decorate([
    (0, typeorm_1.Entity)("arbitro")
], Arbitro);
