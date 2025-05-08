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
exports.Equipe = void 0;
const typeorm_1 = require("typeorm");
const Equipe_Tecnico_1 = require("./Equipe_Tecnico");
const Equipe_Jogador_1 = require("./Equipe_Jogador");
const Torneio_1 = require("./Torneio");
const Equipe_Partida_1 = require("./Equipe_Partida");
const Gol_1 = require("./Gol");
const Finalizacao_1 = require("./Finalizacao");
const Drible_1 = require("./Drible");
const Desarme_1 = require("./Desarme");
const Falta_1 = require("./Falta");
const Cartao_1 = require("./Cartao");
let Equipe = class Equipe {
};
exports.Equipe = Equipe;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Equipe.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Equipe.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Equipe.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Equipe.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Equipe.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Equipe.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Equipe.prototype, "endereco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: false }),
    __metadata("design:type", String)
], Equipe.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Equipe_Tecnico_1.Equipe_Tecnico, equipeTecnico => equipeTecnico.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "equipeTecnico", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Equipe_Jogador_1.Equipe_Jogador, equipeJogador => equipeJogador.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "equipeJogador", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Torneio_1.Torneio, torneio => torneio.equipes),
    __metadata("design:type", Array)
], Equipe.prototype, "torneios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Equipe_Partida_1.Equipe_Partida, equipePartida => equipePartida.casaId),
    __metadata("design:type", Array)
], Equipe.prototype, "equipeCasa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Equipe_Partida_1.Equipe_Partida, equipePartida => equipePartida.visitanteId),
    __metadata("design:type", Array)
], Equipe.prototype, "equipeVisitante", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Gol_1.Gol, (gol) => gol.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "equipeGol", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Finalizacao_1.Finalizacao, (finalizacao) => finalizacao.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "equipeFinalizacao", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Drible_1.Drible, (drible) => drible.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "drible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Desarme_1.Desarme, (desarme) => desarme.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "desarme", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Falta_1.Falta, (falta) => falta.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "falta", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cartao_1.Cartao, (cartao) => cartao.equipe),
    __metadata("design:type", Array)
], Equipe.prototype, "cartao", void 0);
exports.Equipe = Equipe = __decorate([
    (0, typeorm_1.Entity)('equipe')
], Equipe);
