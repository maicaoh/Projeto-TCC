"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partidaRepository = void 0;
const data_source_1 = require("../data-source");
const Partida_1 = require("../entities/Partida");
exports.partidaRepository = data_source_1.AppDataSource.getRepository(Partida_1.Partida);
