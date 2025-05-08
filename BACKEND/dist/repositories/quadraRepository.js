"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quadraRepository = void 0;
const data_source_1 = require("../data-source");
const Quadra_1 = require("../entities/Quadra");
exports.quadraRepository = data_source_1.AppDataSource.getRepository(Quadra_1.Quadra);
