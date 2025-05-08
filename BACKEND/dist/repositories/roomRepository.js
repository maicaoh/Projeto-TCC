"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRepository = void 0;
const data_source_1 = require("../data-source");
const Room_1 = require("../entities/Room");
exports.roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
