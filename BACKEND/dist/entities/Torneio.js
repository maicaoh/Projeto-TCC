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
exports.Torneio = void 0;
const typeorm_1 = require("typeorm");
const Equipe_1 = require("./Equipe");
const enums_1 = require("../Utils/enums/enums");
const Partida_1 = require("./Partida");
let Torneio = class Torneio {
};
exports.Torneio = Torneio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Torneio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Torneio.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Torneio.prototype, "updateAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bool', nullable: false }),
    __metadata("design:type", Boolean)
], Torneio.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], Torneio.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enums_1.StatusTorneio, default: enums_1.StatusTorneio.NAO_INICIADO }),
    __metadata("design:type", Number)
], Torneio.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: enums_1.TipoTorneio, default: enums_1.TipoTorneio.MATA_MATA }),
    __metadata("design:type", Number)
], Torneio.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Torneio.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: false }),
    __metadata("design:type", String)
], Torneio.prototype, "edicao", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Equipe_1.Equipe, equipe => equipe.torneios),
    (0, typeorm_1.JoinTable)({
        name: 'equipe_torneio',
        joinColumn: {
            name: 'torneioId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'equipeId',
            referencedColumnName: 'id'
        }
    }),
    __metadata("design:type", Array)
], Torneio.prototype, "equipes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Partida_1.Partida, partida => partida.torneio),
    __metadata("design:type", Array)
], Torneio.prototype, "partida", void 0);
exports.Torneio = Torneio = __decorate([
    (0, typeorm_1.Entity)("torneio")
], Torneio);
