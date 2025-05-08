"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectRepository = void 0;
const data_source_1 = require("../data-source");
const Subject_1 = require("../entities/Subject");
exports.subjectRepository = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
