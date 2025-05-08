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
exports.Equipe_Partida = void 0;
const typeorm_1 = require("typeorm");
const Equipe_1 = require("./Equipe");
const Partida_1 = require("./Partida");
const Torneio_1 = require("./Torneio");
let Equipe_Partida = class Equipe_Partida {
};
exports.Equipe_Partida = Equipe_Partida;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Equipe_Partida.prototype, "partidaId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Equipe_Partida.prototype, "casaId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Equipe_Partida.prototype, "visitanteId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Partida_1.Partida, (partida) => partida.equipePartida, { onDelete: "CASCADE" }),
    __metadata("design:type", Partida_1.Partida)
], Equipe_Partida.prototype, "partida", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipe_1.Equipe, (equipe) => equipe.equipeCasa, { onDelete: "CASCADE" }),
    __metadata("design:type", Equipe_1.Equipe)
], Equipe_Partida.prototype, "casa", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipe_1.Equipe, (equipe) => equipe.equipeVisitante, { onDelete: "CASCADE" }),
    __metadata("design:type", Equipe_1.Equipe)
], Equipe_Partida.prototype, "visitante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipe_1.Equipe, (equipe) => equipe.equipeCasa, { onDelete: "CASCADE" }),
    __metadata("design:type", Torneio_1.Torneio)
], Equipe_Partida.prototype, "torneio", void 0);
exports.Equipe_Partida = Equipe_Partida = __decorate([
    (0, typeorm_1.Entity)('equipe_partida')
], Equipe_Partida);
