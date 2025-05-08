"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipeJogadorRepository = void 0;
const data_source_1 = require("../data-source");
const Equipe_Jogador_1 = require("../entities/Equipe_Jogador");
exports.equipeJogadorRepository = data_source_1.AppDataSource.getRepository(Equipe_Jogador_1.Equipe_Jogador);
