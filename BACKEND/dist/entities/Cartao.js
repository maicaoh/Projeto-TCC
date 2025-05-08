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
exports.Cartao = void 0;
const typeorm_1 = require("typeorm");
const Partida_1 = require("./Partida");
const Jogador_1 = require("./Jogador");
const Arbitro_1 = require("./Arbitro");
const Equipe_1 = require("./Equipe");
const enums_1 = require("../Utils/enums/enums");
let Cartao = class Cartao {
};
exports.Cartao = Cartao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Cartao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Cartao.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Cartao.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Cartao.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enums_1.TipoCartao }),
    __metadata("design:type", Number)
], Cartao.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time", nullable: false }),
    __metadata("design:type", String)
], Cartao.prototype, "tempo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], Cartao.prototype, "local", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Cartao.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Jogador_1.Jogador, (jogador) => jogador.jogadorCartao),
    __metadata("design:type", Jogador_1.Jogador)
], Cartao.prototype, "jogador", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Partida_1.Partida, (partida) => partida.partidaCartao),
    __metadata("design:type", Partida_1.Partida)
], Cartao.prototype, "partida", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Arbitro_1.Arbitro, (arbitro) => arbitro.arbitroCartao),
    __metadata("design:type", Arbitro_1.Arbitro)
], Cartao.prototype, "arbitro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Equipe_1.Equipe, (equipe) => equipe.cartao),
    __metadata("design:type", Equipe_1.Equipe)
], Cartao.prototype, "equipe", void 0);
exports.Cartao = Cartao = __decorate([
    (0, typeorm_1.Entity)("cartao")
], Cartao);
