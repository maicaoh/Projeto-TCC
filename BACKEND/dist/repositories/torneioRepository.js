"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.torneioRepository = void 0;
const data_source_1 = require("../data-source");
const Torneio_1 = require("../entities/Torneio");
exports.torneioRepository = data_source_1.AppDataSource.getRepository(Torneio_1.Torneio);
