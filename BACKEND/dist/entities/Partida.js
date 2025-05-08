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
exports.Partida = void 0;
const typeorm_1 = require("typeorm");
const Equipe_Partida_1 = require("./Equipe_Partida");
const Arbitro_1 = require("./Arbitro");
const Quadra_1 = require("./Quadra");
const Gol_1 = require("./Gol");
const Finalizacao_1 = require("./Finalizacao");
const Drible_1 = require("./Drible");
const Desarme_1 = require("./Desarme");
const Falta_1 = require("./Falta");
const Cartao_1 = require("./Cartao");
const Torneio_1 = require("./Torneio");
let Partida = class Partida {
};
exports.Partida = Partida;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Partida.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Partida.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Partida.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Partida.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], Partida.prototype, "publicoPresente", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Equipe_Partida_1.Equipe_Partida, equipePartida => equipePartida.partida),
    __metadata("design:type", Array)
], Partida.prototype, "equipePartida", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Arbitro_1.Arbitro, arbitro => arbitro.partida),
    (0, typeorm_1.JoinTable)({
        name: 'partida_arbitro',
        joinColumn: {
            name: 'partidaId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'arbitroId',
            referencedColumnName: 'id'
        }
    }),
    __metadata("design:type", Array)
], Partida.prototype, "arbitro", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Quadra_1.Quadra, (quadra) => quadra.partida),
    __metadata("design:type", Quadra_1.Quadra)
], Partida.prototype, "quadra", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Gol_1.Gol, (gol) => gol.partida),
    __metadata("design:type", Array)
], Partida.prototype, "gol", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Finalizacao_1.Finalizacao, (finalizacao) => finalizacao.partida),
    __metadata("design:type", Array)
], Partida.prototype, "finalizacao", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Drible_1.Drible, (drible) => drible.partida),
    __metadata("design:type", Array)
], Partida.prototype, "drible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Desarme_1.Desarme, (desarme) => desarme.partida),
    __metadata("design:type", Array)
], Partida.prototype, "desarme", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Falta_1.Falta, (falta) => falta.partida),
    __metadata("design:type", Array)
], Partida.prototype, "falta", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cartao_1.Cartao, (cartao) => cartao.partida),
    __metadata("design:type", Array)
], Partida.prototype, "partidaCartao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Torneio_1.Torneio, torneio => torneio.partida),
    __metadata("design:type", Torneio_1.Torneio)
], Partida.prototype, "torneio", void 0);
exports.Partida = Partida = __decorate([
    (0, typeorm_1.Entity)("partida")
], Partida);
