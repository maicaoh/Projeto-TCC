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
exports.Jogador = void 0;
const typeorm_1 = require("typeorm");
const Equipe_Jogador_1 = require("./Equipe_Jogador");
const Gol_1 = require("./Gol");
const Finalizacao_1 = require("./Finalizacao");
const Drible_1 = require("./Drible");
const Desarme_1 = require("./Desarme");
const Falta_1 = require("./Falta");
const Cartao_1 = require("./Cartao");
let Jogador = class Jogador {
};
exports.Jogador = Jogador;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Jogador.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Jogador.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Jogador.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Jogador.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Jogador.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "smallint", default: 1, nullable: false }) // 1 = Direito, 0 = Esquerdo
    ,
    __metadata("design:type", Number)
], Jogador.prototype, "peDominante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Jogador.prototype, "apelido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], Jogador.prototype, "dataNascimento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Jogador.prototype, "posicao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Jogador.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 3, scale: 2, nullable: false }) // Exemplo: 1.89
    ,
    __metadata("design:type", Number)
], Jogador.prototype, "altura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 11, nullable: true }),
    __metadata("design:type", String)
], Jogador.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Jogador.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Jogador.prototype, "cidadeNatal", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Equipe_Jogador_1.Equipe_Jogador, equipeJogador => equipeJogador.jogador),
    __metadata("design:type", Array)
], Jogador.prototype, "equipeJogador", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Gol_1.Gol, (gol) => gol.jogador),
    __metadata("design:type", Array)
], Jogador.prototype, "gols", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Gol_1.Gol, (gol) => gol.jogadorDefensor),
    __metadata("design:type", Array)
], Jogador.prototype, "golDefensor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Finalizacao_1.Finalizacao, (finalizacao) => finalizacao.jogadorAtacante),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorFinalizador", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Finalizacao_1.Finalizacao, (finalizacao) => finalizacao.jogadorDefensor),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorDefensor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Drible_1.Drible, (drible) => drible.jogadorAtacante),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorDrible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Drible_1.Drible, (drible) => drible.jogadorDefensor),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorDefensorDrible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Desarme_1.Desarme, (desarme) => desarme.jogadorDesarme),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorDesarme", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Desarme_1.Desarme, (desarme) => desarme.jogadorDesarmado),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorDesarmado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Falta_1.Falta, (falta) => falta.jogadorAutor),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorAutor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Falta_1.Falta, (falta) => falta.jogadorSofreu),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorSofreu", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cartao_1.Cartao, (cartao) => cartao.jogador),
    __metadata("design:type", Array)
], Jogador.prototype, "jogadorCartao", void 0);
exports.Jogador = Jogador = __decorate([
    (0, typeorm_1.Entity)("jogador")
], Jogador);
