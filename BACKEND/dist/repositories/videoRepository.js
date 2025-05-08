"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRepository = void 0;
const data_source_1 = require("../data-source");
const Video_1 = require("../entities/Video");
exports.videoRepository = data_source_1.AppDataSource.getRepository(Video_1.Video);
