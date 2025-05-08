"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipeRepository = void 0;
const data_source_1 = require("../data-source");
const Equipe_1 = require("../entities/Equipe");
exports.equipeRepository = data_source_1.AppDataSource.getRepository(Equipe_1.Equipe);
