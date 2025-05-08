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
exports.Desarme = void 0;
const typeorm_1 = require("typeorm");
const Partida_1 = require("./Partida");
const Jogador_1 = require("./Jogador");
const Equipe_1 = require("./Equipe");
const enums_1 = require("../Utils/enums/enums");
let Desarme = class Desarme {
};
exports.Desarme = Desarme;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Desarme.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Desarme.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Desarme.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Desarme.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Desarme.prototype, "sucesso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enums_1.Pe }),
    __metadata("design:type", String)
], Desarme.prototype, "pe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], Desarme.prototype, "local", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time", nullable: false }),
    __metadata("design:type", String)
], Desarme.prototype, "tempo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Jogador_1.Jogador, (jogador) => jogador.jogadorDesarme),
    __metadata("design:type", Jogador_1.Jogador)
], Desarme.prototype, "jogadorDesarme", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Jogador_1.Jogador, (jogador) => jogador.jogadorDesarmado),
    __metadata("design:type", Jogador_1.Jogador)
], Desarme.prototype, "jogadorDesarmado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Partida_1.Partida, (partida) => partida.desarme),
    __metadata("design:type", Partida_1.Partida)
], Desarme.prototype, "partida", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipe_1.Equipe, (equipe) => equipe.desarme),
    __metadata("design:type", Equipe_1.Equipe)
], Desarme.prototype, "equipe", void 0);
exports.Desarme = Desarme = __decorate([
    (0, typeorm_1.Entity)("desarme")
], Desarme);
