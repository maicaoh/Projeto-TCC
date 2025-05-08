"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arbitroRepository = void 0;
const data_source_1 = require("../data-source");
const Arbitro_1 = require("../entities/Arbitro");
exports.arbitroRepository = data_source_1.AppDataSource.getRepository(Arbitro_1.Arbitro);
