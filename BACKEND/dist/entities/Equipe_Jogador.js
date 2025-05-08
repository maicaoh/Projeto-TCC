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
exports.Equipe_Jogador = void 0;
const typeorm_1 = require("typeorm");
const Equipe_1 = require("./Equipe");
const Jogador_1 = require("./Jogador");
let Equipe_Jogador = class Equipe_Jogador {
};
exports.Equipe_Jogador = Equipe_Jogador;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Equipe_Jogador.prototype, "equipeId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Equipe_Jogador.prototype, "jogadorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Jogador_1.Jogador, (jogador) => jogador.equipeJogador, { onDelete: "CASCADE" }),
    __metadata("design:type", Jogador_1.Jogador)
], Equipe_Jogador.prototype, "jogador", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipe_1.Equipe, (equipe) => equipe.equipeJogador, { onDelete: "CASCADE" }),
    __metadata("design:type", Equipe_1.Equipe)
], Equipe_Jogador.prototype, "equipe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Equipe_Jogador.prototype, "data_contratacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Equipe_Jogador.prototype, "data_desligamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], Equipe_Jogador.prototype, "dorsal", void 0);
exports.Equipe_Jogador = Equipe_Jogador = __decorate([
    (0, typeorm_1.Entity)('equipe_jogador')
], Equipe_Jogador);
