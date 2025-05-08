"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachRepository = void 0;
const data_source_1 = require("../data-source");
const Coach_1 = require("../entities/Coach");
exports.coachRepository = data_source_1.AppDataSource.getRepository(Coach_1.Coach);
