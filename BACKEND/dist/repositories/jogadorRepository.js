"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jogadorRepository = void 0;
const data_source_1 = require("../data-source");
const Jogador_1 = require("../entities/Jogador");
exports.jogadorRepository = data_source_1.AppDataSource.getRepository(Jogador_1.Jogador);
