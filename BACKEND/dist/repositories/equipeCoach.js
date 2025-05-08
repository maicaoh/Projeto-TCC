"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipeCoachRepository = void 0;
const data_source_1 = require("../data-source");
const Equipe_Tecnico_1 = require("../entities/Equipe_Tecnico");
exports.equipeCoachRepository = data_source_1.AppDataSource.getRepository(Equipe_Tecnico_1.Equipe_Tecnico);
